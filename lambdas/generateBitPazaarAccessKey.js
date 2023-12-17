'use strict';

const { ethers } = require("ethers");
const AWS = require('aws-sdk');
const base64url = require('base64url');
const crypto = require("crypto");

AWS.config.update({ region: 'eu-west-2' });

const AWS_KMS_KEY_ID = "aaef6297-2af5-47f8-a0f6-341f8446e085"; // ToDo: move to variable
// MAX_REQUEST_AGE_MS has to be bigger in order to give the user enough time to sign
const MAX_REQUEST_AGE_MS = 30_000; // ToDo: move to variable
const ACS_TOKEN_TTL = 86_400_000; // 1 day; ToDo: move to variable

const domain = {
	name: 'BitPazaar',
	chainId: 1 // ToDo: move to variable
};

const types = {
	Auth: [
		{ name: 'wltAddr', type: 'address' },
		{ name: 'action', type: 'string' },
		{ name: 'ogTs', type: 'uint256'}
	]
};

module.exports.handler = async (event) => {

	// Verify auth payload has benign data
	const eventParams = event.queryStringParameters;
	const kms = new AWS.KMS();

	const authPayload = {
		wltAddr: eventParams.wltAddr,
		action: 'auth',
		ogTs: eventParams.ogTs
	};

    const recoveredAddress = ethers.verifyTypedData(domain, types, authPayload, eventParams.signature);

	if(recoveredAddress !== eventParams.wltAddr) {
		throw new Error("Recovered address didn't match signer address."); // ToDo: return code 4XX with message
	}

	const currTs = new Date().getTime();

	if(eventParams.ogTs > currTs || currTs - eventParams.ogTs > MAX_REQUEST_AGE_MS) {
		throw new Error(`Timestamp ${eventParams.ogTs} sent with auth request is invalid. Current: ${currTs}`); // ToDo: return code 4XX with message
	}

	// Issue JWT token

	let header = {
		"alg": "RS256",
		"typ": "JWT"
	};
	
	let payload = {
		addr: recoveredAddress,
		endDate: currTs + ACS_TOKEN_TTL,
		tokenId: crypto.randomUUID()
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
		"isBase64Encoded": false,
		'headers': {
			"Access-Control-Allow-Origin": "http://localhost:3000",
			"Access-Control-Allow-Headers": "Content-Type",
			"Access-Control-Allow-Methods": "OPTIONS,POST,GET"
		},
		"statusCode": 200,
		"body": JSON.stringify({acsToken: token}),
	};
};
