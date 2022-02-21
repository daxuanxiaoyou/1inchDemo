import Web3 from 'web3';
import {chainInfo, swapParams, quoteParams} from './paras.js';
import {
    checkAllowance, 
    signAndSendTransaction, 
    buildTxForApproveTradeWithRouter} from './approve.js';
import {buildTxForSwap} from './swap.js';
import {getQuote} from './quote.js';


const web3 = new Web3(chainInfo.web3RpcUrl);
/*
//const abi = {"inputs": [{"internalType": "contract IAggregationExecutor","name": "caller","type": "address"},{"components": [{"internalType": "contract IERC20","name": "srcToken","type": "address"},{"internalType": "contract IERC20","name": "dstToken","type": "address"},{"internalType": "address payable","name": "srcReceiver","type": "address"},{"internalType": "address payable","name": "dstReceiver","type": "address"},{"internalType": "uint256","name": "amount","type": "uint256"},{"internalType": "uint256","name": "minReturnAmount","type": "uint256"},{"internalType": "uint256","name": "flags","type": "uint256"},{"internalType": "bytes","name": "permit","type": "bytes"}],"internalType": "struct AggregationRouterV4.SwapDescription","name": "desc","type": "tuple"},{"internalType": "bytes","name": "data","type": "bytes"}],"name": "swap","outputs": [{"internalType": "uint256","name": "returnAmount","type": "uint256"},{"internalType": "uint256","name": "spentAmount","type": "uint256"},{"internalType": "uint256","name": "gasLeft","type": "uint256"}],"stateMutability": "payable","type": "function"};

async function decodeParamsOfTransaction(data){
    var input = '0x' + data.slice(10);
    console.log("input = ", input);
    var types = abi.inputs.flatMap(x=>x.type == 'tuple' ? x.components.flatMap(a=>a.type):x.type);
    console.log("types = ", types);
    var names = abi.inputs.flatMap(x=>x.type == 'tuple' ? x.components.flatMap(a=>a.name):x.name);
    console.log("names = ", names);

    var r = web3.eth.abi.decodeParameters(types, input);
    var dic = {}
    for(var i=0; i<names.length; i++){
        dic[names[i]] = r[i];
    }
    return dic
}
*/

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function waitTransaction(txHash) {
    let tx = null;
    while (tx == null) {
        tx = await web3.eth.getTransactionReceipt(txHash);
        await sleep(1000);
    }
    console.log("Transaction " + txHash + " was mined.");
    return (tx.status);
}


/******************************
* 1. checkAllowance
* 2. approve if allowance == 0
* 3. getQuote
* 4. build swap tx
* 5. sign tx and broadcast
******************************/

async function main(){
    //1 -- check allowance
    const allowance = await checkAllowance(swapParams.fromTokenAddress, chainInfo.walletAddress);
    console.log('Allowance: ', allowance);

    //2 -- approve if allowance == 0 or allowance < amount
    if (allowance == 0) {
        //approve 
        //build approve tx
        const transactionForSign = await buildTxForApproveTradeWithRouter(swapParams.fromTokenAddress);
        console.log('Transaction for approve: ', transactionForSign);

        // Send a transaction and get its hash
        const approveTxHash = await signAndSendTransaction(transactionForSign);

        console.log('Approve tx hash: ', approveTxHash);

        const status = await waitTransaction(approveTxHash);
        if (!status) {
            console.log("Approval transaction failed.");
            return;
        }
    }

    //3 -- get quote
    const quote = await getQuote(quoteParams);
    console.log('quote data: ', quote);

    //4 -- get swap tx
    // build tx from 1inch api
    // will do some check: balance >= amount; Allowance >= amount ...
    const transactionForSign = await buildTxForSwap(swapParams);
    console.log('Transaction for swap: ', transactionForSign);

    //remove method i.e 0x12345678
    var input = '0x' + transactionForSign.data.slice(10);
    var result = web3.eth.abi.decodeParameters([{"internalType": "contract IAggregationExecutor","name": "caller","type": "address"},{"components": [{"internalType": "contract IERC20","name": "srcToken","type": "address"},{"internalType": "contract IERC20","name": "dstToken","type": "address"},{"internalType": "address payable","name": "srcReceiver","type": "address"},{"internalType": "address payable","name": "dstReceiver","type": "address"},{"internalType": "uint256","name": "amount","type": "uint256"},{"internalType": "uint256","name": "minReturnAmount","type": "uint256"},{"internalType": "uint256","name": "flags","type": "uint256"},{"internalType": "bytes","name": "permit","type": "bytes"}],"internalType": "struct AggregationRouterV4.SwapDescription","name": "desc","type": "tuple"},{"internalType": "bytes","name": "data","type": "bytes"}], input);
/*
    var ii = '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000009184e72a000000000000000000000000000000000000000000000000000003de8e5958b3c860000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000180000000000000003b6d034026aad2da94c59524ac0d93f6d6cbf9071d7086f2cfee7c08'
    var result1 = web3.eth.abi.decodeParameters([{"internalType":"contract IERC20","name":"srcToken","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"minReturn","type":"uint256"},{"internalType":"bytes32[]","name":"pools","type":"bytes32[]"}], ii);

    console.log('result1: ', result1);
*/
/*
    //5 -- sign tx and broadcast
    const approveTxHash = await signAndSendTransaction(transactionForSign);

    console.log('Approve tx hash: ', approveTxHash);
*/
    //end
}

main();
