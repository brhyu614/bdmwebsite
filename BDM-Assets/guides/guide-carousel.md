# 인스타 캐러셀 프로그램 가이드

> 담당: 사키에
> 프로그램: `program-carousel/carousel-factory.html`

---

## 프로그램 위치

```
BDM-Assets/
├── program-carousel/
│   ├── carousel-factory.html       ← 이 파일을 더블클릭해서 브라우저로 열기
│   └── prompts/
│       ├── carousel-prompt.txt     ← 생성 프롬프트 (직접 수정 가능)
│       └── review-prompt.txt       ← 자체 점검 프롬프트 (직접 수정 가능)
```

## API 키 입력 (처음 한 번만)

1. 왼쪽 사이드바 상단에 두 개 입력란:
   - **Claude API Key**: 교수님에게 받은 키 입력
   - **Gemini API Key**: 교수님에게 받은 키 입력
2. 초록 점이 켜지면 준비 완료

## 매일 사용법

### 1. 글 선택
- "웹사이트 글" 탭에서 목록 중 선택하거나
- "직접 입력" 탭에서 `content/articles/` 폴더의 .mdx 파일 본문을 복사해서 붙여넣기
- 글 원문 위치: `Dropbox/Website-BigDMKTG/content/articles/`

### 2. 이미지 준비
- 글 주제에 맞는 이미지 10-15장 준비
- **커버용 이미지**: 파일명을 `cover_` 로 시작 (예: `cover_01.jpg`)
- 드래그앤드롭으로 업로드
- cover_ 파일은 초록 COVER 뱃지가 표시됨

### 3. 생성
- "생성하기" 버튼 클릭
- AI가 자동으로:
  - 6-8장 슬라이드 캐러셀 생성 (커버 + 본문 + 아웃트로)
  - Gemini가 자체 점검 (5개 항목 각 1-5점, Expert Panel 방식)

### 4. 결과 확인
- 슬라이드별로 미리보기
- 각 슬라이드에 이미지를 추가할 수 있음:
  - 키워드 입력 → "검색" → Pexels 이미지 선택
  - 또는 이미지 직접 드래그앤드롭
- Gemini 점검 결과 확인 (PASS/FAIL/EXCELLENT)

### 5. 교수님 피드백
- 결과물을 교수님에게 보여주기
- 교수님 피드백을 그대로 입력 → "피드백 반영 재생성"
- 만족하면 "최종 승인"

### 6. 내보내기
- **"YAML 복사"** → `make_carousel.py`로 MP4 슬라이드 생성할 때 사용
- **"JSON 복사"** → 데이터 백업용

### 7. (선택) MP4 슬라이드 만들기
YAML을 복사한 후:
```bash
cd ~/Dropbox/Website-BigDMKTG/BDM-Assets/carousel-generator
# YAML을 input.yaml로 저장
python3 make_carousel.py input.yaml
# carousel-output/ 폴더에 MP4 생성
```

## 프롬프트 수정하는 법

### UI에서 수정
1. "프롬프트 설정" 버튼 클릭
2. 탭에서 "생성 프롬프트" 또는 "점검 프롬프트" 선택
3. 수정 → 자동 저장
4. "기본값 복원"으로 초기화

### 파일로 직접 수정
`program-carousel/prompts/carousel-prompt.txt` 파일을 텍스트 에디터로 편집

### Claude Code로 프로그램 수정
```bash
cd ~/Dropbox/Website-BigDMKTG/BDM-Assets/program-carousel
# "carousel-factory.html에서 슬라이드 수를 10개로 늘려줘"
# "커버에 훅 공식 종류를 선택하는 드롭다운 추가해줘"
```

## 캐러셀 품질 기준

자체 점검 5개 항목:
1. **카피 품질** — 훅이 강한가? 문장이 간결한가?
2. **데이터 근거** — 수치/출처가 있는가?
3. **플랫폼 적합** — 인스타 캐러셀에 최적화되었는가?
4. **타겟 공감** — "이 랩과 일하고 싶다" 감정이 드는가?
5. **브랜드 일관성** — BDM Lab 톤이 유지되는가?

총 25점 중:
- 20점 이상: EXCELLENT (바로 사용)
- 15-19점: PASS (소소한 수정 후 사용)
- 15점 미만: FAIL (재생성 필요)

## 매일 체크리스트

```
□ content/articles/ 에서 오늘 할 글 열기
□ 제목 + 본문 복사해서 프로그램에 붙여넣기
□ 이미지 10-15장 준비 (커버용 2-3장은 cover_ 접두어)
□ 생성하기 클릭
□ 자체 점검 점수 확인 (15점 이상이면 OK)
□ 교수님에게 결과물 보여주기
□ 피드백 입력 → 재생성 → 승인
□ YAML 복사 → make_carousel.py 실행 → MP4 생성
□ 인스타그램에 업로드
□ 불편한 점 있으면 content-factory-feedback.md에 기록
```

---

*최종 업데이트: 2026-04-14*
