import fetch from 'node-fetch'
import {apiRequestUrl} from './approve.js'

export async function getQuote(quoteParams) {
    console.log('quote para: ', quoteParams);
    const url = apiRequestUrl('/quote', quoteParams);
    console.log('quote url: ', url);

    return fetch(url).then(res => res.json());
}