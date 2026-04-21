-- ============================================================
-- Migration 010 · 이메일 Allowlist (베타 초대 대상만 접근)
-- - allowed_emails 테이블: 관리자가 지정한 이메일만 가입 허용
-- - handle_new_user() 트리거 교체: 목록에 없으면 회원 생성 RAISE로 차단
-- - @hanyang.ac.kr 도메인 규칙은 유지하지 않음 (명시적 리스트만 사용)
-- - 관리자(교수님)의 이메일은 시드에 자동 포함
-- ============================================================

-- ─ 1. allowed_emails 테이블 ──────────────────────────────────
CREATE TABLE IF NOT EXISTS allowed_emails (
  email      TEXT PRIMARY KEY,                              -- lower-case로 저장
  note       TEXT,                                           -- "조교 채현", "학생 홍길동" 등
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 저장 시 자동 소문자화
CREATE OR REPLACE FUNCTION allowed_emails_lowercase()
RETURNS TRIGGER AS $$
BEGIN
  NEW.email := LOWER(TRIM(NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_allowed_emails_lower ON allowed_emails;
CREATE TRIGGER trg_allowed_emails_lower
  BEFORE INSERT OR UPDATE ON allowed_emails
  FOR EACH ROW EXECUTE FUNCTION allowed_emails_lowercase();

-- ─ 2. RLS: 관리자(is_admin=true)만 읽기/쓰기 가능 ────────────
ALTER TABLE allowed_emails ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allowed read admin"  ON allowed_emails;
DROP POLICY IF EXISTS "allowed write admin" ON allowed_emails;

CREATE POLICY "allowed read admin" ON allowed_emails
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin));

CREATE POLICY "allowed write admin" ON allowed_emails
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin))
  WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin));

-- ─ 3. handle_new_user() 트리거 교체: allowlist 체크 + 차단 ──
-- 기존 함수는 001에서 생성됨. CREATE OR REPLACE로 덮어쓰기.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  allowed BOOLEAN;
  is_admin_seed BOOLEAN := FALSE;
BEGIN
  -- 관리자 이메일은 무조건 통과 (seed에서 등록됨)
  IF LOWER(NEW.email) = 'boram8235@gmail.com' THEN
    is_admin_seed := TRUE;
  ELSE
    -- allowlist에 있는지 확인
    SELECT EXISTS (
      SELECT 1 FROM public.allowed_emails
      WHERE email = LOWER(NEW.email)
    ) INTO allowed;

    IF NOT allowed THEN
      RAISE EXCEPTION 'email_not_allowed: % is not on the beta allowlist. Contact the administrator.', NEW.email
        USING ERRCODE = 'P0001';
    END IF;
  END IF;

  -- 정상 가입: public.users 프로필 생성
  INSERT INTO public.users (id, email, name, is_admin)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email),
    is_admin_seed
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─ 4. 관리자 계정 플래그 (이미 가입된 경우에도 보정) ─────────
UPDATE public.users SET is_admin = TRUE
WHERE LOWER(email) = 'boram8235@gmail.com';

-- ─ 5. 시드: 교수님 본인 이메일 + 한양대 이메일 하나 예시 ─────
INSERT INTO allowed_emails (email, note) VALUES
  ('boram8235@gmail.com',      '관리자 · 교수님'),
  ('brlim@hanyang.ac.kr',      '관리자 · 한양대 계정')
ON CONFLICT (email) DO NOTHING;

-- ─ 6. 편의용: 관리자 RPC로 batch 추가 ────────────────────────
CREATE OR REPLACE FUNCTION admin_add_allowed_emails(
  p_emails TEXT[],
  p_note TEXT DEFAULT NULL
) RETURNS INT AS $$
DECLARE
  inserted INT;
BEGIN
  -- 관리자만 실행 가능
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin) THEN
    RAISE EXCEPTION 'admin_only';
  END IF;

  WITH ins AS (
    INSERT INTO allowed_emails (email, note, invited_by)
    SELECT LOWER(TRIM(unnest(p_emails))), p_note, auth.uid()
    ON CONFLICT (email) DO NOTHING
    RETURNING 1
  )
  SELECT COUNT(*)::INT INTO inserted FROM ins;
  RETURN inserted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 간단 뷰: 베타 등록·가입 현황 한눈에
CREATE OR REPLACE VIEW allowed_emails_status AS
SELECT
  a.email,
  a.note,
  a.created_at AS invited_at,
  u.id         AS user_id,
  u.created_at AS signed_up_at,
  (u.id IS NOT NULL) AS has_signed_up
FROM allowed_emails a
LEFT JOIN public.users u ON LOWER(u.email) = a.email
ORDER BY a.created_at DESC;
