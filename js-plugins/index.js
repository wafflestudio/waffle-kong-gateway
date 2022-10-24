"use strict";

const jwt = require("jsonwebtoken");

const publicKey = "-----BEGIN PUBLIC KEY-----\n" + process.env.WAFFLE_JWT_PUBLIC_KEY + "\n-----END PUBLIC KEY-----";
const issuer = process.env.WAFFLE_JWT_ISSUER;
const authPrefix = "Bearer "

class KongPlugin {
    constructor(config) {
        this.config = config;
    }

    async access(kong) {
        const waffleUserId = await kong.request.getHeader("waffle-user-id");
        if (waffleUserId !== null || waffleUserId !== undefined) {
            return kong.response.exit(403);
        }

        const authorization = await kong.request.getHeader("authorization")
        if (authorization === undefined || !authorization.startsWith(authPrefix)) {
            return;
        }

        const accessToken = authorization.substring(authPrefix.length);
        let payload;
        try {
            payload = jwt.verify(accessToken, publicKey, { algorithms: ["RS512"], issuer: issuer });
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError || err instanceof jwt.JsonWebTokenError) {
                return kong.response.exit(403);
            }
            throw err;
        }
        await kong.service.request.setHeader("waffle-user-id", payload.sub);
    }
}

module.exports = {
    Plugin: KongPlugin,
    Name: "waffle-jwt-authorizer",
    Schema: [
        { message: { type: "string" } },
    ],
    Version: "0.1.0",
    Priority: 0,
}
