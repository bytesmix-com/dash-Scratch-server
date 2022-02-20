# dash-Scratch-server

## DB 마이그레이션 적용 방법
```
DATABASE_HOST= \
DATABASE_PORT= \
DATABASE_USER= \
DATABASE_PASSWORD= \ 
DATABASE_NAME= \ 
yarn typeorm migration:run
```

## 서버 요구사항
- nodejs 설치 (v16.10.0), mysql
- npm install -g pm2

## 환경 변수 관련
- .env 파일 추가
```
NODE_ENV=production

DATABASE_HOST=
DATABASE_PORT=3306
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_NAME=

APOLLO_KEY=
APOLLO_GRAPH_REF=
APOLLO_SCHEMA_REPORTING=true

COOKIE_BASE_DOMAIN=
JWT_ACCESS_TOKEN_SECRET=
JWT_REFRESH_TOKEN_SECRET=

YOUTUBE_API_KEY=
```

위 빈 공간에 내용 기입 부탁드립니다.
COOKIE_BASE_DOMAIN 은 서버와 web이 동시에 사용하는 base domain을 적어주시면 됩니다. 형식은 ```.stg-branch.be``` 와 같은 형식입니다. (sub domain 사용시 앞에 .을 꼭 넣어주세요)

## 서버 내 설치 방법
- yarn install
- yarn build
- pm2 start

## 서버 포트 
- 기본 3000으로 되어있습니다. nginx reverse proxy 사용 추천드립니다.
