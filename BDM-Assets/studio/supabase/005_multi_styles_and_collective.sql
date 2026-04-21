-- ============================================================
-- 005: 다중 스타일 + 집단 지성 인프라
-- - 한 유저가 스타일 여러 개 가질 수 있도록 styles 테이블 추가
-- - style_items, carousels에 style_id FK 추가
-- - top_rated_generations 뷰 (집단 지성 분석용)
-- ============================================================

-- 1. styles 테이블: 스타일 프로필 (유저당 여러 개)
CREATE TABLE public.styles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  name TEXT NOT NULL,              -- 예: "연구 인사이트 스타일", "가벼운 소식용", "학생 공유용"
  description TEXT,
  is_default BOOLEAN DEFAULT FALSE, -- 생성 시 기본 선택될 스타일

  -- Vision 분석으로 추출된 스타일 프로필 (집계된 JSONB)
  -- 예: {tone, hook_patterns[], keywords[], visual_patterns, structure_rules, forbidden[]}
  analyzed JSONB,

  item_count INT DEFAULT 0,         -- 이 스타일에 속한 레퍼런스 수 (캐시)

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_styles_user ON public.styles(user_id);
CREATE INDEX idx_styles_default ON public.styles(user_id, is_default);

ALTER TABLE public.styles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own styles" ON public.styles FOR ALL USING (auth.uid() = user_id);

-- 2. style_items에 style_id FK 추가 (어느 스타일 묶음에 속하는지)
ALTER TABLE public.style_items
  ADD COLUMN style_id UUID REFERENCES public.styles(id) ON DELETE CASCADE;
CREATE INDEX idx_style_items_style ON public.style_items(style_id);

-- 3. carousels에 style_id 추가 (이 캐러셀이 어느 스타일로 만들어졌나)
ALTER TABLE public.carousels
  ADD COLUMN style_id UUID REFERENCES public.styles(id) ON DELETE SET NULL;
CREATE INDEX idx_carousels_style ON public.carousels(style_id);

-- 4. users.learned_style deprecated (호환성 유지)
COMMENT ON COLUMN public.users.learned_style IS
  'DEPRECATED (005 마이그레이션 이후). 이제 public.styles 테이블을 사용. 기존 데이터 보존용';

-- 5. 기본 스타일 자동 생성 트리거 (가입 시 빈 기본 스타일 1개 자동 생성)
CREATE OR REPLACE FUNCTION public.create_default_style()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.styles (user_id, name, description, is_default)
  VALUES (NEW.id, '기본 스타일', '첫 기본 스타일 — 레퍼런스 추가 후 분석해서 완성하세요', TRUE);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_user_created_default_style
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.create_default_style();

-- 기존 유저에게도 기본 스타일 생성 (본인만 해당 — 베타 초기)
INSERT INTO public.styles (user_id, name, description, is_default)
SELECT id, '기본 스타일', '첫 기본 스타일 — 레퍼런스 추가 후 분석해서 완성하세요', TRUE
FROM public.users u
WHERE NOT EXISTS (SELECT 1 FROM public.styles s WHERE s.user_id = u.id);

-- 6. style_items 수가 바뀔 때 styles.item_count 자동 업데이트
CREATE OR REPLACE FUNCTION public.refresh_style_item_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.style_id IS NOT NULL THEN
    UPDATE public.styles SET item_count = item_count + 1, updated_at = NOW()
    WHERE id = NEW.style_id;
  ELSIF TG_OP = 'DELETE' AND OLD.style_id IS NOT NULL THEN
    UPDATE public.styles SET item_count = GREATEST(item_count - 1, 0), updated_at = NOW()
    WHERE id = OLD.style_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_style_item_change
  AFTER INSERT OR DELETE ON public.style_items
  FOR EACH ROW EXECUTE FUNCTION public.refresh_style_item_count();

-- 7. 집단 지성 뷰: 고득점 생성물
-- 평균 평가 40점 이상 or 게시 후 저장수 100+ 인 generations
CREATE OR REPLACE VIEW public.top_rated_generations AS
SELECT
  g.id AS generation_id,
  g.carousel_id,
  c.topic,
  c.category,
  g.engine_version,
  g.output,
  ROUND(AVG(r.total)::numeric, 2) AS avg_total,
  COUNT(DISTINCT r.id) AS rating_count,
  MAX(p.views) AS top_views,
  MAX(p.saves) AS top_saves,
  MAX(p.shares) AS top_shares,
  MAX(p.posted_at) AS last_posted_at
FROM public.generations g
JOIN public.carousels c ON c.id = g.carousel_id
LEFT JOIN public.ratings r ON r.generation_id = g.id
LEFT JOIN public.publications p ON p.chosen_generation_id = g.id
GROUP BY g.id, g.carousel_id, c.topic, c.category, g.engine_version, g.output
HAVING AVG(r.total) >= 40 OR MAX(p.saves) >= 100
ORDER BY avg_total DESC NULLS LAST;

COMMENT ON VIEW public.top_rated_generations IS
  '집단 지성: 평균 평가 40+점 또는 저장수 100+ 고성과 생성물. 엔진 버전 업데이트 분석의 기반 데이터.';

-- 8. 스타일별 생성물 통계 뷰 (스타일 효과 측정)
CREATE OR REPLACE VIEW public.style_performance AS
SELECT
  s.id AS style_id,
  s.user_id,
  s.name AS style_name,
  s.item_count,
  COUNT(DISTINCT c.id) AS carousels_generated,
  COUNT(DISTINCT p.id) AS published_count,
  ROUND(AVG(r.total)::numeric, 2) AS avg_rating,
  MAX(p.saves) AS best_saves
FROM public.styles s
LEFT JOIN public.carousels c ON c.style_id = s.id
LEFT JOIN public.generations g ON g.carousel_id = c.id
LEFT JOIN public.ratings r ON r.generation_id = g.id
LEFT JOIN public.publications p ON p.carousel_id = c.id
GROUP BY s.id, s.user_id, s.name, s.item_count;

-- ============================================================
-- 완료 확인
-- SELECT * FROM public.styles WHERE user_id = auth.uid();
-- ============================================================
