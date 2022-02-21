import fetch from 'node-fetch'
import {apiRequestUrl} from './approve.js'

export async function buildTxForSwap(swapParams) {
    console.log('Swap para: ', swapParams);
    const url = apiRequestUrl('/swap', swapParams);
    console.log('Swap url: ', url);

    return fetch(url).then(res => res.json()).then(res => res.tx);
}