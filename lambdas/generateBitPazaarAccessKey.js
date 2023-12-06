'use strict';

const { ethers } = require("ethers");
const AWS = require('aws-sdk');

AWS.config.update({ region: 'eu-west-2' });

const AWS_KMS_KEY_ID = "aaef6297-2af5-47f8-a0f6-341f8446e085";

const domain = {
	name: 'BitPazaar',
	chainId: 1
};

const types = {
	Auth: [
		{ name: 'walletAddress', type: 'address' },
		{ name: 'action', type: 'string' },
		{ name: 'block', type: 'uint256'}
	]
};

module.exports.handler = async (event) => {
	const eventParams = event.queryStringParameters;
	const kms = new AWS.KMS();

	const authPayload = {
		walletAddress: eventParams.walletAddress,
		action: 'auth',
		block: eventParams.block
	};

    const recoveredAddress = ethers.verifyTypedData(domain, types, authPayload, eventParams.signature);

	if(recoveredAddress !== eventParams.walletAddress) {
		throw new Error("Recovered address didn't match signer address."); // ToDo: return code 400 with message or whatevs
	}

	const header = Buffer.from(JSON.stringify({alg: "RSASSA_PKCS1_V1_5_SHA_256", typ: "JWT"})).toString("base64url");
	const body = Buffer.from(JSON.stringify({address: recoveredAddress})).toString("base64url");

	const message = Buffer.from(header + "." + body);

	const signature = await kms.sign({
		KeyId: AWS_KMS_KEY_ID,
		Message: message,
		SigningAlgorithm: "RSASSA_PKCS1_V1_5_SHA_256",
		MessageType: "RAW"
	}).promise();

	console.log(`${header}.${body}.${signature.Signature.toString("base64url")}`);

	return {
		statusCode: 200,
		body: {recoveredAddress},
	};
};
