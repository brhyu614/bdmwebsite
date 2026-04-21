-- ============================================================
-- Migration 009 · 베타 버그/문제 제보
-- - bug_reports: 테스터(조교/학생)가 상단 🐛 버튼으로 보내는 리포트
-- - generation_id/carousel_id/style_id는 선택 — 로그인 상태면 누구나 제보 가능
-- - 관리자가 뷰로 최신순 정렬해서 확인
-- ============================================================

CREATE TABLE IF NOT EXISTS bug_reports (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email     TEXT,                -- 조회 편의용 스냅샷
  step           TEXT,                -- 'step1' | 'step2' | 'step3' | 'step4' | 'styles' | 'login' | 'other'
  description    TEXT NOT NULL,
  reproduction   TEXT,
  url            TEXT,
  user_agent     TEXT,
  generation_id  UUID REFERENCES generations(id) ON DELETE SET NULL,
  carousel_id    UUID REFERENCES carousels(id)   ON DELETE SET NULL,
  style_id       UUID REFERENCES styles(id)      ON DELETE SET NULL,
  status         TEXT DEFAULT 'new',  -- 'new' | 'triaged' | 'in_progress' | 'resolved' | 'wontfix'
  admin_note     TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS bug_reports_created  ON bug_reports (created_at DESC);
CREATE INDEX IF NOT EXISTS bug_reports_status   ON bug_reports (status, created_at DESC);
CREATE INDEX IF NOT EXISTS bug_reports_user     ON bug_reports (user_id, created_at DESC);

-- ─ RLS ────────────────────────────────────────────────────────
ALTER TABLE bug_reports ENABLE ROW LEVEL SECURITY;

-- 본인 리포트만 읽을 수 있음 (관리자는 service_role로 조회)
DROP POLICY IF EXISTS "bug read own"   ON bug_reports;
DROP POLICY IF EXISTS "bug insert own" ON bug_reports;

CREATE POLICY "bug read own" ON bug_reports
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- 본인 user_id로만 insert (edge function이 검증)
CREATE POLICY "bug insert own" ON bug_reports
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- ─ 관리자용 뷰 (신규 순) ──────────────────────────────────────
CREATE OR REPLACE VIEW bug_reports_dashboard AS
SELECT
  b.id,
  b.created_at,
  b.status,
  b.step,
  b.description,
  b.reproduction,
  b.url,
  b.user_agent,
  b.user_email,
  u.email AS current_user_email,
  b.generation_id,
  b.carousel_id,
  b.style_id,
  s.name AS style_name,
  b.admin_note
FROM bug_reports b
LEFT JOIN public.users u ON u.id = b.user_id
LEFT JOIN styles       s ON s.id = b.style_id
ORDER BY b.created_at DESC;
