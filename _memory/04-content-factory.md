# 04 · Content Factory (소셜미디어 자동화 3개 프로그램)

시작일: 2026-04-14~

## 프로그램 3개 (각각 독립)

- `BDM-Assets/program-carousel/carousel-factory.html` — 인스타 캐러셀 (사키에 담당)
- `BDM-Assets/program-naver/naver-factory.html` — 네이버 블로그 (채현 담당)
- `BDM-Assets/program-threads/threads-factory.html` — Threads (사키에 담당)

> ⚠️ 위 3개는 "1세대" 툴이고, 현재 개발 중인 차세대는 `BDM-Assets/studio/` (05-studio-mvp.md, 06-studio-architecture.md 참조).

## 프롬프트 파일 구조

- 각 program-*/prompts/ 폴더에 생성·점검 프롬프트 txt
- 학생이 직접 수정 가능
- UI에서도 수정 가능 (프롬프트 설정 버튼)

## AI 모델 구성

- **생성**: Claude API (claude-sonnet-4-20250514) — 품질 우선
- **자체 점검**: Gemini 2.5 Flash — 무료, 실패해도 생성 안 막힘 (2026-04-21 이전: 2.0 Flash, Google 신규지원 중단으로 2.5 교체)
- GPT API(OpenAI): 교수님이 품질 불만족하여 사용 안 함

## API 키 (모두 프로그램에 내장)

- Claude, Gemini, Pexels, Pixabay 키가 HTML에 하드코딩
- 교수님은 API 키를 학생에게 직접 주지 않음 (프로그램에 내장)
- ⚠️ **공개 배포 전 반드시 서버 프록시 or BYOK 전환 필요** — 현재 노출 상태
- 과거 하드코딩된 `sk-ant-api03-X7NBckOK...` 키는 Anthropic이 노출 감지해서 자동 삭제한 이력 있음

## 콘텐츠 소스

- 웹사이트 아티클 23개: `content/articles/*.mdx`
- Article 초안 8개: `Article/*.md`
- 하루 하나씩 변환 → 3-4주면 전체 완료 목표

## 학생(RA) 역할

- **채현**: 네이버 블로그 담당
- **사키에**: 캐러셀 + Threads 담당
- 실행 + 이미지 준비 + 교수님 피드백 입력 + 결과 게시
- 창의적 판단은 안 시킴
- 프로그램/프롬프트 수정은 Claude Code로 허용
- 불편한 점은 `content-factory-feedback.md`에 기록

## 핵심 기능

- Expert Panel 자동 채점 (5인 전문가 패널 방식)
- 피드백 → 학습 규칙 자동 추출 → 다음 생성 반영
- 교수님 강의자료 (썸네일/타이틀 규칙 31슬라이드) 프롬프트에 내장
- Pexels 이미지 검색 + 드래그앤드롭 삽입
- 네이버: C-Rank + DIA+ + AEO 최적화
- Threads: 바이럴 공식 5종, 3개 변형 동시 생성

## 버전 관리

- Dropbox 자체 버전 히스토리 활용 (별도 시스템 안 만듦)
- 프롬프트는 "기본값 복원" 버튼으로 롤백
