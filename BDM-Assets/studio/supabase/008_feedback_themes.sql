-- ============================================================
-- Migration 008 · 집단지성 피드백 수집
-- - feedback_themes: 주제 분야 태그 카테고리 (관리자 관리)
-- - generation_feedback: 컨펌된 캐러셀에 대한 유저 피드백
--   (점수 3종 + 테마 태그 복수 + "기타" 자유입력 + 자유의견)
-- - "기타" 자유입력은 주기적 엔진 업데이트 시 카테고리 승격 재료
-- ============================================================

-- ─ 1. feedback_themes: 선택지 카테고리 ────────────────────────
CREATE TABLE IF NOT EXISTS feedback_themes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug       TEXT UNIQUE NOT NULL,
  label      TEXT NOT NULL,
  emoji      TEXT,                            -- 칩 앞에 붙일 이모지 (선택)
  sort_order INT DEFAULT 0,
  is_active  BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS feedback_themes_active_sort
  ON feedback_themes (is_active, sort_order);

-- ─ 2. generation_feedback: 피드백 본체 ────────────────────────
CREATE TABLE IF NOT EXISTS generation_feedback (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  generation_id   UUID NOT NULL REFERENCES generations(id) ON DELETE CASCADE,
  carousel_id     UUID NOT NULL REFERENCES carousels(id)   ON DELETE CASCADE,

  -- 점수 (1~5, 선택 사항 — 생략하면 NULL)
  topic_fit_score         SMALLINT CHECK (topic_fit_score BETWEEN 1 AND 5),
  style_consistency_score SMALLINT CHECK (style_consistency_score BETWEEN 1 AND 5),
  hook_strength_score     SMALLINT CHECK (hook_strength_score BETWEEN 1 AND 5),

  -- 테마 태그 (선택지 + 기타)
  theme_slugs  TEXT[] DEFAULT '{}',   -- 선택된 feedback_themes.slug 배열
  theme_custom TEXT,                  -- "기타" 자유입력 (카테고리 승격 재료)

  -- 자유 의견
  free_feedback TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- 한 generation당 한 유저의 피드백은 하나 (덮어쓰기)
  UNIQUE (generation_id, user_id)
);

CREATE INDEX IF NOT EXISTS generation_feedback_user
  ON generation_feedback (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS generation_feedback_carousel
  ON generation_feedback (carousel_id);
CREATE INDEX IF NOT EXISTS generation_feedback_theme_slugs
  ON generation_feedback USING GIN (theme_slugs);

-- updated_at 자동 갱신
CREATE OR REPLACE FUNCTION touch_generation_feedback_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_generation_feedback_touch ON generation_feedback;
CREATE TRIGGER trg_generation_feedback_touch
  BEFORE UPDATE ON generation_feedback
  FOR EACH ROW EXECUTE FUNCTION touch_generation_feedback_updated_at();

-- ─ 3. RLS ─────────────────────────────────────────────────────
ALTER TABLE feedback_themes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_feedback  ENABLE ROW LEVEL SECURITY;

-- 테마 목록은 로그인 유저 누구나 읽기
DROP POLICY IF EXISTS "themes read active" ON feedback_themes;
CREATE POLICY "themes read active" ON feedback_themes
  FOR SELECT TO authenticated
  USING (is_active);

-- 피드백은 본인 것만 읽/쓰기
DROP POLICY IF EXISTS "fb read own"   ON generation_feedback;
DROP POLICY IF EXISTS "fb insert own" ON generation_feedback;
DROP POLICY IF EXISTS "fb update own" ON generation_feedback;
DROP POLICY IF EXISTS "fb delete own" ON generation_feedback;

CREATE POLICY "fb read own" ON generation_feedback
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "fb insert own" ON generation_feedback
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "fb update own" ON generation_feedback
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "fb delete own" ON generation_feedback
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- ─ 4. 시드 테마 (BDM Lab 콘텐츠 맥락에 맞춰 12개) ─────────────
INSERT INTO feedback_themes (slug, label, emoji, sort_order) VALUES
  ('algorithm-platform',  '알고리즘 · 플랫폼',   '⚙️',  10),
  ('marketing-branding',  '마케팅 · 브랜딩',     '📣',  20),
  ('ai-tech',             'AI · 테크',           '🤖',  30),
  ('consumer-behavior',   '소비자 행동',         '🛍',  40),
  ('data-analytics',      '데이터 · 분석',       '📊',  50),
  ('research-insight',    '리서치 인사이트',     '🔬',  60),
  ('case-study',          '케이스 스터디',       '📁',  70),
  ('trend-forecast',      '트렌드 · 전망',       '📈',  80),
  ('academic-education',  '학술 · 교육',         '🎓',  90),
  ('practical-tips',      '실무 팁',             '🛠',  100),
  ('interview-story',     '인터뷰 · 스토리',     '💬',  110),
  ('column-essay',        '칼럼 · 에세이',       '✍️',  120)
ON CONFLICT (slug) DO NOTHING;

-- ─ 5. 집단지성 뷰: 테마별 평균 점수 (엔진 업데이트 참고용) ────
CREATE OR REPLACE VIEW feedback_by_theme AS
SELECT
  t.slug,
  t.label,
  t.emoji,
  COUNT(f.id) AS feedback_count,
  ROUND(AVG(f.topic_fit_score)::NUMERIC, 2)         AS avg_topic_fit,
  ROUND(AVG(f.style_consistency_score)::NUMERIC, 2) AS avg_style_consistency,
  ROUND(AVG(f.hook_strength_score)::NUMERIC, 2)     AS avg_hook_strength
FROM feedback_themes t
LEFT JOIN generation_feedback f
  ON t.slug = ANY(f.theme_slugs)
WHERE t.is_active
GROUP BY t.slug, t.label, t.emoji, t.sort_order
ORDER BY t.sort_order;

-- ─ 6. 기타 자유입력 승격 후보 뷰 (관리자 주기 검토용) ─────────
CREATE OR REPLACE VIEW feedback_theme_custom_candidates AS
SELECT
  LOWER(TRIM(theme_custom))                  AS raw_text,
  COUNT(*)                                    AS mention_count,
  ARRAY_AGG(DISTINCT user_id)                 AS users,
  MIN(created_at)                             AS first_seen,
  MAX(created_at)                             AS last_seen
FROM generation_feedback
WHERE theme_custom IS NOT NULL
  AND LENGTH(TRIM(theme_custom)) > 0
GROUP BY LOWER(TRIM(theme_custom))
ORDER BY mention_count DESC, last_seen DESC;
