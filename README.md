# 재이미나는 우리 반 자리 배치 (Firebase + Vercel)

## 1. Firebase 콘솔 (프로젝트: changing-seats)
1. Authentication → 로그인 방법 → **Google** 사용 설정
2. Firestore Database → 데이터베이스 만들기 → 규칙 탭에 `firestore.rules` 내용을 붙여 넣고 **게시**
3. Authentication → 설정 → **승인된 도메인**에 Vercel 주소(예: `내프로젝트.vercel.app`)를 추가

## 2. Vercel 배포
방법 A (GitHub): 이 폴더를 GitHub 저장소에 올리고 Vercel에서 Add New → Project → 저장소 Import → Framework "Other", Deploy
방법 B (CLI): 이 폴더에서 `npx vercel --prod`

배포가 끝나면 `https://프로젝트이름.vercel.app` 주소가 생겨요. 학생용 링크는 앱 안의 수업 관리 → 학생 공유 켜기에서 만들어요.

## 3. AI 기능 (Claude API 키)
API 키는 index.html에 넣지 않고 Vercel 환경 변수로만 둡니다. (`api/ai.js`가 서버에서 호출)
1. Vercel 프로젝트 → Settings → Environment Variables → `ANTHROPIC_API_KEY` = 발급받은 키 (Production 체크)
2. (선택) `ALLOWED_EMAILS` = 사용할 교사 이메일들을 쉼표로 구분, `ANTHROPIC_MODEL` = 모델 이름 (기본 claude-haiku-5-5)
3. Deployments → 최신 배포 ⋯ → Redeploy
