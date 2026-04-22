# 08 · BDM Studio 현재 상태 (2026-04-21 기준 스냅샷)

> 이 파일은 **"지금 어디까지 왔는가"**를 한눈에 보게 하는 상태 스냅샷. 새 환경 시작 시 여기부터 읽으면 바로 복귀 가능.

## 🗓 2026-04-22 새벽 — 베타 테스터 초대 단계 (현재)

### 최종 구조 (커밋 `6d2ea0e`)
- **로그인 게이트** (비로그인 시 풀 화면) → 로그인 → **스타일 카드 그리드**가 Step 1 최상단
- 스타일 카드 그리드 안에 "+ 새 스타일 만들기" / "✨ 스타일 없이 만들기" **액션 카드도 동등 크기**로 배치
- 카드 선택 → 주제 입력 카드 펼쳐짐 → 카테고리·톤·분량 모두 **chip 선택식** (프리셋 + "기타 직접 입력")
- 4-step 네비 (입력 / 텍스트 / 이미지 / 완료)
- 🐛 문제 제보 버튼 상단 상시 노출
- 👋 1분 안내 모달 (집단지성 철학 강조)
- test-generate.html / test-auth.html → studio.html 리다이렉트 전환 (레거시 북마크 커버)

### 🔐 이메일 Allowlist 현황 (2026-04-22 09:52 KST)
| 이메일 | 메모 | 역할 |
|---|---|---|
| `boram8235@gmail.com` | 관리자 · 교수님 | admin |
| `brlim@hanyang.ac.kr` | 관리자 · 한양대 계정 | admin |
| `sakie2000@hanyang.ac.kr` | 사키에 | 학생 |
| `fireandicet@hanyang.ac.kr` | 김채현 | 학생 |
| `jejin0811c@hanyang.ac.kr` | 조은진 | 학생 |

**추가 방법 (CLI로 즉시)**:
```bash
cd /Users/boramlim/Dropbox/Website-BigDMKTG/BDM-Assets/studio
npx supabase@latest db query "INSERT INTO allowed_emails (email, note) VALUES ('<email>', '<이름>') ON CONFLICT (email) DO UPDATE SET note = EXCLUDED.note RETURNING email, note, created_at;" --linked
```
또는 styles.html 하단 "🔑 베타 초대 관리" 카드에서 여러 개 한 번에.

### 🚀 배포 진행 중
- 교수님이 터미널에서 `npx vercel` 대화형 실행 중
- Vercel 프로젝트 이름: `bdm-studio`
- 배포 URL 받은 뒤 해야 할 것:
  1. Supabase Dashboard → Authentication → URL Configuration
     - Site URL: `https://<vercel-url>`
     - Redirect URLs: `https://<vercel-url>/**` + `/studio.html` + `/styles.html`
  2. 학생들에게 URL + 템플릿 메시지 전송 (대화 히스토리에 준비됨)

## ✅ 2026-04-21 저녁 — 배포/마이그레이션 현황 (검증 완료)

### Edge Functions 배포 상태 (`npx supabase@latest functions list` 결과)
| Function | 상태 | 비고 |
|----------|------|------|
| `generate-carousel` | ✅ ACTIVE v9 | Claude Sonnet 4 |
| `review-carousel` | ✅ ACTIVE v11 | Gemini 2.5 Flash |
| `analyze-style-items` | ✅ ACTIVE v6 | Claude Vision |
| `fetch-instagram-carousel` | ✅ ACTIVE v3 | Apify |
| `generate-slide-image` | ✅ ACTIVE v1 | Replicate Flux Schnell |
| `search-pexels` | ✅ ACTIVE v1 | Pexels |
| `submit-feedback` | ✅ ACTIVE v3 | 집단지성 피드백 |
| `submit-bug-report` | ❌ **미배포** — 이번 차수에 신규 작성, 배포 필요 | 베타 테스터 🐛 리포트용 |

### SQL Migration 상태 (REST API 프로빙으로 검증)
| Migration | 상태 |
|-----------|------|
| 001~006 | ✅ 적용됨 (기존) |
| 007 `slide_media` | ✅ 적용됨 (HTTP 200) |
| 008 `feedback_themes` + `generation_feedback` | ✅ 적용됨 (HTTP 200) |
| 009 `bug_reports` | ✅ 적용됨 (사용자가 2026-04-21 저녁 실행) |

### 📌 배포 액션 하나만 남음
```bash
cd /Users/boramlim/Dropbox/Website-BigDMKTG/BDM-Assets/studio
# 010 migration (allowlist)
pbcopy < supabase/010_email_allowlist.sql   # → SQL Editor에서 Run
# submit-bug-report는 2026-04-21 저녁 이미 배포됨 (v1)
```
(키·다른 함수는 전부 완료. **다시 물어보거나 재설정 요구 금지.**)

### 🔐 이메일 Allowlist (2026-04-21 저녁 추가)
- 새 migration: `supabase/010_email_allowlist.sql`
  - `allowed_emails` 테이블 (관리자 only RLS)
  - `handle_new_user()` 트리거 교체: allowlist에 없으면 RAISE EXCEPTION → OAuth 가입 차단
  - `admin_add_allowed_emails(p_emails TEXT[], p_note TEXT)` RPC
  - `allowed_emails_status` 뷰 (초대 + 가입 여부 추적)
  - 시드: `boram8235@gmail.com`, `brlim@hanyang.ac.kr` (관리자 2개)
- **관리 UI**: `styles.html` 하단에 관리자 전용 "🔑 베타 초대 관리" 카드
  - `public.users.is_admin = true`인 유저한테만 노출
  - 이메일 여러 개 한 번에 추가 가능 (줄바꿈/쉼표/공백 구분)
  - 초대된 이메일 + 가입 여부를 테이블로 표시
- **@hanyang.ac.kr 도메인 가드 제거**: `styles.html`에서 하드코딩된 도메인 체크 삭제. 이제 DB trigger가 유일한 게이트.

## 🎯 한 줄 요약

**BDM Lab Studio · 캐러셀 MVP** — 인스타 캐러셀을 Claude로 생성 → Gemini 평가 → 피드백 큐레이션 → 재생성 → 최종 컨펌 → 스타일 학습 루프까지 **집단지성 버전 팩토리** 구조로 구축 중. 현재 Phase 1 베타 (한양대 50명 대상).

## 🧭 2026-04-21 오후 진행 중 (쓰레드 자주 끊김 · 이미지 첨부 크기 이슈)

### ✅ 방금 반영됨 — 2차 묶음 (테스터 초대 준비)
- **9장 브랜딩 통일**: 스타일 선택 시 슬라이드별 variant(dark/light/green) **오버라이드 역전** → 전부 `variant-style` 공통 오버레이 (작업 #5 ✔)
- **⚙️ 슬라이드별 텍스트 조정**: 각 카드에 ⚙️ 버튼 → 인라인 패널 (제목/본문 표시·크기 S~XL·위치 상/중/하·정렬·색상 auto/light/dark/accent). `data-*` 속성 기반 CSS로 즉시 반영
- **"9장 전체에 적용" 버튼**: consistency 강제 복제
- **localStorage 영속화**: `bdm.studio.text_ov.{generation_id}` 키로 저장 — 새로고침·재생성 시 복원
- **👋 1분 안내 모달** (#intro-modal): 첫 로그인 시 자동 오픈, "다음부터 열지 않기" 체크박스. 상단 **❓ 안내** 버튼으로 언제든 재열기
- **🐛 문제 제보 모달** (#bug-modal): 상단 고정 버튼. 어느 단계 + 설명 + 재현방법 → `submit-bug-report` Edge Function → `bug_reports` 테이블 (migration 009). 로그인 사용자 누구나 제보 가능 (generation 소유권 검증 X)
- **Vercel 정적 배포 준비**: `studio/vercel.json` + `.vercelignore` — 루트(/) → /studio.html 리다이렉트, supabase 폴더 제외

### 🧩 새로 추가된 파일 (이번 차수)
- `BDM-Assets/studio/supabase/009_bug_reports.sql` — bug_reports 테이블 + RLS + dashboard 뷰
- `BDM-Assets/studio/supabase/functions/submit-bug-report/index.ts`
- `BDM-Assets/studio/vercel.json`, `.vercelignore`

### ✅ 방금 반영됨 — 1차 묶음 (studio.html 초반 개선, uncommitted)
- **Step 3 버튼 라벨**: "한 방 생성" → **"🎨 스타일대로 AI 이미지 일괄 생성"**
- **기술 용어 한국어 친절어로 교체**:
  - 잔액 알림: "rate limit/throttle/429" → "이미지 서버 잔액이 적을 때 / 서버가 일부러 천천히"
  - confirm 다이얼로그: "429 만나면 대기 후 재시도" → "서버가 잠깐 느려지면 자동으로 잠시 기다렸다가 이어서 생성"
  - 내부 함수 주석/로그도 한글화
- **Step 2 인라인 편집** (핵심): heading/body/outro fields `contenteditable` + focus 시 raw markdown, blur 시 `lastResult.output` + 버전 히스토리 + 원본 JSON + Step 3 visual-grid까지 전부 동기화. `editableField` / `startEditField` / `saveEditField` 3종 함수 추가
- **Step 3 스타일 투명성 배너** (#style-transparency): "지금 사용 중인 스타일" 배지 + 스타일명 + 톤 + 컬러 스와치(최대 5개) + 비주얼 규칙(최대 3줄) + 타이포 출력. `renderTransparencyBanner()` 함수 추가, `goStep(3)` + `renderVisualGrid()`에서 호출
- **💬 슬라이드별 피드백 재생성**: `openSlideFeedback(idx)` → `#tpl-img-feedback` 패널 카드 아래 열림 → 제출 시 `generateAIImageForSlide(idx, { customHint })` → Edge Function의 `custom_prompt_hint` 파라미터로 전달됨 (Edge Function은 이미 지원)
- **🔍 프롬프트 보기 모달** (#prompt-view-modal): AI로 만든 슬라이드에만 🔍 버튼 노출. 모달 열면: 슬라이드 번호 + 스타일명 + 모델명 + **주입된 스타일 요소 목록** (tone/colors/guidelines) + **Replicate에 실제로 보낸 최종 프롬프트 full text**. `slide_media.prompt` 필드는 edge function이 이미 반환 중 (확인됨)
- `generateAIImageForSlide(slide_index, opts = { customHint, retryAttempt })` 시그니처 변경 — 기존 단일 인자 호출 전부 호환됨

### ⏸ 이번 세션 의도적 보류 (사용자 "차차")
- 색 팔레트 선명도/일관성 (UI/UX 리팩터는 별도 라운드)
- 첫 페이지 = 프로그램 소개 랜딩
- 작업 #2 포스팅 성과 등록 (Step 4 "Coming Soon" 박스)
- 작업 #5 variant 오버라이드 역전 (스타일 있으면 variant 무시)
- 작업 #6 역할별 레이아웃 시스템

### 📋 다음 세션 할 일 (우선순위순)
1. **브라우저 수동 테스트** — 교수님이 Step 2 편집/Step 3 투명성·💬·🔍 실제 작동 확인
2. 테스트 통과하면 커밋 → Phase 1 베타 배포용 UI/UX 리팩터 (팔레트 + 첫 소개 페이지)
3. 작업 #2 Step 4에 포스팅 성과 등록 UI
4. 작업 #5, #6

### ⚠️ 세션 운영 이슈 (중요)
- 사용자가 대용량 이미지 첨부 → "Image was too large" 에러 → 쓰레드 강제 재시작 반복 → **스트레스 누적**
- **대응**: 스크린샷 필요할 때 이미지 크기 미리 압축 요청 or 텍스트 묘사로 우회
- 복귀 시 반드시 이 파일 + `BDM-Assets/studio/studio.html` 최신 상태 로드

## 📍 현재 작동 상태

### ✅ 완료 (배포됨 + 테스트됨)

- **인증**: Google OAuth, `@hanyang.ac.kr` 도메인 한정
- **생성 (generate-carousel)**: Claude Sonnet 4 호출, 스타일 주입, 쿼터 관리, 일일 $30 캡
- **평가 (review-carousel)**: Gemini 2.5 Flash 호출, 4항목 스코어 + 피드백 + 제안
- **스타일 라이브러리 (styles.html)**: 스타일 CRUD, 스크린샷 업로드, 기본 스타일 지정, 삭제
- **Vision 분석 (analyze-style-items)**: Claude Vision으로 스크린샷 분석 → 스타일 프로필 집계
- **인스타 자동 가져오기 (fetch-instagram-carousel)**: Apify로 캐러셀 9장 자동 다운로드
- **피드백 큐레이션**: Gemini 제안 체크박스 + 자유 입력
- **재생성**: `mode: regenerate` + previous_output + feedback
- **버전 히스토리 스트립**: v1/v2/v3 전환 가능
- **최종 컨펌**: carousels.status='finalized'
- **스타일에 반영하기**: `reflect_generation_to_style` RPC → 최종 컨펌본이 스타일 레퍼런스로 추가

### ⏳ 구현했으나 배포 대기 (2026-04-21 16:xx 시점)

- **Migration 007** (`007_slide_media.sql`): `generations.slide_media` JSONB + `slide-images` Storage 버킷
- **Edge Function `generate-slide-image`**: Replicate Flux Schnell로 슬라이드 이미지 AI 생성 (스타일 프로필 주입)
- **Edge Function `search-pexels`**: Pexels 프록시 + 스타일-aware 키워드 augment
- **비주얼 슬라이드 렌더러** (test-generate.html): 1080x1350 카드 9장 + per-slide 컨트롤 (🎨 AI / 🖼 Pexels / 📤 업로드)

**배포 명령 (한 번에):**
```bash
cd /Users/boramlim/Dropbox/Website-BigDMKTG/BDM-Assets/studio
# 1. Replicate 토큰 (https://replicate.com 가입 후 API token 발급)
npx supabase@latest secrets set REPLICATE_API_TOKEN=<token>
# 2. Pexels 토큰 (기존 키 사용 가능 — 04-content-factory.md 참조)
npx supabase@latest secrets set PEXELS_API_KEY=<key>
# 3. 함수 2개 배포
npx supabase@latest functions deploy generate-slide-image --no-verify-jwt
npx supabase@latest functions deploy search-pexels --no-verify-jwt
# 4. Migration 007 → Supabase SQL Editor에 007_slide_media.sql 붙여넣고 Run
```

### 🗺 다음 단계 (미착수)

- **export to PNG**: html2canvas로 슬라이드 1080x1350 PNG 다운로드 (9장 ZIP)
- **UI/UX 정리**: 현재는 "공장 바닥" 수준, 베타 배포 전 디자인 리팩터 필요
- **Naver Blog 확장**: Apify web-scraper + 같은 스타일 파이프라인 복제
- **Threads 확장**: Apify threads-scraper + 복제
- **Phase 2**: 숏컨텐츠(릴스·숏츠·틱톡) + BYOK + 프리미엄 ($9.9K/월)
- **Phase 3**: LaTeX 리서치 리포트 자동화 (내부 도구)

## 🗂 파일 트리 (BDM-Assets/studio/)

```
studio/
├── CLAUDE.md                          # 스튜디오 전용 Claude 컨텍스트
├── test-generate.html                 # E2E 테스트 UI (생성+평가+큐레이션+재생성+컨펌+반영+비주얼)
├── styles.html                        # 스타일 라이브러리 UI (CRUD + Vision 분석 + Apify 인스타 가져오기)
├── test-auth.html                     # (구) 인증 테스트
├── carousel/index.html                # (초기 프로토타입 — 참고용, 안 씀)
├── .gitignore
└── supabase/
    ├── config.toml                    # 프로젝트 설정 (JWT 1시간)
    ├── 001_initial_schema.sql         # users, style_items, carousels, generations, improvements, ratings, publications, api_calls, engine_versions, RLS
    ├── 002_fix_rls_recursion.sql
    ├── 003_seed_engine_v1.sql         # engine_versions에 v1.0 시스템 프롬프트 삽입
    ├── 004_increment_usage_rpc.sql    # usage_this_month atomic 증가
    ├── 005_multi_styles_and_collective.sql  # styles 테이블 + style_items.style_id + top_rated_generations 뷰
    ├── 006_style_storage_and_wiring.sql     # style-screenshots 버킷 + gemini_review/selected_suggestions + source_kind + reflect_generation_to_style RPC
    ├── 007_slide_media.sql            # slide-images 버킷 + generations.slide_media JSONB (배포 대기)
    └── functions/
        ├── _shared/cors.ts            # 공용 CORS + jsonResponse/errorResponse
        ├── generate-carousel/index.ts   # Claude Sonnet 4 + 쿼터 + 스타일 주입
        ├── review-carousel/index.ts     # Gemini 2.5 Flash 평가
        ├── analyze-style-items/index.ts # Claude Vision 스크린샷 분석
        ├── fetch-instagram-carousel/index.ts  # Apify로 인스타 캐러셀 이미지 다운로드
        ├── generate-slide-image/index.ts  # Replicate Flux Schnell (배포 대기)
        └── search-pexels/index.ts         # Pexels 프록시 + 스타일 augment (배포 대기)
```

## 🔑 DB 테이블 한눈 보기

| 테이블 | 역할 | 주요 컬럼 |
|--------|------|-----------|
| `users` | 프로필 + 쿼터 | email, monthly_quota(30), usage_this_month, vision_quota(10), is_admin |
| `styles` | 스타일 프로필 | name, is_default, analyzed JSONB, item_count, needs_reanalyze |
| `style_items` | 스타일 레퍼런스 | style_id, source_kind('screenshot'\|'url'\|'generation'), screenshot_path, source_url, analyzed, generation_id, label |
| `carousels` | 작업 단위 | topic, status('drafting'\|'finalized'\|'published'), finalized_generation_id, style_id, final_approved_at |
| `generations` | 버전별 출력 | version, prompt_used, engine_version, output JSONB, **slide_media JSONB (new)** |
| `improvements` | 재생성 기록 | from/to_generation_id, feedback_text, **selected_suggestions JSONB, custom_instruction** |
| `ratings` | 평가 | hook_score ~ flow_score (1-10), total, **gemini_review JSONB** |
| `publications` | 게시/성과 | posted_at, views, saves, shares |
| `api_calls` | 비용 로그 | operation, model, input/output_tokens, cost_usd, success |
| `engine_versions` | 엔진 프롬프트 버전 | version_tag, system_prompt, is_active, changelog |

**주요 뷰 & RPC:**
- `top_rated_generations` (집단지성 분석) — 평균 40+점 or 저장 100+
- `style_performance` (스타일 효과 측정)
- `reflect_generation_to_style(p_generation_id, p_style_id, p_label)` RPC
- `handle_new_user()` 트리거 (auth.users → public.users)
- `create_default_style()` 트리거 (새 유저에게 "기본 스타일" 자동 생성)
- `refresh_style_item_count()` 트리거 (styles.item_count 자동 증감)

## 📦 Supabase Storage 버킷

| 버킷 | 용도 | 공개 | 파일 한도 | 허용 MIME |
|------|------|------|-----------|-----------|
| `style-screenshots` | 스타일 레퍼런스 이미지 (Vision 분석 대상) | private | 8MB | png/jpg/webp |
| `slide-images` | 슬라이드별 이미지 (AI 생성 + 업로드) | private | 10MB | png/jpg/webp |

**RLS 규칙**: 경로 `{user_id}/...` 첫 세그먼트가 auth.uid와 일치해야 접근 가능.

## 🌐 Supabase 프로젝트 정보

- **Project ref**: `mnynajxjgjidnojxsafr`
- **URL**: `https://mnynajxjgjidnojxsafr.supabase.co`
- **Publishable (anon) key**: `sb_publishable_I9Jf-KnpKOnLDDNoMq0E8A_oZ1E7lLt` (프론트엔드에 노출 OK)
- **Dashboard**: https://supabase.com/dashboard/project/mnynajxjgjidnojxsafr
- **JWT 서명**: ES256 (비대칭) — gateway가 거부해서 모든 함수 `--no-verify-jwt`로 배포, 함수 내부 `getUser()`로 원격 검증
- **OAuth Redirect URLs 등록**: `http://localhost:8000/**`, `http://localhost:8000/test-generate.html` 필수
