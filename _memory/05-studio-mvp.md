# 05 · BDM Lab Studio — 캐러셀 MVP

## 위치

`BDM-Assets/studio/` — Supabase 연동 신규 플랫폼 (1세대 `program-carousel`의 후계)

**스튜디오 고유 CLAUDE.md:** `BDM-Assets/studio/CLAUDE.md` (존재함, 세부 기술 스택 기록)

## 철학

**"쓸수록 좋아지는 엔진"** — 사용자가 쓸수록 익명 데이터가 쌓여 프롬프트 룰이 주기적으로 개선되고, 업데이트된 엔진은 모든 사용자에게 무료 배포.

**Why:** 무료 배포 + 집단지성 = 교수님 연구 데이터 파이프라인. "한국 인스타 캐러셀 N만 건 분석" 논문·아티클 원천.

## API 키 + 비용 전략 (2026-04-20 확정)

- **Phase 1 (베타, 한양대 50명):** 교수님이 Claude API 비용 전액 부담. 서버 프록시 구조로 BYOK 금지 (학생 기술 장벽 제거).
- **쿼터:** 생성 월 30건/인 + 재생성 최대 5회/건 + Vision 월 10건/인. 시스템 일일 $30 하드 리밋.
- **예상 월 비용:** $150~170 (50명 × 평균 사용). 데이터 가치 대비 합리적.
- **Phase 2 (안정화 후):** BYOK 옵션 or 월 9,900원 프리미엄. 트리거: 엔진 v1.0→v1.1 업데이트가 실제로 작동함을 증명한 시점.

## 확정 결정사항 (2026-04-20)

- **MVP = 캐러셀만** (숏컨텐츠·블로그·Threads는 Phase 2+)
- **UX = 마법사 플로우** (한 화면 한 가지. 3분할 대시보드 시도했으나 버림)
- **브랜드:** "BDM Lab Studio · 캐러셀"
- **로그인:** Google OAuth (Supabase Auth) — 한양대 도메인(@hanyang.ac.kr)만 허용
- **저장 방식:** 실시간 DB 저장 (유저 액션마다 insert)
- **마케팅 톤:** "항상 무료" 같은 강한 톤 금지 → "(무료)"로 톤 다운
- **스타일 편집 UI:** (2026-04-20 시점) 만들지 말고 "게시물 더 추가" 재학습 경로만 → **(2026-04-21 재논의) 집단지성 아키텍처로 이동, 06-studio-architecture.md 참조**

## 플로우 구조 (10화면)

```
랜딩 (미션 + Google 로그인)
  → 대시보드 (내 스타일 스냅샷 + 액션 2개)
     ├─ [학습 플로우 2단계] upload → profile
     └─ [생성 플로우 4단계] topic → options → generating → review → finalize
        └─ [게시 기록 2단계] posted-confirm → performance
```

## DB 스키마 (Supabase PostgreSQL)

```
users            (id, email, name, learned_style JSONB, created_at)
style_items      (id, user_id, source_url, screenshot_url, analyzed JSONB)
carousels        (id, user_id, topic, category, tone, length)
generations      (id, carousel_id, version, prompt_used, output JSONB, engine_version)
improvements     (id, generation_id, feedback_text, from_version, to_version)
ratings          (id, generation_id, hook, data, visual, title, flow, total)
publications     (id, carousel_id, chosen_version, posted_at, post_url, views, saves, shares)
engine_versions  (id, version_tag, system_prompt, changelog, deployed_at)
api_calls        (operation, model, input/output_tokens, cost_usd, success, error_message)
styles           (id, name, is_default, item_count)  — 스타일 라이브러리
```

## Supabase 프로젝트

- Project ID: `mnynajxjgjidnojxsafr`
- URL: `https://mnynajxjgjidnojxsafr.supabase.co`
- JWT 서명: ES256 (비대칭) — gateway 지원 이슈로 함수 배포는 `--no-verify-jwt`, 함수 내부 `getUser()`로 인증 (2026-04-21)
- Edge Functions: `generate-carousel`, `review-carousel`

## 현재 진행 상황 (2026-04-21)

- ✅ E2E 테스트 페이지 동작 (`test-generate.html`)
- ✅ Claude 생성 성공 (v1.0, 30건/월 쿼터 작동)
- ✅ Gemini 2.5-flash 평가 성공 (스코어+피드백+제안)
- ✅ 캐러셀 미리보기 카드 렌더링 (cover/slides/outro)
- ⏳ 집단지성 아키텍처로 전환 중 (06 참조)

## 외부 스크래퍼 인프라 (Apify) — 2026-04-21 결정

**목적**: 스타일 라이브러리에서 인스타 URL을 붙이면 캐러셀 9장 자동 다운로드. Naver/Threads도 동일 패턴.

- **서비스**: Apify (apify.com) — 월 $5 무료 티어, 스케일업 $49/월
- **비밀 키**: `APIFY_TOKEN` (Supabase secrets)
- **사용 actor**:
  - Instagram: `apify/instagram-scraper`
  - Threads: `apify/threads-scraper`
  - Naver Blog: generic web scraper (`apify/web-scraper`) + 커스텀 parsing
- **Edge Functions**:
  - `fetch-instagram-carousel` (캐러셀 9장 → Storage)
  - `fetch-threads-post` (Phase 2+)
  - `fetch-naver-blog-post` (Phase 2+)
- **공용 유틸**: Apify 호출/폴링 + 이미지 binary fetch → Supabase Storage 업로드

## 장기 로드맵

- **Phase 2:** 숏컨텐츠(릴스·숏츠·틱톡) 추가 → 블로그/Threads
- **Phase 3:** LaTeX 리서치 리포트 자동화 — **공개 제품 아닌 BDM Lab 내부 도구로 먼저** (학생·교수·컨설팅 프로젝트용). 콘텐츠 생성 아닌 포맷/구조/템플릿 보조로 한정 (학문 윤리).
