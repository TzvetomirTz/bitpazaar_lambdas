const jwt = require('jsonwebtoken');
const fs = require('fs');

const verifyAndDecodeJwt = (token) => {
    let cert = fs.readFileSync('./resources/auth_public_key');
    let decodedToken;

	jwt.verify(shid, cert, function (err, decoded) {
		if (err) {
			console.error("Error", err);
		}

        decodedToken = decoded;
	});

    return decodedToken;
};

module.exports.verifyAndDecodeJwt = verifyAndDecodeJwt;