# bitpazaar_lambdas
This project contains all the serverless functions consumed by the BitPazaar project.
### Dev commands cheat sheet
Run all unit tests:
> npx mocha

Invoke function locally:
> serverless invoke local --stage mainnet -f __functionName__
> serverless invoke local --stage mainnet -f generateBitPazaarAccessKey --data '{ "queryStringParameters": {"name":"Namethon"}}'
> serverless invoke local --stage mainnet -f getNftsByOwner --data '{ "queryStringParameters": {"address":"__address__"}, "headers": {"Authorization": "Bearer __jwt__"}}'

Invoke function on aws:
> serverless invoke -f __functionName__

Deploy function to aws:
> serverless deploy
> serverless deploy --stage mainnet
