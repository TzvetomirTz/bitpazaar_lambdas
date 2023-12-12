const assert = require('assert');
const { verify } = require('crypto');
const generateBitPazaarAccessKey = require('../lambdas/generateBitPazaarAccessKey').handler;

describe('Base Gen BitP Acs Key', () => {
    describe('Gen', () => {
        it('asdf', async () => {
            const walletAddress = "0x860eF1218860bf039F4962aa9B15307E8fb16087";

            const event = {
                queryStringParameters: {
                    walletAddress,
                    action: 'auth',
                    block: 1,
                    signature: "0x1e4e1528b2a6a8ff7d4f078114c8e199858e19edd8717c11a2921eb467f6c3a67bce63f848f8378002ef2afae79a57acc41ccd179409cf8ff1bacf19ccc005711b"
                }
            };

            const resStr = await generateBitPazaarAccessKey(event);
            const resBody = JSON.parse(resStr.body);
            assert.equal(walletAddress, resBody.recoveredAddress);
        });
    });
});