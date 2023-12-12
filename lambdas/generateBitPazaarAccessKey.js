'use strict';

const { ethers } = require("ethers");
const AWS = require('aws-sdk');
const base64url = require('base64url');

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

	// Verify auth payload was really signed by the said address
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

	// Issue JWT token

	let header = {
		"alg": "RS256",
		"typ": "JWT"
	};
	
	let payload = {
		address: recoveredAddress,
		validBefore: 1
	};

	let token_components = {
		header: base64url(JSON.stringify(header)),
		payload: base64url(JSON.stringify(payload)),
	};

	let message = Buffer.from(token_components.header + "." + token_components.payload);

	let res = await kms.sign({
		Message: message,
		KeyId: AWS_KMS_KEY_ID,
		SigningAlgorithm: 'RSASSA_PKCS1_V1_5_SHA_256',
		MessageType: 'RAW'
	}).promise();

	token_components.signature = res.Signature.toString("base64url");
	const token = token_components.header + "." + token_components.payload + "." + token_components.signature;

	return {
		statusCode: 200,
		body: {recoveredAddress, token},
	};
};
