-- ============================================================
-- 006: 스타일 스크린샷용 Storage 버킷 + 집단지성 버전 팩토리 보완
-- - style-screenshots 버킷 생성 (private, 유저별 폴더 격리)
-- - ratings에 gemini_review JSONB 컬럼 (자동 평가 저장용)
-- - improvements.selected_suggestions 컬럼 (피드백 큐레이션 기록)
-- - style_items에 source_kind 확장 ('generation' 추가 — 최종 컨펌물이 스타일 반영될 때 사용)
-- - RLS: 유저는 자기 폴더만 업로드/다운로드
-- ============================================================

-- 1. Storage 버킷 생성 (이미 있으면 skip)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'style-screenshots',
  'style-screenshots',
  false,
  8 * 1024 * 1024,   -- 8MB 제한
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage RLS: 유저는 자기 user_id 폴더만 접근
-- 경로 규칙: {user_id}/{style_id}/{uuid}.png
DROP POLICY IF EXISTS "Users upload own screenshots" ON storage.objects;
CREATE POLICY "Users upload own screenshots"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'style-screenshots'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users read own screenshots" ON storage.objects;
CREATE POLICY "Users read own screenshots"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'style-screenshots'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users delete own screenshots" ON storage.objects;
CREATE POLICY "Users delete own screenshots"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'style-screenshots'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 3. ratings에 자동 평가(Gemini) 결과 저장 컬럼
-- 기존 ratings는 사람이 매기는 5점 척도. gemini_review는 자동 평가(hook/data/flow/cta + 제안)
ALTER TABLE public.ratings
  ADD COLUMN IF NOT EXISTS gemini_review JSONB,
  ADD COLUMN IF NOT EXISTS auto_review_model TEXT;

COMMENT ON COLUMN public.ratings.gemini_review IS
  '자동 평가 결과 (Gemini 2.5 Flash). {hook, data, flow, cta, total, feedback, suggestions[]}';

-- 4. improvements에 피드백 큐레이션 이력
-- selected_suggestions: Gemini 제안 중 유저가 체크한 것 (배열)
-- custom_instruction: 유저 자유 입력 (추가 지시)
ALTER TABLE public.improvements
  ADD COLUMN IF NOT EXISTS selected_suggestions JSONB,
  ADD COLUMN IF NOT EXISTS custom_instruction TEXT;

COMMENT ON COLUMN public.improvements.selected_suggestions IS
  'Gemini 제안 중 유저가 선택한 것 (text 배열)';
COMMENT ON COLUMN public.improvements.custom_instruction IS
  '유저가 자유 입력한 추가 지시사항';

-- 5. style_items에 source_kind (어디서 온 레퍼런스인지)
ALTER TABLE public.style_items
  ADD COLUMN IF NOT EXISTS source_kind TEXT
    CHECK (source_kind IN ('screenshot', 'url', 'generation'))
    DEFAULT 'screenshot',
  ADD COLUMN IF NOT EXISTS generation_id UUID REFERENCES public.generations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS label TEXT;  -- 유저가 단 라벨 (예: "틱톡 관심그래프 성공작")

COMMENT ON COLUMN public.style_items.source_kind IS
  'screenshot=스크린샷 업로드, url=인스타 URL 붙여넣기, generation=최종 컨펌물 스타일 반영';

-- 6. carousels에 final_approved_at 기록
ALTER TABLE public.carousels
  ADD COLUMN IF NOT EXISTS final_approved_at TIMESTAMPTZ;

-- 7. styles.analyzed 재분석 플래그 (UI에서 "다시 분석" 누르면 true로)
ALTER TABLE public.styles
  ADD COLUMN IF NOT EXISTS needs_reanalyze BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS last_analyzed_at TIMESTAMPTZ;

-- 8. Helper RPC: 최종 컨펌물을 스타일에 반영
CREATE OR REPLACE FUNCTION public.reflect_generation_to_style(
  p_generation_id UUID,
  p_style_id UUID,
  p_label TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
  v_item_id UUID;
BEGIN
  -- 권한 체크: generation이 호출자 소유인지
  SELECT c.user_id INTO v_user_id
  FROM public.generations g
  JOIN public.carousels c ON c.id = g.carousel_id
  WHERE g.id = p_generation_id;

  IF v_user_id IS NULL OR v_user_id <> auth.uid() THEN
    RAISE EXCEPTION 'generation not found or not owned';
  END IF;

  -- 스타일이 호출자 소유인지
  IF NOT EXISTS (SELECT 1 FROM public.styles WHERE id = p_style_id AND user_id = auth.uid()) THEN
    RAISE EXCEPTION 'style not found or not owned';
  END IF;

  -- style_item insert (source_kind='generation', generation_id 링크)
  INSERT INTO public.style_items (user_id, style_id, source_kind, generation_id, label, analyzed)
  SELECT auth.uid(), p_style_id, 'generation', p_generation_id, p_label,
         jsonb_build_object('from_generation', g.output, 'note', '최종 컨펌물 스타일 반영')
  FROM public.generations g WHERE g.id = p_generation_id
  RETURNING id INTO v_item_id;

  -- 재분석 필요 플래그
  UPDATE public.styles SET needs_reanalyze = TRUE, updated_at = NOW()
  WHERE id = p_style_id;

  RETURN v_item_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.reflect_generation_to_style IS
  '최종 컨펌 generation을 특정 style에 synthetic style_item으로 반영. 집단지성 학습 루프의 핵심.';

-- ============================================================
-- 완료
-- 확인 쿼리:
-- SELECT * FROM storage.buckets WHERE id = 'style-screenshots';
-- \d public.style_items
-- \d public.improvements
-- ============================================================
