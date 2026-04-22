# 10 · 배포 & 복귀 런북

> 새 컴퓨터 / 새 Claude 계정 / 세션 재개 시 단계별로 따라할 가이드.
> **목표: friction 없이 작업 이어가기.**

## 🚀 가장 빠른 복귀 (새 Claude 계정, Dropbox 이미 동기화됨)

**Claude에게 첫 메시지로 이것만 보내면 됨:**

> `_memory/` 폴더 전체 순서대로 읽어줘 (README → 01~11 → 99). 그 다음 `CLAUDE.md`, `BDM-Assets/studio/CLAUDE.md` 읽고, 지금 어느 단계에 있고 다음에 뭐 할지 한 줄로 요약해줘. API 키·함수 배포·마이그레이션 재확인 요구 금지 (09-apis-and-secrets.md 참고).

이 한 문장으로 전체 컨텍스트 복원 + 재질문 방지. `_memory/08-current-state.md`가 마지막 세션 끝난 지점을 스냅샷으로 담고 있어서 즉시 이어짐.

## 🎬 시나리오 A: 새 컴퓨터에서 처음 시작

### 1단계: 환경 준비 (10-15분)

```bash
# Node v22+ 설치 (nvm 추천)
nvm install 22 && nvm use 22

# pnpm 활성화
corepack enable

# Dropbox 동기화 완료 확인
ls /Users/<YOU>/Dropbox/Website-BigDMKTG/_memory/
# → 12개 MD 파일 보여야 함 (README + 01~11 + 99)
```

### 2단계: 컨텍스트 로딩 (5분)

**Claude에게 첫 메시지:**
> `_memory/` 폴더의 모든 MD 파일을 읽어줘 (README → 01~11 → 99 순서). 읽고 나서 "지금 BDM Studio가 어느 단계에 있고, 다음에 뭐 해야 하는지" 한 줄로 요약해줘.

### 3단계: Supabase CLI 연결

```bash
cd /Users/<YOU>/Dropbox/Website-BigDMKTG/BDM-Assets/studio

npx supabase@latest login
# → 브라우저가 열림, Supabase 계정(교수님: boram8235@gmail.com)으로 로그인

npx supabase@latest link --project-ref mnynajxjgjidnojxsafr
# → bdm-lab-studio 프로젝트와 연결

npx supabase@latest secrets list
# → 7개 secrets 확인 (09-apis-and-secrets.md 참조)
```

**secrets 누락 시**: 09-apis-and-secrets.md의 발급 URL에서 재발급 후 `secrets set`

### 4단계: 로컬 서버 띄우기

```bash
python3 -m http.server 8000
```

브라우저 열기:
- http://localhost:8000/test-generate.html (생성)
- http://localhost:8000/styles.html (스타일 라이브러리)

Supabase 대시보드에서 Redirect URL 등록 확인:
- https://supabase.com/dashboard/project/mnynajxjgjidnojxsafr/auth/url-configuration
- `http://localhost:8000/**` 있어야 함 (없으면 추가)

### 5단계: 테스트

1. 로그인 → 스타일 라이브러리 → 기본 스타일이 있는지
2. 🚀 생성 → 주제 입력 → Claude로 생성
3. 📋 Gemini로 평가
4. 체크박스 → 재생성
5. ✓ 최종 컨펌 → 🎨 스타일에 반영

문제 있으면 `_memory/08-current-state.md` 의 "현재 작동 상태" 섹션과 대조.

## 🎬 시나리오 B: 같은 컴퓨터, 다른 Claude 계정

기본적으로 시나리오 A와 동일하지만:
- Supabase 프로젝트 연결은 이미 돼 있음 (`supabase/.temp/linked-project.json`)
- Secrets는 Supabase에 저장돼 있음 (Claude 계정 무관)
- **단, Claude의 private 메모리(`~/.claude/...`)는 계정별이라 사라짐** → `_memory/`만 소스 오브 트루스

### Claude에게 첫 메시지:

> 프로젝트 루트 `CLAUDE.md`와 `_memory/` 폴더 전체를 읽어줘. 그리고 `BDM-Assets/studio/CLAUDE.md`도. 읽은 뒤 "지금 상태와 다음 할 일" 요약해줘.

## 🎬 시나리오 C: 며칠 만에 같은 환경으로 돌아옴

1. 마지막 커밋 이후 변경사항 확인:
   ```bash
   git log --oneline -10
   git status
   ```

2. `_memory/99-decisions-log.md` 최상단 3개 항목 확인 (최근 결정사항)

3. `_memory/08-current-state.md`의 "⏳ 구현했으나 배포 대기" 섹션 확인 — 배포 미완료인 것부터 처리

## 🗂 Migration 적용 순서 (신규 환경에서 DB 완전 리셋 시만 필요)

> **주의**: 기존 Supabase 프로젝트는 이미 마이그레이션 적용되어 있음. 아래는 새 프로젝트 만들 때만.

```
001_initial_schema.sql
002_fix_rls_recursion.sql
003_seed_engine_v1.sql
004_increment_usage_rpc.sql
005_multi_styles_and_collective.sql
006_style_storage_and_wiring.sql
007_slide_media.sql
```

각각을 Supabase SQL Editor에 붙여넣고 Run → "Success" 확인 후 다음으로.

## 🧪 문제 해결 트리

### "인증 확인 중..." 고정

- 브라우저 콘솔 (Cmd+Opt+J) 열어서 에러 확인
- 주로 JS syntax error (HTML에 임베드된 JS)
- 방금 수정한 파일 다시 읽고 에스케이프 문제 찾기

### 401 Unsupported JWT algorithm ES256

- Edge Function을 `--no-verify-jwt`로 배포했는지 확인
- 모든 함수 일괄 재배포:
  ```bash
  for fn in generate-carousel review-carousel analyze-style-items fetch-instagram-carousel generate-slide-image search-pexels; do
    npx supabase@latest functions deploy $fn --no-verify-jwt
  done
  ```

### 429 "You exceeded your current quota"

- Gemini: AI Studio에서 키 재발급 (Cloud Console 키가 아닌 AI Studio 키 필수)
- Claude: Anthropic Console에서 플랜/크레딧 확인
- Replicate: 계정 크레딧 잔액 확인

### 500 "Maximum call stack size exceeded"

- 이미지 base64 인코딩에서 `String.fromCharCode(...buf)` 사용하면 발생
- Deno std `encodeBase64` 사용으로 해결 (이미 적용됨)

### OAuth redirect 404

- Supabase Dashboard → Authentication → URL Configuration
- Redirect URLs에 `http://localhost:8000/**` 등 현재 origin 등록
- 저장 즉시 반영

### 분석 결과가 스타일 프로필에 반영 안 됨

- `styles.needs_reanalyze = true`인지 확인
- `🤖 분석하기` 버튼 한 번 더 눌러 재분석

## 📝 Git 커밋 규칙

| prefix | 용도 |
|--------|------|
| `feat:` | 새 기능 |
| `fix:` | 버그 수정 |
| `refactor:` | 리팩터링 (동작 변경 없음) |
| `chore:` | 설정/문서/기타 |
| `add:` | 자산/콘텐츠 추가 (기능 아님) |
| `remove:` / `clean:` | 제거 |

커밋 메시지는 한국어 본문 + 영문 prefix 혼용. Co-Author로 Claude 명시.

## 🔒 절대 커밋하면 안 되는 것

- `BDM-Assets/클로드 api - apr21.txt` (API 키 메모)
- `BDM-Assets/studio/supabase/.temp/` (CLI 캐시)
- `.env`, `.env.local`
- Supabase service_role_key가 들어간 파일
- 학생 개인정보가 들어간 파일

`BDM-Assets/studio/.gitignore`에 일부 등록됨. **프로젝트 루트 `.gitignore`에도 `클로드 api*.txt` 등록 권장.**

## 📡 Supabase 프로젝트 긴급 연락

- Dashboard: https://supabase.com/dashboard/project/mnynajxjgjidnojxsafr
- DB 직접 쿼리: Dashboard → SQL Editor
- 로그 보기: Dashboard → Logs → Edge Functions
- 사용량: Dashboard → Reports

## 🎯 다음 작업 피킹 (어디서 이어갈지 빠르게)

```bash
# 1. 최근 커밋 + 최근 결정 확인
git log --oneline -5
head -40 _memory/99-decisions-log.md

# 2. 지금 상태 확인
cat _memory/08-current-state.md | head -50

# 3. 배포 대기 중인 것 확인
grep -A3 "배포 대기" _memory/08-current-state.md
```

우선순위:
1. 배포 대기 중인 것 먼저 배포
2. 그 다음 미착수 과제 (08-current-state.md의 "🗺 다음 단계" 섹션)
3. UI/UX 정리는 기능 완성 이후
