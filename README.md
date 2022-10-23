# waffle-kong-gateway
## kong-gateway with waffle plugins

### js - waffle-jwt-authorizer
`WAFFLE_JWT_ISSUER`, `WAFFLE_JWT_PUBLIC_KEY`를 포함한 `.env`가 존재해야 하며, 다음의 동작을 수행합니다.
- 요청 헤더에 `authorization`이 있고 `Bearer` 타입이 아니면 아무 처리를 하지 않습니다.
- jwt를 `WAFFLE_JWT_PUBLIC_KEY`로 검증하며, `WAFFLE_JWT_ISSUER`와 jwt token의 `iss`가 같은지, `exp`가 지나지 않았는지 확인합니다.
- 검증이 성공했다면 요청 헤더에 `waffle-user-id`를 추가합니다.
- 검증이 실패했다면 `403`으로 응답합니다.
