'use strict';

const { ethers } = require("ethers");

const domain = {
	name: 'BitPazaar',
	chainId: 1
};

const types = {
	Auth: [
		{ name: 'walletAddress', type: 'address' },
		{ name: 'action', type: 'string' }
	]
};

const authPayload = {
	walletAddress: 'TBD',
	action: 'auth'
};

module.exports.handler = async (event) => {
	console.log('Running');

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Hi!'
      }
    ),
  };
};
