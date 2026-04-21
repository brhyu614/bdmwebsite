// ============================================================
// search-pexels · Pexels API 프록시 (키 노출 방지)
// - 입력: { keyword, style_id?, per_page?, orientation? }
// - 스타일이 있으면 color_signature 힌트를 키워드에 augment
// - 반환: 이미지 후보 배열 (id, url, photographer)
// ============================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import { corsHeaders, jsonResponse, errorResponse } from '../_shared/cors.ts';

const PEXELS_SEARCH = 'https://api.pexels.com/v1/search';

interface PexelsPhoto {
  id: number;
  src: { original: string; large: string; medium: string; portrait: string };
  photographer: string;
  photographer_url: string;
  alt: string;
}

const COLOR_KEYWORDS: Record<string, string> = {
  '#000': 'black', '#fff': 'white',
  'black': 'black', 'white': 'white', 'green': 'green', 'blue': 'blue',
  'red': 'red', 'yellow': 'yellow', 'pink': 'pink', 'purple': 'purple',
  'orange': 'orange', 'brown': 'brown', 'gray': 'gray', 'beige': 'beige',
};

function styleHintFromProfile(style: { analyzed?: { color_signature?: string[]; overall_tone?: string } | null } | null): string {
  if (!style?.analyzed) return '';
  const hints: string[] = [];
  const colors = style.analyzed.color_signature;
  if (Array.isArray(colors) && colors.length > 0) {
    for (const c of colors.slice(0, 2)) {
      const low = String(c).toLowerCase();
      for (const [k, v] of Object.entries(COLOR_KEYWORDS)) {
        if (low.includes(k)) { hints.push(v); break; }
      }
    }
  }
  const tone = style.analyzed.overall_tone;
  if (typeof tone === 'string') {
    const lc = tone.toLowerCase();
    if (lc.includes('minimal')) hints.push('minimal');
    else if (lc.includes('bold')) hints.push('bold');
    else if (lc.includes('vintage')) hints.push('vintage');
    else if (lc.includes('modern')) hints.push('modern');
  }
  return hints.slice(0, 3).join(' ');
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  const startTime = Date.now();

  try {
    const PEXELS_KEY = Deno.env.get('PEXELS_API_KEY');
    if (!PEXELS_KEY) return errorResponse('PEXELS_API_KEY 미설정', 500);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return errorResponse('인증 토큰 필요', 401);

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const userClient = createClient(SUPABASE_URL, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authErr } = await userClient.auth.getUser();
    if (authErr || !user) return errorResponse('유효하지 않은 토큰', 401);

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    const body = await req.json().catch(() => ({}));
    const {
      keyword,
      style_id,
      per_page = 8,
      orientation = 'portrait',
    } = body as { keyword?: string; style_id?: string; per_page?: number; orientation?: string };
    if (!keyword) return errorResponse('keyword 필수', 400);

    // 스타일 힌트 추가 (있으면)
    let augmented = keyword;
    if (style_id) {
      const { data: style } = await admin.from('styles').select('analyzed, user_id').eq('id', style_id).maybeSingle();
      if (style && style.user_id === user.id) {
        const hint = styleHintFromProfile(style as any);
        if (hint) augmented = `${keyword} ${hint}`;
      }
    }

    const params = new URLSearchParams({
      query: augmented,
      per_page: String(Math.min(Math.max(per_page, 1), 20)),
      orientation,
    });

    const resp = await fetch(`${PEXELS_SEARCH}?${params.toString()}`, {
      headers: { Authorization: PEXELS_KEY },
    });
    if (!resp.ok) {
      const errText = await resp.text();
      return errorResponse(`Pexels ${resp.status}: ${errText.slice(0, 300)}`, 502);
    }
    const data = await resp.json() as { photos?: PexelsPhoto[] };
    const photos = (data.photos ?? []).map((p) => ({
      id: p.id,
      url: p.src.portrait ?? p.src.large,
      thumb: p.src.medium,
      original: p.src.original,
      photographer: p.photographer,
      photographer_url: p.photographer_url,
      alt: p.alt,
    }));

    await admin.from('api_calls').insert({
      user_id: user.id,
      operation: 'pexels_search',
      model: 'pexels-api',
      success: true,
      input_tokens: 0,
      output_tokens: photos.length,
      cost_usd: 0,
      duration_ms: Date.now() - startTime,
    });

    return jsonResponse({
      keyword,
      augmented,
      style_id,
      photos,
      count: photos.length,
    });
  } catch (e) {
    return errorResponse('서버 오류: ' + (e as Error).message, 500);
  }
});
