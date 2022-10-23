'use strict';

const jwt = require('jsonwebtoken');

const key = '-----BEGIN PUBLIC KEY-----\n' + process.env.WAFFLE_JWT_PUBLIC_KEY + '\n-----END PUBLIC KEY-----'
const issuer = process.env.WAFFLE_JWT_ISSUER

class KongPlugin {
    constructor(config) {
        this.config = config
    }

    async access(kong) {
        let authorization = await kong.request.getHeader("authorization")
        if (authorization === undefined || !authorization.startsWith("Bearer ")) {
            return;
        }

        let accessToken = authorization.substring(7)
        try {
            let decoded = jwt.verify(accessToken, key, { algorithms: ["RS512"] });
            if (decoded.iss !== issuer) return kong.response.exit(403);
            await Promise.all([
                kong.service.request.setHeader("waffle-user-id", decoded.sub),
            ]);
        } catch (err) {
            return kong.response.exit(403);
        }
    }
}

module.exports = {
    Plugin: KongPlugin,
    Name: 'waffle-jwt-authorizer',
    Schema: [
        { message: { type: "string" } },
    ],
    Version: '0.1.0',
    Priority: 0,
}
