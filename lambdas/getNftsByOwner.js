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
	const encodedAuthToken = extractTokenFromBearer(event.headers.Authorization);
	const authToken = verifyAndDecodeJwt(encodedAuthToken);

	console.log(authToken);

	const eventParams = event.queryStringParameters;
    const response = await alchemy.nft.getNftsForOwner(eventParams.address);

    return {
		"isBase64Encoded": false,
		'headers': {
			"Access-Control-Allow-Origin": "http://localhost:3000",
			"Access-Control-Allow-Headers": "Content-Type",
			"Access-Control-Allow-Methods": "OPTIONS,POST,GET"
		},
		"statusCode": 200,
		"body": JSON.stringify({ nfts: response.ownedNfts, nftsCount: response.totalCount }),
	};
};