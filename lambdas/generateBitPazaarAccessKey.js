'use strict';

const { ethers } = require("ethers");

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

	const authPayload = {
		walletAddress: eventParams.walletAddress,
		action: 'auth',
		block: eventParams.block
	};

    const recoveredAddress = ethers.verifyTypedData(domain, types, authPayload, eventParams.signature);

	if(recoveredAddress !== eventParams.walletAddress) {
		throw new Error("Recovered address didn't match signer address.");
	}

	return {
		statusCode: 200,
		body: {recoveredAddress},
	};
};
