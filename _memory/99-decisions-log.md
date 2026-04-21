# 99 · 결정사항 로그 (append-only, 날짜순)

> 새 결정 → 최신 항목을 **위에** 추가. 수정하지 말고 append만.
> 각 항목: `### YYYY-MM-DD · 간단한 제목` + 내용 + 관련 파일.

---

### 2026-04-21 · 외부 콘텐츠 가져오기는 Apify로 (멀티플랫폼 인프라)

교수님 결정: "허접하게 하고 싶지 않음, 돈 내더라도 확실한 것"

**선택: Apify**
- Instagram (apify/instagram-scraper), Threads (apify/threads-scraper) 전용 actor 존재
- Naver Blog는 generic web scraper로 커버
- 계정/API 키 하나로 세 플랫폼 다 처리 (확장성)
- 무료 티어 $5/월 (월 50명 × 5 URL × 3 플랫폼 = 750회 여유)
- 스케일업: $49/월

**Studio 스튜디오 범위 업데이트**
- Phase 1 MVP = 캐러셀만, Phase 2+에 Naver/Threads 확장 예정 (기존 방침 유지)
- 하지만 스크래퍼 인프라는 처음부터 멀티플랫폼 가능하게 설계
- 각 플랫폼마다 Edge Function (fetch-instagram-carousel, fetch-threads-post, fetch-naver-blog-post)
- 공용 유틸: Apify 호출/폴링 + 이미지 다운로드→Storage 업로드

**필요한 사용자 액션**
1. apify.com 가입
2. API 토큰 생성
3. `npx supabase@latest secrets set APIFY_TOKEN=<토큰>`

### 2026-04-21 · 집단지성 버전 팩토리 1차 구현 완료

4조각 중 1~3번째 조각을 1차 구현 (아직 배포·테스트 전). 4번째(버전 히스토리)는 스트립 형태로 간소화 구현, 추후 확장.

**추가된 파일:**
- `BDM-Assets/studio/supabase/006_style_storage_and_wiring.sql` (Storage 버킷 + 테이블 확장 + `reflect_generation_to_style` RPC)
- `BDM-Assets/studio/supabase/functions/analyze-style-items/index.ts` (Claude Vision 분석 함수)
- `BDM-Assets/studio/styles.html` (스타일 라이브러리 UI)

**test-generate.html 확장:**
- 상단 nav (생성 / 스타일 라이브러리)
- Gemini 제안을 체크박스로 렌더 → "피드백 반영 재생성" 버튼 → regenerate 호출
- "최종 컨펌" 버튼 → carousels.status='finalized'
- "스타일에 반영하기" 버튼 → `reflect_generation_to_style` RPC
- 버전 히스토리 스트립 (v1/v2/v3 클릭해서 전환)

**필요한 사용자 액션 (배포):**
1. Supabase SQL Editor에 `006_style_storage_and_wiring.sql` 붙여넣고 실행
2. `npx supabase@latest functions deploy analyze-style-items --no-verify-jwt`
3. 브라우저 재로드

### 2026-04-21 · 집단지성 스타일 피드백 루프 추가 — "스타일에 반영하기" 버튼

교수님이 제안: 작업 중에도 스타일 라이브러리 편집 + 최종 승인 시 명시적 버튼으로 현재 버전을 스타일에 반영. 자동 반영 금지.

- DB: `style_items.source_kind='generation'` + `generation_id` FK 추가
- RPC: `reflect_generation_to_style(generation_id, style_id, label)` → synthetic style_item insert + needs_reanalyze=true
- UI: "🎨 스타일에 반영하기" 버튼 (최종 카드)
- **관련 파일:** `_memory/06-studio-architecture.md` (4-1 섹션)

### 2026-04-21 · 스타일 라이브러리 MVP 결정

교수님 선택:
- **레퍼런스 원소스**: 스크린샷 업로드 (Claude Vision) + 인스타 URL 붙여넣기 (URL 저장만, MVP는 자동 fetch 안 함)
- **생성 시 스타일 선택**: 단일 선택 (복수 블렌드는 Phase 2)

### 2026-04-21 · Studio 아키텍처를 "집단지성 버전 팩토리"로 확정

교수님이 기존 "자동 완결" 방향을 번복하고, 사람이 피드백을 큐레이팅하는 버전 팩토리로 설계 전환.

- **4조각:** 브랜드 프롬프트(고정) + 스타일 라이브러리(편집 가능) + 피드백 큐레이션 + 버전 히스토리
- **빌드 순서:** 스타일 라이브러리 UI → 피드백 큐레이션 + 재생성 → 버전 히스토리/최종 컨펌 → 이미지 렌더링
- **번복:** 2026-04-20 "스타일 편집 UI 금지" 방침 → 2026-04-21 "필요함"으로 전환
- **관련 파일:** `_memory/06-studio-architecture.md`

### 2026-04-21 · Gemini 모델 2.0 Flash → 2.5 Flash 교체

Google이 `gemini-2.0-flash`를 신규 사용자에게 제공 중단. `gemini-2.5-flash`로 업그레이드.

- 가격: input $0.075→$0.30 / 1M tok, output $0.3→$2.5 (4~8배 상승했지만 호출당 1~2센트 수준)
- 대안: 더 저렴 원하면 `gemini-2.5-flash-lite`
- **관련 파일:** `BDM-Assets/studio/supabase/functions/review-carousel/index.ts`

### 2026-04-21 · Supabase Edge Functions `--no-verify-jwt` 플래그로 재배포

프로젝트가 ES256 JWT 서명 사용 → gateway가 ES256 거부 문제. Gateway JWT 검증 우회, 함수 내부 `getUser()`로 원격 인증.

- 보안: 함수 내부 인증은 유지되므로 동일 수준
- **재배포 명령:** `npx supabase@latest functions deploy <name> --no-verify-jwt`

### 2026-04-21 · 영구 컨텍스트를 `_memory/`에 미러링

Claude 계정/컴퓨터 변경 시에도 컨텍스트 유지되도록 `~/.claude/memory/` → 프로젝트 내 `_memory/`로 미러링. Dropbox 통해 자동 동기.

- **관련 파일:** `_memory/README.md` (사용법) + 루트 `CLAUDE.md` 상단에 포인터 추가

### 2026-04-20 · Studio MVP 범위 확정

- MVP = 캐러셀만 (숏컨텐츠·블로그·Threads는 Phase 2+)
- UX = 마법사 플로우 (3분할 대시보드 시도 후 버림)
- Phase 1 베타: 한양대 50명, 교수님이 Claude 비용 전액 부담
- 쿼터: 생성 월 30건/인 + 재생성 최대 5회/건 + Vision 월 10건/인
- 일일 하드 리밋: $30
- **관련 파일:** `_memory/05-studio-mvp.md`

### 2026-04-17 · LinkedIn 스타일 확정 (Gemini 버전 승인)

Claude가 1시간 동안 못한 것을 Gemini가 3번 만에 해결. Claude 초안들이 "밋밋하고 교과서적" 평가. Gemini 1번 글이 승인.

- **확정 구조:** 현상 → 리프레이밍 → 대립 구도 → 도발적 질문
- **확정 톤:** ~다 체, 드라마틱 프레이밍 OK, 강한 비유 OK ("보이지 않는 감옥")
- **교훈:** "교수 톤이니 절제" 판단은 틀림. 절대 반복 금지.
- **관련 파일:** `_memory/02-writing-rules.md`, `_memory/07-linkedin-plan.md`

### 2026-04-14 · Content Factory 3개 프로그램 구조 확정

- program-carousel / program-naver / program-threads 각각 독립 HTML
- 학생 역할 분배: 채현(네이버), 사키에(캐러셀·Threads)
- 프롬프트는 각 program-*/prompts/ 폴더 txt 파일로 분리 (학생 수정 가능)
- 생성 AI = Claude API, 점검 AI = Gemini (무료)
- **관련 파일:** `_memory/04-content-factory.md`
