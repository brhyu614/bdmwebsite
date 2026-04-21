# CLAUDE.md — BDM Lab Studio (캐러셀 MVP)

> 이 파일은 `BDM-Assets/studio/` 디렉토리에서 작업할 때 Claude Code가 자동 로드하는 로컬 컨텍스트다.
> 프로젝트 전체 컨텍스트는 `/_memory/` 폴더 필독.

## Studio는 무엇인가

집단지성으로 쓸수록 좋아지는 인스타 캐러셀 생성 엔진. 사용자 피드백이 누적되어 프롬프트 룰이 주기적으로 개선되고 모든 사용자에게 배포된다. 교수님 연구 데이터 파이프라인 역할 겸용.

**현재 상태:** Phase 1 베타 (한양대 50명), MVP = 캐러셀만.

## 아키텍처 4조각 (집단지성 버전 팩토리)

이 구조를 깨는 설계 금지. 새 기능 추가 시 4조각 중 어디 속하는지 먼저 분류.

1. **브랜드 프롬프트** (system-level, 고정) — 교수님 voice, 모든 생성에 주입
2. **스타일 라이브러리** (user-level, 편집 가능) — 레퍼런스 캐러셀 저장 + 선택/믹스
3. **피드백 큐레이션** — Gemini 제안 + 자유 입력, 유저가 선별 적용
4. **버전 히스토리** — v1/v2/v3 누적, "최종 컨펌" 플래그

상세: `/_memory/06-studio-architecture.md`

## 기술 스택

- **DB/Auth/Functions:** Supabase (project: `mnynajxjgjidnojxsafr`)
- **인증:** Google OAuth, 한양대 도메인(@hanyang.ac.kr)만 허용
- **JWT:** ES256 비대칭 서명 사용 중 → Edge Functions는 `--no-verify-jwt`로 배포, 함수 내부 `getUser()`로 원격 검증
- **생성 AI:** Claude API `claude-sonnet-4-20250514`
- **점검 AI:** Gemini 2.5 Flash (2026-04-21 이전에는 2.0 Flash)
- **프론트:** 단일 HTML (프로토타입), 추후 Next.js로 포팅 예정

## 주요 파일

- `test-generate.html` — E2E 테스트 UI (Claude 생성 + Gemini 평가 + 미리보기)
- `supabase/functions/generate-carousel/index.ts` — Claude 생성 Edge Function
- `supabase/functions/review-carousel/index.ts` — Gemini 평가 Edge Function
- `supabase/functions/_shared/cors.ts` — 공통 CORS/에러 헬퍼
- `supabase/config.toml` — Supabase 프로젝트 설정 (jwt_expiry=3600)

## DB 스키마 핵심

```
users, style_items, carousels, generations, improvements,
ratings, publications, engine_versions, api_calls, styles
```

상세: `/_memory/05-studio-mvp.md`

## 쿼터 및 비용

- 생성: 월 30건/인, 생성당 재생성 최대 5회
- Vision: 월 10건/인
- 시스템 일일 하드 리밋: $30
- Phase 1 예상: $150~170/월 (50명 베타)
- 교수님이 Phase 1 전액 부담. BYOK 금지.

## 중요 주의사항

1. **API 키 하드코딩 금지** — 1세대 `program-carousel/carousel-factory.html`의 하드코딩 실수 반복 금지. 모든 키는 Supabase secrets로.
2. **`gemini-2.0-flash` 사용 금지** — 신규 지원 중단됨. `gemini-2.5-flash` 사용.
3. **과장 톤 금지** — "항상 무료" 대신 "(무료)". BDM Lab 브랜드와 일치.
4. **스타일 자동 반영 금지** — 피드백은 유저가 큐레이팅. 자동 적용 안 함.
5. **`program-carousel` (1653줄) 보존** — 작동 중인 1세대 툴, 건드리지 말고 포팅만.

## 빌드 현황 (2026-04-21)

### ✅ 배포 + 테스트됨
1. 스타일 라이브러리 UI (styles.html): CRUD, 스크린샷 업로드, Apify로 인스타 URL 자동 다운로드
2. Claude Vision 분석 (analyze-style-items)
3. 피드백 큐레이션 + 재생성 (체크박스 + 자유 입력)
4. 버전 히스토리 스트립
5. 최종 컨펌 + 🎨 스타일에 반영하기 (reflect_generation_to_style RPC)

### ⏳ 구현 완료, 배포 대기
6. Migration 007: slide_media JSONB + slide-images 버킷
7. Replicate Flux Schnell 이미지 생성 (generate-slide-image) — 스타일 프로필 주입
8. Pexels 프록시 (search-pexels) — 스타일-aware 키워드 augment
9. 비주얼 슬라이드 렌더러 (test-generate.html) — 9개 카드 1080×1350 + 컨트롤 (🎨 AI / 🖼 Pexels / 📤 업로드)

### 🗺 미착수
10. Export to PNG (html2canvas + ZIP)
11. UI/UX 디자인 리팩터 (베타 배포 전)
12. Naver Blog / Threads 스크래퍼 확장 (같은 Apify 인프라)

## 배포 명령어 (메모)

```bash
# 비밀 설정 (전체)
npx supabase@latest secrets set ANTHROPIC_API_KEY=<key>
npx supabase@latest secrets set GEMINI_API_KEY=<key>
npx supabase@latest secrets set APIFY_TOKEN=<key>
npx supabase@latest secrets set REPLICATE_API_TOKEN=<key>
npx supabase@latest secrets set PEXELS_API_KEY=<key>

# Edge Functions 6개 배포 (모두 --no-verify-jwt 필수: JWT ES256 이슈)
for fn in generate-carousel review-carousel analyze-style-items \
          fetch-instagram-carousel generate-slide-image search-pexels; do
  npx supabase@latest functions deploy $fn --no-verify-jwt
done

# 로컬 정적 서버 (테스트 페이지)
cd BDM-Assets/studio && python3 -m http.server 8000
# → http://localhost:8000/test-generate.html
# → http://localhost:8000/styles.html
```

**상세 API/비용/복귀 가이드**: `/_memory/09-apis-and-secrets.md`, `/_memory/10-deployment-runbook.md`

## Supabase Dashboard 바로가기

- 프로젝트: https://supabase.com/dashboard/project/mnynajxjgjidnojxsafr
- URL Configuration (redirect URL에 `http://localhost:8000/**` 등록 필수): https://supabase.com/dashboard/project/mnynajxjgjidnojxsafr/auth/url-configuration
- Functions: https://supabase.com/dashboard/project/mnynajxjgjidnojxsafr/functions
