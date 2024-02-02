# bitpazaar_lambdas
This project contains all the serverless functions consumed by the BitPazaar project.
### Dev commands cheat sheet
Run all unit tests:
> npx mocha

Invoke Function Locally:
> serverless invoke local --stage mainnet -f __functionName__

> serverless invoke local --stage mainnet -f generateBitPazaarAccessKey --data '{ "queryStringParameters": {"name":"Namethon"}}'

> serverless invoke local --stage mainnet -f getNftsByOwner --data '{ "queryStringParameters": {"address":"__address__"}, "headers": {"Authorization": "Bearer __jwt__"}}'

> serverless invoke local --stage mainnet -f getNftMetadata --data '{ "queryStringParameters": {"contractAddress": "__address__", "tokenId": __id__}, "headers": {"Authorization": "Bearer __jwt__"}}'

> serverless invoke local --stage mainnet -f searchForCollections --data '{ "queryStringParameters": {"searchStr": "__search_string__"}, "headers": {"Authorization": "Bearer __jwt__"}}'

> serverless invoke local --stage mainnet -f getNftRarity --data '{ "queryStringParameters": {"contractAddress": "__address__", "tokenId": __id__}, "headers": {"Authorization": "Bearer __jwt__"}}'

> serverless invoke local --stage mainnet -f getCollectionRarityAttributes --data '{ "queryStringParameters": {"contractAddress": "__address__"}, "headers": {"Authorization": "Bearer __jwt__"}}'

> serverless invoke local --stage mainnet -f getCollectionNfts --data '{ "queryStringParameters": {"contractAddress": "__address__", "startToken": __start_token_id__, "limit": __page_size__}, "headers": {"Authorization": "Bearer __jwt__"}}'

Invoke Function on AWS:
> serverless invoke -f __functionName__

Deploy function to aws:
> serverless deploy
> serverless deploy --stage mainnet
