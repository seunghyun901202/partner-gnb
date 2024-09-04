#Newtype Gulp Boilerplate

```
HTML5 + CSS + javascript + gulp
```

### 1. 개발환경

개발 환경 : node v8.12.0

```shell
# 노드 버전이 맞지 않을 경우, nvm을 사용하여 버전 지정
nvm use 8
```

```shell
npm install      # 필요한 모듈을 설치
gulp build-watch # 개발용 서버를 실행
gulp sync-watch  # 동일한 네트워크 실행 (모바일용)
```

### 2. 주요 설치 라이브러리

### 3. 웹 퍼블리싱 가이드

1. 마크업 시 웹 표준 준수를 위해 `시멘틱 태그`를 활용한다.
2. 프로젝트 파일 생성 시 `케밥 표기법`을 사용한다.
3. CSS 패턴은 기본적으로 `BEM 방법론`을 원칙으로 하되, 필요에 따라 `OOCSS 방법론`을 사용한다.

```
assets/scss 폴더에 모든 css를 선언한다.
```

4. image 이름은 역할에 따라 `img-*, icon-*` 접두사를 사용한다. 확장자는 svg 를 사용한다.

### 4. 폴더의 역할

```
├── assets                  # 웹앱에 사용되는 자원 (image, scss 등)
├── src
│   ├── components          # UI 컴포넌트 자원
│   ├── layouts             # 화면 레이아웃 관련 요소
│   ├── partial             # 메타 정보, 스크립트 요소
│   └── *.html              # 페이지 HTML 파일
└── ...
```
