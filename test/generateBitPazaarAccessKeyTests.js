const assert = require('assert');
const sinon = require("sinon");
const jwt = require('jsonwebtoken');
const generateBitPazaarAccessKey = require('../lambdas/generateBitPazaarAccessKey').handler;
const verifyAndDecodeJwt = require('../libs/auth').verifyAndDecodeJwt;

describe('Base Gen BitP Acs Key', () => {
    
    sinon.stub(Date.prototype, 'getTime').returns(1702602445794);

    describe('Gen', () => {
        it('asdf', async () => {
            const walletAddress = "0x860eF1218860bf039F4962aa9B15307E8fb16087";

            const event = {
                queryStringParameters: {
                    wltAddr: walletAddress,
                    action: 'auth',
                    ogTs: 1702602445793,
                    signature: "0xe43cbb3620d609f4ee062397c20937d80ec1f66ae9fedcaee33411ddb86934414a64c960b874d1fbf734505ed1d58ebad51d18392890daa8985aeaa1c83576b51c"
                }
            };

            const resStr = await generateBitPazaarAccessKey(event);
            const resBody = JSON.parse(resStr.body);
            const decodedJwt = jwt.decode(resBody.acsToken);

            assert.equal(walletAddress, decodedJwt.addr);
        });
    });
});