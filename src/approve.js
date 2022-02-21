import Web3 from 'web3';
import fetch from 'node-fetch';
import {chainInfo, swapParams} from './paras.js';


/*
approve：
call sequence
1. buildTxForApproveTradeWithRouter(tokenAddress, amount) // amount 不指定的话，最大量approve
2. signAndSendTransaction //签名交易，然后广播
*/

const web3 = new Web3(chainInfo.web3RpcUrl);

export function apiRequestUrl(methodName, queryParams) {
    return chainInfo.apiBaseUrl + methodName + '?' + (new URLSearchParams(queryParams)).toString();
}

// check Allowance
export function checkAllowance(tokenAddress, walletAddress) {
    return fetch(apiRequestUrl('/approve/allowance', {tokenAddress, walletAddress}))
        .then(res => res.json())
        .then(res => res.allowance);
}

//broadcast tx
async function broadCastRawTransaction(rawTransaction) {
    return fetch(chainInfo.broadcastApiUrl, {
        method: 'post',
        body: JSON.stringify({rawTransaction}),
        headers: {'Content-Type': 'application/json'}
    })
        .then(res => res.json())
        .then(res => {
            return res.transactionHash;
        });
}

export async function signAndSendTransaction(transaction) {
    const {rawTransaction} = await web3.eth.accounts.signTransaction(transaction, chainInfo.privateKey);

    return await broadCastRawTransaction(rawTransaction);
}

export async function buildTxForApproveTradeWithRouter(tokenAddress, amount) {
    const url = apiRequestUrl(
        '/approve/transaction',
        amount ? {tokenAddress, amount} : {tokenAddress}
    );

    const transaction = await fetch(url).then(res => res.json());

    const gasLimit = await web3.eth.estimateGas({
        ...transaction,
        from: chainInfo.walletAddress
    });

    return {
        ...transaction,
        gas: gasLimit
    };
}