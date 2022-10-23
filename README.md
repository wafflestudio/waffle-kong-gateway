# waffle-kong-gateway
## kong-gateway with waffle plugins

### js - waffle-jwt-authorizer
환경 변수에 `ISSUER`, `JWT_PUBLIC_KEY`가 존재해야 하며, 다음의 동작을 수행합니다.
- jwt token은 요청 헤더의 `authorization`에 존재해야 합니다.
- `RS512` 알고리즘으로 서명된 jwt token을 `JWT_PUBLIC_KEY`를 사용해 검증합니다.
- `ISSUER`와 jwt token의 `iss`가 같은지 확인합니다.
- 위의 검증이 성공했다면 요청 헤더에 `userid`를 추가합니다.
- 검증이 실패했다면 `403`으로 응답합니다.
