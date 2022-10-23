'use strict';

const jwt = require('jsonwebtoken');

class KongPlugin {
    constructor(config) {
        this.config = config;
    }

    async access(kong) {
        let authorization = await kong.request.getHeader("authorization")
        if (authorization === undefined || !authorization.startsWith("Bearer ")) {
            return;
        }

        let accessToken = authorization.substring(7);
        let payload;
        try {
            payload = jwt.verify(accessToken, process.env.WAFFLE_JWT_PUBLIC_KEY, { algorithms: ['RS512'], issuer: process.env.WAFFLE_JWT_ISSUER });
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                return kong.response.exit(403);
            }
            throw err;
        }
        await kong.service.request.setHeader('waffle-user-id', payload.sub);
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
