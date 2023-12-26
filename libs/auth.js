const jwt = require('jsonwebtoken');
const fs = require('fs');

const verifyAndDecodeJwt = (token) => {
    let pubKey = fs.readFileSync('./resources/auth_public_key');
    let decodedToken;

	jwt.verify(token, pubKey, (err, decoded) => {
		if (err) {
			throw err;
		}

        decodedToken = decoded;
	});

    return decodedToken;
};

const extractTokenFromBearer = (bearer) => {
	return bearer.split("Bearer ")[1];
};

module.exports.verifyAndDecodeJwt = verifyAndDecodeJwt;
module.exports.extractTokenFromBearer = extractTokenFromBearer;