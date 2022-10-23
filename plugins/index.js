'use strict';

const jwt = require('jsonwebtoken');

const key = '-----BEGIN PUBLIC KEY-----\n' + process.env.WAFFLE_JWT_PUBLIC_KEY + '\n-----END PUBLIC KEY-----'
const issuer = process.env.WAFFLE_JWT_ISSUER

class KongPlugin {
    constructor(config) {
        this.config = config
    }

    async access(kong) {
        let accessToken = await kong.request.getHeader("authorization")
        if (accessToken === undefined) {
            return kong.response.exit(403);
        }

        try {
            let decoded = jwt.verify(accessToken, key, { algorithms: ["RS512"] });
            if (decoded.iss !== issuer) return kong.response.exit(403);
            return await Promise.all([
                kong.response.setHeader("x-javascript-pid", process.pid),
            ])
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
