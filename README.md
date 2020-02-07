# healthFriend-server

헬스 친구를 찾기 위한 웹 페이지(서버)

헬스 친구가 있다면 운동을 더 재밌게 하면서, 건강도 챙기고, 친구까지 만들 수 있습니다

헬스 친구가 나를 잘 찾을 수 있도록, 나에 대한 정보를 입력하고, 친구 찾기를 통해서 헬스 친구를 찾아보세요!

## 1. Getting Started

### Prerequisites

- Node.js v10 이상
- MySQL v5.7 이상

### Installing

```cmd
git clone https://github.com/codestates/healthFriend-server.git

yarn
```

- TypeORM config 수정
  - 파일명 변경: ormconfig-sample.json -> ormconfig.json
  - ormconfig.json의 FIXME를 환경에 맞게 적절히 수정
  - development, test, production의 database는 각각 다른 이름을 설정하는 것을 권장함
  - **수동으로 DB에 접속하여 각 database를 생성해야 함**
  - 테이블은 프로젝트 실행 시(yarn dev or start) 자동 생성됨

- dotenv 파일 수정
  - 파일명 변경: dotenv-sample -> .env
  - .env의 내용을 적절히 수정

## 2. Running the tests

```cmd
yarn test
```

## 3. sample data 입력

```cmd
yarn data
```

- development database에 저장됨

## 4. Run

```cmd
yarn compile
yarn start
```

## LICENSE

MIT
