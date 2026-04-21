# _memory/ — 프로젝트 영구 컨텍스트

**이 폴더는 Claude 세션이 바뀌어도(다른 컴퓨터, 다른 Claude 계정) 항상 남아있도록 Dropbox를 통해 공유되는 핵심 컨텍스트 저장소다.**

새 Claude 세션이 이 저장소에 접근했을 때 가장 먼저 이 폴더 전체를 읽어야 한다.

## 우선순위

1. **`01-user.md`** — 사용자(교수님) 프로필 + 커뮤니케이션 스타일 (필수 — 매 세션 시작 시 읽을 것)
2. **`02-writing-rules.md`** — 모든 채널 글쓰기 규칙 (링크드인/인스타/웹사이트/네이버/Threads)
3. **`03-content-strategy.md`** — 웹사이트의 목적, 3대 타겟, 논문 출판 상태
4. **`04-content-factory.md`** — 소셜미디어 자동화 3개 프로그램 구조
5. **`05-studio-mvp.md`** — BDM Lab Studio (캐러셀 MVP) 전체 맥락
6. **`06-studio-architecture.md`** — "집단지성 버전 팩토리" 4조각 아키텍처 (최신 설계)
7. **`07-linkedin-plan.md`** — 링크드인 9개 포스트 플랜 + 1번 확정본 전문
8. **`99-decisions-log.md`** — 날짜별 주요 결정사항 로그 (append-only)

## 업데이트 규칙

- 새로운 결정이 나오면 **해당 파일에 바로 반영** + `99-decisions-log.md`에 한 줄 기록
- 메모 추가 시 항상 날짜(YYYY-MM-DD)와 맥락 함께 기록
- 오래된 내용은 삭제하지 말고 "2026-04-21 update:" 같은 마커로 버전 표시
- 충돌 시 더 최신 날짜가 승

## 프로젝트 구조 포인터

- 웹사이트 코드: `/` (Next.js 15.5 + Tailwind v4 + MDX)
- 자동화 툴들: `BDM-Assets/program-carousel/`, `program-naver/`, `program-threads/`
- **최신 개발 초점:** `BDM-Assets/studio/` (캐러셀 MVP — Supabase + Claude API + Gemini 평가)
- 스튜디오별 상세: `BDM-Assets/studio/CLAUDE.md`
