# 재이미나는 우리 반 자리 배치 (Firebase + Vercel)

## 1. Firebase 콘솔 (프로젝트: changing-seats)
1. Authentication → 로그인 방법 → **Google** 사용 설정
2. Firestore Database → 데이터베이스 만들기 → 규칙 탭에 `firestore.rules` 내용을 붙여 넣고 **게시**
3. Authentication → 설정 → **승인된 도메인**에 Vercel 주소(예: `내프로젝트.vercel.app`)를 추가

## 2. Vercel 배포
방법 A (GitHub): 이 폴더를 GitHub 저장소에 올리고 Vercel에서 Add New → Project → 저장소 Import → Framework "Other", Deploy
방법 B (CLI): 이 폴더에서 `npx vercel --prod`

배포가 끝나면 `https://프로젝트이름.vercel.app` 주소가 생겨요. 학생용 링크는 앱 안의 수업 관리 → 학생 공유 켜기에서 만들어요.
