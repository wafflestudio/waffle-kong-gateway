const jwt = require('jsonwebtoken');

const key = '-----BEGIN PUBLIC KEY-----\n'+process.env.publicKey+'\n-----END PUBLIC KEY-----'
const issuer = process.env.issuer
const failResponse = {
    "isAuthorized": false,
    "context": {}
}

exports.handler = async(event) => {
    let headers = event.headers
    if(!headers || !headers.authorization) return failResponse
    let accessToken = headers.authorization

    try {
        let decoded = jwt.verify(accessToken, key, { algorithms: ["RS512"] });
        if(decoded.iss !== issuer) return failResponse
        return {
            "isAuthorized": true,
            "context": {
                "userId": decoded.sub
            }
        }
    } catch (err) {
        return failResponse
    }
};