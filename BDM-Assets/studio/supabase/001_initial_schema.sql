-- ============================================================
-- BDM Lab Studio · Initial Schema
-- Run this in Supabase SQL Editor (copy-paste whole file)
-- Created: 2026-04-20
-- ============================================================

-- ============================================================
-- 1. USERS (auth.users는 Supabase가 관리. public.users는 프로필 + 쿼터)
-- ============================================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  is_admin BOOLEAN DEFAULT FALSE,

  -- 학습된 스타일 프로필 (JSON으로 유연하게 저장)
  learned_style JSONB,

  -- 쿼터 관리
  monthly_quota INT DEFAULT 30,
  usage_this_month INT DEFAULT 0,
  quota_resets_at TIMESTAMPTZ DEFAULT DATE_TRUNC('month', NOW()) + INTERVAL '1 month',

  vision_quota INT DEFAULT 10,
  vision_usage INT DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.users IS '사용자 프로필 및 쿼터. auth.users와 1:1 관계.';

-- 새 사용자 자동 생성 (OAuth 후 자동 insert)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 2. STYLE_ITEMS (학습 대상 게시물들)
-- ============================================================
CREATE TABLE public.style_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  source_type TEXT CHECK (source_type IN ('url', 'screenshot')),
  source_url TEXT,
  screenshot_path TEXT,  -- Supabase Storage 경로

  -- Claude Vision/분석 결과
  analyzed JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_style_items_user ON public.style_items(user_id);

-- ============================================================
-- 3. CAROUSELS (최상위: 하나의 '캐러셀 작업 단위')
-- ============================================================
CREATE TABLE public.carousels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  topic TEXT NOT NULL,
  category TEXT,
  tone TEXT,
  length TEXT,  -- '5-7', '7-10', '10-12'

  status TEXT DEFAULT 'drafting' CHECK (status IN ('drafting', 'finalized', 'published', 'archived')),
  finalized_generation_id UUID,  -- 최종 선택된 버전

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_carousels_user ON public.carousels(user_id);
CREATE INDEX idx_carousels_status ON public.carousels(status);

-- ============================================================
-- 4. GENERATIONS (버전별 캐러셀 출력)
-- ============================================================
CREATE TABLE public.generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  carousel_id UUID NOT NULL REFERENCES public.carousels(id) ON DELETE CASCADE,

  version INT NOT NULL,  -- 1, 2, 3, ...
  prompt_used TEXT,       -- 사용된 시스템 프롬프트 (디버깅/분석용)
  engine_version TEXT,    -- 'v1.0', 'v1.1' 등 (엔진 버전 추적)
  output JSONB NOT NULL,  -- 전체 캐러셀 JSON

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(carousel_id, version)
);

CREATE INDEX idx_generations_carousel ON public.generations(carousel_id);
CREATE INDEX idx_generations_engine ON public.generations(engine_version);

-- ============================================================
-- 5. IMPROVEMENTS (개선 요청 이력)
-- ============================================================
CREATE TABLE public.improvements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_generation_id UUID NOT NULL REFERENCES public.generations(id),
  to_generation_id UUID REFERENCES public.generations(id),

  feedback_text TEXT NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_improvements_from ON public.improvements(from_generation_id);

-- ============================================================
-- 6. RATINGS (유저가 매긴 평가)
-- ============================================================
CREATE TABLE public.ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generation_id UUID NOT NULL REFERENCES public.generations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  hook_score INT CHECK (hook_score BETWEEN 1 AND 10),
  data_score INT CHECK (data_score BETWEEN 1 AND 10),
  visual_score INT CHECK (visual_score BETWEEN 1 AND 10),
  title_score INT CHECK (title_score BETWEEN 1 AND 10),
  flow_score INT CHECK (flow_score BETWEEN 1 AND 10),
  total INT GENERATED ALWAYS AS (hook_score + data_score + visual_score + title_score + flow_score) STORED,

  -- 낮은 점수 항목에 대한 개선 메모 (JSON: {hook: "...", visual: "..."})
  low_score_reasons JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(generation_id, user_id)  -- 한 유저는 한 버전에 한 번만 평가
);

CREATE INDEX idx_ratings_generation ON public.ratings(generation_id);

-- ============================================================
-- 7. PUBLICATIONS (게시 및 성과 추적)
-- ============================================================
CREATE TABLE public.publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  carousel_id UUID NOT NULL REFERENCES public.carousels(id) ON DELETE CASCADE,
  chosen_generation_id UUID NOT NULL REFERENCES public.generations(id),

  posted_at TIMESTAMPTZ,
  post_url TEXT,

  -- 성과 지표 (시간 지남에 따라 업데이트)
  views INT,
  saves INT,
  shares INT,
  likes INT,
  comments INT,

  notes TEXT,  -- 유저 자유 메모

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_publications_carousel ON public.publications(carousel_id);

-- ============================================================
-- 8. API_CALLS (비용 추적의 원천 - 서버가 모든 API 호출 로깅)
-- ============================================================
CREATE TABLE public.api_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,

  operation TEXT NOT NULL,  -- 'generate' | 'regenerate' | 'review' | 'vision_analyze'
  model TEXT NOT NULL,      -- 'claude-sonnet-4-6' | 'gemini-2.0-flash' 등

  input_tokens INT,
  output_tokens INT,
  cost_usd NUMERIC(10,6),
  duration_ms INT,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,

  carousel_id UUID REFERENCES public.carousels(id) ON DELETE SET NULL,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_api_calls_user ON public.api_calls(user_id);
CREATE INDEX idx_api_calls_created ON public.api_calls(created_at DESC);

-- ============================================================
-- 9. ENGINE_VERSIONS (엔진 버전 이력 - 업데이트 투명성)
-- ============================================================
CREATE TABLE public.engine_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version_tag TEXT UNIQUE NOT NULL,  -- 'v1.0', 'v1.1' 등

  system_prompt TEXT NOT NULL,
  changelog TEXT,

  based_on_data_count INT,  -- 몇 건 데이터 기반으로 만들어졌는지

  is_active BOOLEAN DEFAULT FALSE,  -- 현재 쓰는 버전
  deployed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 초기 v1.0 삽입 (나중에 UPDATE로 프롬프트 내용 채움)
INSERT INTO public.engine_versions (version_tag, system_prompt, changelog, is_active)
VALUES ('v1.0', '(초기 프롬프트는 Edge Function 배포 시 업데이트)', '초기 베타 버전', TRUE);

-- ============================================================
-- 10. VIEWS (대시보드용 - 관리자가 쉽게 조회)
-- ============================================================

-- 일별 비용
CREATE OR REPLACE VIEW public.daily_costs AS
SELECT
  DATE(created_at) AS day,
  COUNT(*) AS calls,
  COUNT(DISTINCT user_id) AS active_users,
  SUM(input_tokens) AS in_tokens,
  SUM(output_tokens) AS out_tokens,
  ROUND(SUM(cost_usd)::numeric, 4) AS cost_usd
FROM public.api_calls
WHERE success = TRUE
GROUP BY DATE(created_at)
ORDER BY day DESC;

-- 유저별 월간 사용량
CREATE OR REPLACE VIEW public.monthly_usage AS
SELECT
  u.id,
  u.email,
  u.name,
  u.monthly_quota,
  u.usage_this_month,
  COALESCE(COUNT(a.id), 0) AS api_calls_this_month,
  ROUND(COALESCE(SUM(a.cost_usd), 0)::numeric, 4) AS cost_this_month_usd
FROM public.users u
LEFT JOIN public.api_calls a
  ON a.user_id = u.id
  AND a.created_at >= DATE_TRUNC('month', NOW())
  AND a.success = TRUE
GROUP BY u.id, u.email, u.name, u.monthly_quota, u.usage_this_month
ORDER BY cost_this_month_usd DESC;

-- 엔진 버전별 평균 평가 점수 (집단 지성 분석용)
CREATE OR REPLACE VIEW public.engine_performance AS
SELECT
  g.engine_version,
  COUNT(DISTINCT g.id) AS generations,
  COUNT(DISTINCT r.id) AS ratings,
  ROUND(AVG(r.total)::numeric, 2) AS avg_total_score,
  ROUND(AVG(r.hook_score)::numeric, 2) AS avg_hook,
  ROUND(AVG(r.data_score)::numeric, 2) AS avg_data,
  ROUND(AVG(r.visual_score)::numeric, 2) AS avg_visual
FROM public.generations g
LEFT JOIN public.ratings r ON r.generation_id = g.id
GROUP BY g.engine_version
ORDER BY g.engine_version;

-- ============================================================
-- 11. RLS POLICIES (Row Level Security)
-- ============================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.style_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carousels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.improvements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engine_versions ENABLE ROW LEVEL SECURITY;

-- users: 자기 프로필만 읽기/업데이트
CREATE POLICY "Users read own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
-- 관리자는 모두 조회
CREATE POLICY "Admins read all users" ON public.users FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE)
);

-- style_items: 자기 것만
CREATE POLICY "Users manage own style items" ON public.style_items FOR ALL USING (auth.uid() = user_id);

-- carousels: 자기 것만
CREATE POLICY "Users manage own carousels" ON public.carousels FOR ALL USING (auth.uid() = user_id);

-- generations: 자기 캐러셀 것만
CREATE POLICY "Users manage own generations" ON public.generations FOR ALL USING (
  EXISTS (SELECT 1 FROM public.carousels c WHERE c.id = carousel_id AND c.user_id = auth.uid())
);

-- improvements: generation을 통해 확인
CREATE POLICY "Users manage own improvements" ON public.improvements FOR ALL USING (
  EXISTS (SELECT 1 FROM public.generations g
          JOIN public.carousels c ON c.id = g.carousel_id
          WHERE g.id = from_generation_id AND c.user_id = auth.uid())
);

-- ratings: 자기 평가만
CREATE POLICY "Users manage own ratings" ON public.ratings FOR ALL USING (auth.uid() = user_id);

-- publications: 자기 캐러셀 것만
CREATE POLICY "Users manage own publications" ON public.publications FOR ALL USING (
  EXISTS (SELECT 1 FROM public.carousels c WHERE c.id = carousel_id AND c.user_id = auth.uid())
);

-- api_calls: 자기 것만 (관리자는 전체)
CREATE POLICY "Users read own api_calls" ON public.api_calls FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins read all api_calls" ON public.api_calls FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE)
);
-- INSERT는 Edge Function(service_role)만 가능 — 클라이언트는 직접 insert 불가

-- engine_versions: 모두 읽기 가능 (투명성)
CREATE POLICY "Everyone reads engine versions" ON public.engine_versions FOR SELECT USING (TRUE);

-- ============================================================
-- 12. 월간 쿼터 리셋 함수 (cron으로 매월 1일 실행 예정)
-- ============================================================
CREATE OR REPLACE FUNCTION public.reset_monthly_quotas()
RETURNS void AS $$
BEGIN
  UPDATE public.users
  SET
    usage_this_month = 0,
    vision_usage = 0,
    quota_resets_at = DATE_TRUNC('month', NOW()) + INTERVAL '1 month';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 완료! 테이블 9개 + 뷰 3개 + 함수 2개 + RLS 정책 생성됨
-- ============================================================
