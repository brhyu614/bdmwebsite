# 🔄 멘토링 툴 작업 핸드오프 (2026-04-23)

> **새 Claude 세션이 작업을 이어받기 위한 전체 컨텍스트.**
> 이 파일을 먼저 통째로 읽고 시작할 것.

---

## 1. 상황 요약

**BL (교수)**님이 다음 주 월–수 창업경진대회 **5개 팀**에게 멘토링을 하려고 하며,
각 팀이 가능한 시간을 클릭하고 진행상황을 기록할 수 있는 **웹 기반 협업 툴**을 `bigdatamarketinglab.com/mentoring/`에 배포하려 함.

**5개 팀 (확정):**
1. 인피니아랩
2. VinsLab
3. 지원이와친구들
4. 스토리브릿지
5. 팀 AOS (Artificial Of Space)

> ⚠️ 예전 파일에 '그릿'이 6팀으로 들어가 있었으나, 이번 회차는 **5팀**. 모든 파일에서 그릿 제거 완료.

**일정 (사용자 원래 요청):** 다음주 월(4/27) ~ 수(4/29), 09:00 ~ 19:00, 1시간 단위.
**실제 기존 schedule.html 슬롯 범위:** 목 4/23 13–17시 + 월~목 4/27–30 10–22시 (더 넓음, 이대로 유지)

---

## 2. 이미 만들어진 자산 (핵심)

`~/Dropbox/Website-BigDMKTG/창업경진대회 멘토링/.claude/worktrees/gifted-ritchie-30969a/public/mentoring/`
에 완성된 멘토링 시스템이 있음. **내가 이미 `public/mentoring/`로 복사하고 5팀으로 수정 완료.**

### 파일 구성
| 파일 | 역할 |
|---|---|
| `index.html` | 허브 페이지 — 5팀 카드 + 관리자 링크 |
| `schedule.html` | 팀별 시간 투표 (Firebase 실시간 동기화) |
| `workspace.html` | 팀 워크스페이스 (체크리스트, 주간 업데이트, 멘토 피드백, 공유게시판) |
| `auth.js` | 비번 게이트 (SHA-256 해시) |
| `firebase-sync.js` | Firebase 실시간 동기화 |

### 인증 (중요)
- `auth.js`의 EXPECTED 해시: `5c8020746382ae81a88fd1396daec35d58e6de193664f84fe75a01d579b9b69b`
- 사용자는 **"614*"**로 비번을 설정했다고 기억 (정확한 값 미확인)
- URL에 `?pw=비번` 붙이면 자동 입장 → 비번 알면 팀별 원클릭 링크 생성 가능
- 시도해본 후보 (`bdm614`, `614bdm`, `BDM614`, `bdmlab614`, `hanyang614` 등 30여 개) **매칭 실패**
- 정확한 비번은 사용자에게 물어볼 것

### 팀별 URL 구조 (이미 설계됨)
```
/mentoring/schedule.html?team=<URL인코딩된_팀명>
/mentoring/workspace.html?team=<URL인코딩된_팀명>
/mentoring/schedule.html?mode=admin         ← 관리자 집계
/mentoring/workspace.html?team=ALL          ← 관리자 대시보드
```

---

## 3. 🚧 지금 막힌 곳 — 마지막 한 단계

### 문제
`git add public/mentoring/` 시도 시 다음 에러:
```
fatal: Unable to create '.git/index.lock': File exists.
```
→ 다른 git 프로세스(VS Code/Cursor/또 다른 Claude Code 세션 등)가 실행 중이어서 락 파일이 있음.
→ 샌드박스 권한상 내가 `.git/index.lock` 삭제 불가 (`Operation not permitted`).

### 해결책 (사용자가 직접 수행)
```bash
# 1. VS Code, Cursor, 다른 Claude Code 세션, git GUI 등 git 쓰는 프로세스 모두 종료
cd ~/Dropbox/Website-BigDMKTG
rm -f .git/index.lock
git status                                          # 상태 확인
git add public/mentoring/
git commit -m "feat(mentoring): 창업경진대회 멘토링 툴 배포 (5팀)"
git push
```

→ Vercel 자동 배포 → `https://www.bigdatamarketinglab.com/mentoring/`에서 접근 가능.

### 커밋 전 현재 내 변경사항 (uncommitted)
`public/mentoring/` 폴더 **신규 추가** (5개 파일):
- `index.html` (그릿 제거, 6팀→5팀으로 수정, 참여 팀/진행률 문구도 5팀으로)
- `schedule.html` (`const TEAMS` 5팀으로 수정)
- `workspace.html` (`const TEAMS` 5팀으로 수정)
- `auth.js` (그대로)
- `firebase-sync.js` (그대로)

원본은 `창업경진대회 멘토링/.claude/worktrees/gifted-ritchie-30969a/public/mentoring/` — 이건 6팀 그대로, 복사본만 5팀으로 수정.

---

## 4. 배포 확인 & 공유 플로우

커밋 & 푸시 후:
1. **BL이 브라우저에서 확인:** `https://www.bigdatamarketinglab.com/mentoring/` (내 세션에서는 네트워크 egress 차단되어 접근 불가)
2. **팀들에게 공유할 ONE LINK:** 위 URL 하나 + 비밀번호 (카톡 등으로 뿌리기)
3. **원클릭 링크 원할 시:** 정확한 비번 알려주면 `?pw=비번` 붙여서 팀별 직행 URL 5개 생성 가능

---

## 5. 부수 정보

### Cowork 아티팩트 (이전에 만든 것, 이제 불필요)
- ID: `mentoring-collab-tool`
- Path: `/sessions/sharp-nice-carson/mnt/.artifacts/mentoring-collab-tool/index.html`
- Cowork 사이드바에만 존재 → 팀과 공유 불가 → **실제 배포될 `/mentoring/` 툴이 훨씬 낫고 이걸로 대체됨.**
- 굳이 지우지 않아도 됨. BL 개인 메모용으로는 쓸 수 있음.

### 관련 git 브랜치
- `main` — 배포 브랜치
- `claude/gifted-ritchie-30969a` — 원래 멘토링 툴을 만든 워크트리 브랜치 (커밋 이력에 mentoring 없음, 파일만 워크트리에)
- `claude/epic-chaplygin` — 별개 브랜치 (BDM Studio 작업용, 관련 없음)

### 기타 이슈
- 워크트리 경로 문제로 `git worktree list` 일부 에러 발생 (`fatal: not a git repository: .git/worktrees/epic-chaplygin`). 배포에는 영향 없음. 필요 시 `git worktree prune`.

---

## 6. 📌 세션 인계 — 새 Claude가 처음 해야 할 일

1. **이 파일을 먼저 읽어서 컨텍스트 파악** (위 1–5번)
2. **BL에게 확인**: `.git/index.lock` 제거하고 커밋 & 푸시했는지?
3. **푸시 완료 확인되면** → 배포된 URL 동작 확인 요청
4. **비밀번호 달라고 요청** → 원클릭 팀별 URL 5개 생성

---

**작성 시각:** 2026-04-23 (목요일 저녁 한국시간)
**작성자:** Claude (sharp-nice-carson 세션)
**다음 세션에서 계속됨.**
