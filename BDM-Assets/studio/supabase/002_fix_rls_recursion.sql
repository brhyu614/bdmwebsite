-- ============================================================
-- Fix: RLS 무한 재귀 해결
-- 문제: "Admins read all users" 정책이 users 테이블을 다시 SELECT → 재귀
-- 해결: SECURITY DEFINER 함수로 RLS 우회하여 admin 체크
-- ============================================================

-- 1. 재귀 유발 정책 삭제
DROP POLICY IF EXISTS "Admins read all users" ON public.users;
DROP POLICY IF EXISTS "Admins read all api_calls" ON public.api_calls;

-- 2. admin 체크 함수 (SECURITY DEFINER로 RLS 우회)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.users WHERE id = auth.uid()),
    FALSE
  );
$$;

-- 3. 함수 기반 정책 재생성 (재귀 없음)
CREATE POLICY "Admins read all users"
  ON public.users FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins read all api_calls"
  ON public.api_calls FOR SELECT
  USING (public.is_admin());

-- ============================================================
-- 완료 확인용: SELECT * FROM public.users WHERE id = auth.uid();
-- ============================================================
