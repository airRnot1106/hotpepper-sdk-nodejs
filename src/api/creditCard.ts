import fetch from 'node-fetch';

import { KeyManager } from '../keyManager';
import {
    ENDPOINT, HotPepperResponse, isSuccessfulResponse, MasterResponse, ResponseField
} from './apiBase';

export interface CreditCardResponse {
    credit_card: MasterResponse[];
}

/**
 * Credit Card Master API.
 *
 * @class CreditCard
 * @export
 * @see https://webservice.recruit.co.jp/doc/hotpepper/reference.html
 */
export class CreditCard {
    private _URL = `${ENDPOINT}/credit_card/v1`;
    private _keyManager = KeyManager.instance;

    constructor() {}

    /**
     * Get the list of credit cards.
     *
     * @memberof CreditCard
     * @returns {any}
     *   {Promise<HotPepperResponse<ResponseField<CreditCardResponse>>>}
     */
    async search(): Promise<
        HotPepperResponse<ResponseField<CreditCardResponse>>
    > {
        const params = new URLSearchParams({
            key: this._keyManager.apiKey,
            format: 'json',
        });
        const res = await fetch(`${this._URL}?${params}`);
        const json = <ResponseField<CreditCardResponse>>await res.json();
        if (isSuccessfulResponse(json))
            return {
                status: 200,
                result: json.results.credit_card,
                rawJson: json,
            };
        return {
            status: json.results.error[0].code,
            error: json.results.error[0].message,
            rawJson: json,
        };
    }
}
