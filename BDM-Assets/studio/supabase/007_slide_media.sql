-- ============================================================
-- 007: 슬라이드별 이미지 저장 + slide-images Storage 버킷
-- - generations.slide_media JSONB: 슬라이드별 선택된 이미지 정보
-- - slide-images 버킷: 유저가 직접 업로드한 커스텀 이미지
-- - RLS: 유저는 자기 폴더만 접근
-- ============================================================

-- 1. Storage 버킷 (이미 있으면 skip)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'slide-images',
  'slide-images',
  false,
  10 * 1024 * 1024,
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Users upload own slide images" ON storage.objects;
CREATE POLICY "Users upload own slide images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'slide-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users read own slide images" ON storage.objects;
CREATE POLICY "Users read own slide images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'slide-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users delete own slide images" ON storage.objects;
CREATE POLICY "Users delete own slide images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'slide-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 2. generations에 슬라이드 미디어 저장 컬럼
-- 구조: [{ "role": "cover|slide|outro", "index": 0, "source": "pexels|upload",
--         "url": "https://...", "storage_path": null, "pexels_id": 123,
--         "photographer": "...", "keyword_used": "..." }, ...]
ALTER TABLE public.generations
  ADD COLUMN IF NOT EXISTS slide_media JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.generations.slide_media IS
  '슬라이드별 선택된 이미지 메타. Pexels URL 또는 업로드된 storage path.';

-- 완료
