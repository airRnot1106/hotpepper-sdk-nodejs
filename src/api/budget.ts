import fetch from 'node-fetch';

import { KeyManager } from '../keyManager';
import { ENDPOINT, HotPepperResponse, isSuccessfulResponse, ResponseField } from './apiBase';

export interface BudgetsResponse {
    budget: {
        code: string;
        name: string;
    }[];
}

/**
 * Dinner Budget Master API for Search.
 *
 * @class Budget
 * @export
 * @see https://webservice.recruit.co.jp/doc/hotpepper/reference.html
 */
export class Budget {
    private _URL = `${ENDPOINT}/budget/v1`;
    private _keyManager = KeyManager.instance;

    constructor() {}

    /**
     * Get the list of dinner budgets.
     *
     * @memberof Budget
     * @returns {any}
     *   {Promise<HotPepperResponse<ResponseField<BudgetsResponse>>>}
     */
    async search(): Promise<HotPepperResponse<ResponseField<BudgetsResponse>>> {
        const params = new URLSearchParams({
            key: this._keyManager.apiKey,
            format: 'json',
        });
        const res = await fetch(`${this._URL}?${params}`);
        const json = <ResponseField<BudgetsResponse>>await res.json();
        if (isSuccessfulResponse(json))
            return { status: 200, result: json.results.budget, rawJson: json };
        return {
            status: json.results.error[0].code,
            error: json.results.error[0].message,
            rawJson: json,
        };
    }
}
