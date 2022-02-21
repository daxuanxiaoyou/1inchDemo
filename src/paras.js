
let fromTokenAddress = '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82'; //Cake
let toTokenAddress = '0xbf5140a22578168fd562dccf235e5d43a02ce9b1'; //UNI
let amount = '10000000000000000'; // wei
let fromAddress = 'your address';
let privateKey = 'your privata key';
let chainId = 56; // bsc main net


export const quoteParams = {    
	fromTokenAddress: fromTokenAddress,
	toTokenAddress: toTokenAddress, 
	amount: amount, //wei
};

export const swapParams = {
    fromTokenAddress: fromTokenAddress, 
    toTokenAddress: toTokenAddress,
    amount: amount,
    fromAddress: fromAddress,
    slippage: 1,
    disableEstimate: false,
    allowPartialFill: false,
};

export const chainInfo = {
    chainId: chainId,
    web3RpcUrl: 'https://bsc-dataseed.binance.org',
    walletAddress: fromAddress,
    privateKey: privateKey,
    apiBaseUrl: 'https://api.1inch.io/v4.0/' + chainId,
    broadcastApiUrl: 'https://tx-gateway.1inch.io/v1.1/' + chainId + '/broadcast',
};
