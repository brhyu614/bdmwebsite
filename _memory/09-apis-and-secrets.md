# 09 · 외부 API + 비밀 키 + 비용 정리

> Studio에서 사용하는 모든 외부 API, 필요한 키, 설정 방법, 비용 구조를 한곳에 정리.
> **보안 원칙: 모든 키는 Supabase Edge Functions secrets에 보관. 프론트엔드에 노출 금지.**

## 🚨 재질문 금지 (2026-04-21 검증 완료 — `secrets list` 실행 결과)

**아래 9개 secret 모두 이미 설정되어 있음. 키 값을 다시 요구하지 말 것.**
새 세션에서도 확인 없이 "이미 설정됨" 전제로 진행한다. 실제 배포 실패하면 그때만 재확인.

| Secret 이름 | 상태 | 마지막 검증 |
|-------------|------|-------------|
| `SUPABASE_URL` | ✅ 설정됨 | 2026-04-21 |
| `SUPABASE_ANON_KEY` | ✅ 설정됨 | 2026-04-21 |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ 설정됨 | 2026-04-21 |
| `SUPABASE_DB_URL` | ✅ 설정됨 | 2026-04-21 |
| `ANTHROPIC_API_KEY` | ✅ 설정됨 | 2026-04-21 |
| `GEMINI_API_KEY` | ✅ 설정됨 | 2026-04-21 |
| `APIFY_TOKEN` | ✅ 설정됨 | 2026-04-21 |
| `REPLICATE_API_TOKEN` | ✅ 설정됨 | 2026-04-21 |
| `PEXELS_API_KEY` | ✅ 설정됨 | 2026-04-21 |

확인 방법 (필요할 때만):
```bash
cd /Users/boramlim/Dropbox/Website-BigDMKTG/BDM-Assets/studio
npx supabase@latest secrets list
```

## 🔐 용도 / 발급처 레퍼런스

| Secret 이름 | 용도 | 어디서 발급 |
|-------------|------|-------------|
| `SUPABASE_URL` | Supabase API URL | Supabase가 자동 |
| `SUPABASE_ANON_KEY` | Supabase anon key | Supabase가 자동 |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin 권한 (Edge Function 내부용) | Supabase가 자동 |
| `SUPABASE_DB_URL` | DB 직접 연결 URL | Supabase가 자동 |
| `ANTHROPIC_API_KEY` | Claude API (생성 + Vision) | https://console.anthropic.com |
| `GEMINI_API_KEY` | Gemini 2.5 Flash (자동 평가) | https://aistudio.google.com/app/apikey |
| `APIFY_TOKEN` | Apify 스크래퍼 (인스타 + 추후 Threads/Naver) | https://apify.com → Settings → Integrations → API tokens |
| `REPLICATE_API_TOKEN` | Replicate Flux Schnell (슬라이드 이미지 생성) | https://replicate.com → API tokens |
| `PEXELS_API_KEY` | Pexels (스톡 사진 검색) | https://www.pexels.com/api |

## 🛠 각 API 상세

### Anthropic (Claude Sonnet 4 + Vision)

- **Model ID**: `claude-sonnet-4-20250514`
- **용도**:
  - `generate-carousel`: 캐러셀 JSON 생성
  - `analyze-style-items`: Vision으로 스크린샷 분석
- **가격**: Input $3/1M tok, Output $15/1M tok
- **평균 호출당 비용**:
  - 생성: ~$0.02-0.05 (입력 ~5K + 출력 ~2K tok)
  - Vision: ~$0.01-0.02 per 이미지
- **발급**: https://console.anthropic.com/settings/keys
- **주의**: 과거 키가 GitHub 노출되어 Anthropic이 자동 삭제한 이력 있음 → **절대 HTML/JS에 하드코딩 금지**

### Google AI Studio (Gemini 2.5 Flash)

- **Model ID**: `gemini-2.5-flash`
- **용도**: `review-carousel` — 캐러셀 자동 평가 (훅/데이터/흐름/CTA 4항목)
- **가격**: Input $0.30/1M, Output $2.50/1M
- **무료 티어**: 15 RPM, 1M TPM, 1500 RPD (베타에는 충분)
- **평균 호출당 비용**: ~$0.003-0.008
- **주의**:
  - `gemini-2.0-flash`는 신규 사용자 지원 중단 (2026-04-21 확인) → `gemini-2.5-flash` 사용
  - 키는 반드시 **Google AI Studio**에서 발급 (Google Cloud Console 아님 — 무료 티어 자동 연결 안 됨)

### Apify (멀티플랫폼 스크래퍼)

- **용도**: 외부 캐러셀/블로그/Threads 자동 다운로드
- **사용 actor (2026-04-21 확정)**:
  - `apify/instagram-scraper` → `fetch-instagram-carousel` 함수에서 사용
  - `apify/threads-scraper` → 추후 `fetch-threads-post`
  - `apify/web-scraper` (generic) → 추후 `fetch-naver-blog-post`
- **가격**: Actor별 pay-per-result
  - Instagram Scraper: ~$2.3 per 1000 results
  - 실질 호출당 비용: ~$0.002-0.005
- **무료 티어**: $5/월 크레딧 (~500-1000 scrape, 베타에 충분)
- **유료 Starter**: $49/월 (스케일업 필요할 때)
- **발급**: https://console.apify.com/account/integrations
- **actor URL 형식**: `apify~instagram-scraper` (슬래시는 URL에서 `~`로 표기)
- **sync endpoint**: `https://api.apify.com/v2/acts/{actor}/run-sync-get-dataset-items?token=TOKEN&timeout=90`

### Replicate (Flux Schnell — AI 이미지 생성)

- **Model**: `black-forest-labs/flux-schnell`
- **용도**: `generate-slide-image` — 스타일 프로필을 프롬프트에 주입해서 스타일-일치 이미지 생성
- **가격**: ~$0.003/장 (4 inference steps)
- **속도**: 2-5초/장
- **평균 호출당 비용**: 슬라이드 1장당 $0.003, 9슬라이드 전체 = $0.027
- **발급**: https://replicate.com/account/api-tokens
- **출력 포맷**: webp, 4:5 종횡비
- **sync 대기**: `Prefer: wait=60` 헤더 → 60초까지 서버 대기 후 결과 반환

### Pexels (스톡 사진 검색)

- **용도**: `search-pexels` — 스톡 이미지 검색 (AI 이미지보다 실사 원할 때)
- **가격**: 완전 무료 (rate limit만 있음)
- **Rate limit**: 200 requests/hour, 20,000/month
- **발급**: https://www.pexels.com/api/new
- **기존 키**: `bJpVFz4YSAxiGvFnsSgnE7bZzPMRhJCiaoYU2KqnVgcHAOoaK3P0bCMr` (메모 `_memory/04-content-factory.md` 참조, 재사용 가능)

## 💰 Phase 1 베타 예상 월 비용 (한양대 50명)

기준: 유저당 월 평균 생성 20건 + 재생성 2건 + 평가 22건 + Vision 분석 2회 (5장씩) + AI 이미지 9장 + 인스타 가져오기 5번

| API | 호출 수/월 | 단가 | 비용 |
|-----|------------|------|------|
| Claude 생성 | 50 × 22 = 1100 | $0.03 | $33 |
| Gemini 평가 | 50 × 22 = 1100 | $0.005 | $5.5 |
| Claude Vision 분석 | 50 × 10 = 500장 | $0.015 | $7.5 |
| Replicate Flux | 50 × 20 × 9 = 9000장 | $0.003 | $27 |
| Apify Instagram | 50 × 5 = 250 | $0.003 | $0.75 |
| Pexels | 50 × ~20 = 1000 | $0 | $0 |
| **합계** | | | **~$74/월** |

초기 예상($150~170) 대비 낮은 건 Replicate/Pexels 혼용 + Apify 무료 티어 덕분.
일일 하드 캡 $30 설정되어 있음 (generate-carousel 함수 내부).

## 🚀 배포 명령어 (모든 함수)

```bash
cd /Users/boramlim/Dropbox/Website-BigDMKTG/BDM-Assets/studio

# Secrets 세팅 (신규 환경 시)
npx supabase@latest login
npx supabase@latest link --project-ref mnynajxjgjidnojxsafr
npx supabase@latest secrets set ANTHROPIC_API_KEY=<키>
npx supabase@latest secrets set GEMINI_API_KEY=<키>
npx supabase@latest secrets set APIFY_TOKEN=<키>
npx supabase@latest secrets set REPLICATE_API_TOKEN=<키>
npx supabase@latest secrets set PEXELS_API_KEY=<키>

# Edge Functions 배포 (모두 --no-verify-jwt 필수 — JWT ES256 이슈 우회)
npx supabase@latest functions deploy generate-carousel --no-verify-jwt
npx supabase@latest functions deploy review-carousel --no-verify-jwt
npx supabase@latest functions deploy analyze-style-items --no-verify-jwt
npx supabase@latest functions deploy fetch-instagram-carousel --no-verify-jwt
npx supabase@latest functions deploy generate-slide-image --no-verify-jwt
npx supabase@latest functions deploy search-pexels --no-verify-jwt

# 로컬 서버
python3 -m http.server 8000
# → http://localhost:8000/test-generate.html
# → http://localhost:8000/styles.html
```

## ⚠️ 보안 주의사항

1. **절대 하지 말 것**:
   - API 키를 HTML/JS에 하드코딩 (예: `program-carousel/carousel-factory.html`의 실수 반복 금지)
   - git에 `.env` 또는 `클로드 api - apr21.txt` 같은 키 파일 커밋 (**`BDM-Assets/클로드 api - apr21.txt` 이미 존재 — .gitignore 등록 권장**)
   - Supabase service_role_key를 클라이언트에서 사용

2. **프론트엔드에 노출 OK**: Supabase publishable (anon) key만
3. **Edge Functions만 사용**: 모든 외부 API 호출은 Edge Functions 경유
4. **RLS 강제**: 모든 테이블 RLS 활성화 + 유저 소유권 체크

## 🔄 키 로테이션 시 절차

키가 노출됐거나 교체 필요 시:

1. 해당 서비스에서 새 키 발급
2. `npx supabase@latest secrets set <KEY>=<NEW>` (자동으로 구버전 덮어씀)
3. 이전 키 서비스에서 revoke
4. Edge Functions은 재배포 안 해도 됨 (secrets는 런타임 주입)

## 🏁 다음 환경에서 처음 시작 체크리스트

```
[ ] Dropbox sync 완료 확인 (Website-BigDMKTG 폴더 접근)
[ ] Node v22+, pnpm corepack 준비
[ ] _memory/ 전체 읽기 (README → 01~10 → 99)
[ ] BDM-Assets/studio/CLAUDE.md 읽기
[ ] npx supabase@latest login → 교수님 계정 (boram8235@gmail.com 또는 brlim@hanyang.ac.kr)
[ ] npx supabase@latest link --project-ref mnynajxjgjidnojxsafr
[ ] npx supabase@latest secrets list → 7개 키 확인
[ ] python3 -m http.server 8000 → 로컬 테스트
```
