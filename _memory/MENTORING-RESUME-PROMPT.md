# 📋 새 Claude 세션에서 복붙할 프롬프트

새 계정으로 로그인 후 이 프롬프트를 그대로 복사해서 붙여넣으세요:

---

```
지난 세션에서 창업경진대회 멘토링 툴 배포 작업을 하다가 계정 전환했어. 

먼저 이 두 파일을 순서대로 읽어서 전체 컨텍스트 파악해줘:
1. /Users/boramlim/Dropbox/Website-BigDMKTG/_memory/MENTORING-HANDOFF-20260423.md  — 작업 내용과 현재 상태 전체
2. /Users/boramlim/Dropbox/Website-BigDMKTG/CLAUDE.md  — 프로젝트 기본 브리프

요약: 5팀(인피니아랩, VinsLab, 지원이와친구들, 스토리브릿지, 팀 AOS) 멘토링 툴을 bigdatamarketinglab.com/mentoring/에 배포하는 작업. public/mentoring/ 폴더에 파일 복사 + 그릿 제거까지 다 했고, git commit & push만 남았는데 .git/index.lock 때문에 막혀서 내가 직접 터미널에서 하기로 했어.

내가 지금 터미널에서 커밋/푸시 끝냈거나 진행 중이야. git status로 현재 상태 먼저 확인해서 알려주고, 그 다음 단계 진행하자. 
- 아직 커밋 안 됐으면: 막힌 부분 도와줘
- 커밋/푸시 완료됐으면: 배포 확인 후 팀별 원클릭 URL 만들 준비해줘 (비번은 내가 알려줄게)
```

---

## 💡 사용 팁

- 이 프롬프트는 **새 계정 첫 메시지**로 던지면 Claude가 컨텍스트 파악부터 자동으로 시작함
- 만약 새 Claude가 _memory 폴더를 못 찾는다면, 파일 선택(select folder)으로 `Website-BigDMKTG` 폴더를 먼저 마운트하라고 요청할 것
- 비밀번호(614*)는 아직 정확한 값 미확인 상태 → 새 세션에서 알려주면 팀별 원클릭 링크(`?pw=비번`) 5개 자동 생성

## 🔗 참고 링크 (배포 완료 후)

- 공유할 단일 링크: `https://www.bigdatamarketinglab.com/mentoring/`
- 관리자(교수님용): `https://www.bigdatamarketinglab.com/mentoring/schedule.html?mode=admin`
- 관리자 대시보드: `https://www.bigdatamarketinglab.com/mentoring/workspace.html?team=ALL`
