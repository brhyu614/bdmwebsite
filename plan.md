# 시리즈 필터링 + 소개 텍스트 구현 플랜

## 문제
1. 네비게이션에서 "리서치" 클릭 → `/articles?series=lab-research`로 이동하지만, ArchiveFilter가 URL 파라미터를 읽지 않아 **필터링이 안 됨** (전체 아티클이 다 보임)
2. 시리즈별 소개 텍스트가 없음

## 수정 파일 4개

### 1. `src/lib/series.ts` — 시리즈 소개 텍스트 추가
- `SeriesInfo`에 `intro` 필드 추가 (긴 소개 텍스트)
- 랩 리서치: "기업 데이터와 소비자 행동 데이터로 실질적인 의사결정에 도움이 되는 연구를 합니다. 빅데이터 분석을 통해 발견한 것들을 누구나 이해할 수 있는 말로 씁니다."
- 알고리즘 디코드: "플랫폼 알고리즘과 추천 시스템의 작동 원리를 해독합니다. 인스타그램, TikTok, 검색 엔진이 콘텐츠를 선택하는 구조를 데이터와 연구로 분석합니다."

### 2. `src/lib/types.ts` — SeriesInfo 타입에 `intro` 추가
- `intro: string` 필드 추가

### 3. `src/app/articles/ArchiveFilter.tsx` — URL 파라미터 읽기 + 소개 텍스트 표시
- `useSearchParams()`로 URL의 `?series=` 값을 초기값으로 사용
- 시리즈 선택 시 소개 텍스트를 상단에 표시
- 필터 변경 시 URL도 동기화 (`router.push`)

### 4. `src/app/articles/page.tsx` — Suspense 래핑
- `useSearchParams`는 Suspense 경계 필요 → ArchiveFilter를 Suspense로 래핑
- 시리즈에 따라 페이지 타이틀도 동적으로 변경 (ArchiveFilter 내부에서 처리)
