'use strict';

const { Alchemy, Network } = require("alchemy-sdk");
const { verifyAndDecodeJwt, extractTokenFromBearer } = require('../libs/auth');

const alchApiKey = process.env.ALCHEMY_API_KEY;

const config = {
    apiKey: alchApiKey,
    network: Network.ETH_MAINNET, // Todo: Parameterize for testnets testing
};

const alchemy = new Alchemy(config);

module.exports.handler = async (event) => {
	verifyAndDecodeJwt(extractTokenFromBearer(event.headers.Authorization));

	try {
		const eventParams = event.queryStringParameters;
		const rarities = (await alchemy.nft.computeRarity(eventParams.contractAddress, eventParams.tokenId)).rarities;
	
		return {
			"isBase64Encoded": false,
			'headers': {
				"Access-Control-Allow-Origin": "http://localhost:3000",
				"Access-Control-Allow-Headers": "Content-Type",
				"Access-Control-Allow-Methods": "OPTIONS,POST,GET"
			},
			"statusCode": 200,
			"body": JSON.stringify({ rarities }),
		};
	} catch (err) {
		return {
			"isBase64Encoded": false,
			'headers': {
				"Access-Control-Allow-Origin": "http://localhost:3000",
				"Access-Control-Allow-Headers": "Content-Type",
				"Access-Control-Allow-Methods": "OPTIONS,POST,GET"
			},
			"statusCode": 200,
			"body": JSON.stringify({ rarities: [] }),
		};
	}
};
