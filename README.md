# waffle-account-authorizer
AWS Lambda authorizer for waffle account server

환경 변수에 `issuer`, `publicKey`가 존재해야 하며, 다음의 동작을 수행합니다.
- jwt token은 `event.headers.authorization`에 존재해야 합니다.
- 이는 AWS API Gateway 기준으로 요청 헤더의 `authorization` 필드를 의미합니다.
- `RS512` 알고리즘으로 서명된 jwt token을 `env.publicKey`를 사용해 검증합니다.
- `env.issuer`와 jwt token의 `token.iss`가 같은지 확인합니다.
- 위의 검증이 성공했다면 `{ "isAuthorized": true, "context.userId": decoded.sub }`를 반환합니다.
- `userId`는 AWS API Gateway에서 `$context.authorizer.userId` 필드를 사용해 [매핑](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-parameter-mapping.html)할 수 있습니다.
- 검증이 실패했다면 `{ "isAuthorized": false }`를 반환합니다.
