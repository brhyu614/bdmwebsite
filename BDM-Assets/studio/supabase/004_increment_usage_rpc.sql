-- ============================================================
-- increment_usage RPC: atomic 쿼터 증가 (race condition 방지)
-- ============================================================

CREATE OR REPLACE FUNCTION public.increment_usage(user_uuid UUID)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.users
  SET usage_this_month = usage_this_month + 1,
      updated_at = NOW()
  WHERE id = user_uuid;
$$;
