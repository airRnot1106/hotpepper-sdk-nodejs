import fetch from 'node-fetch';

import { KeyManager } from '../keyManager';
import { ENDPOINT, HotPepperResponse, isSuccessfulResponse, ResponseField } from './apiBase';

interface ResponseBudgets {
    budget: {
        code: string;
        name: string;
    }[];
}

export class Budget {
    private _URL = `${ENDPOINT}/budget/v1`;
    private _keyManager = KeyManager.instance;

    constructor() {}

    async search(): Promise<HotPepperResponse<ResponseField<ResponseBudgets>>> {
        const params = new URLSearchParams({
            key: this._keyManager.apiKey,
            format: 'json',
        });
        const res = await fetch(`${this._URL}?${params}`);
        const json = <ResponseField<ResponseBudgets>>await res.json();
        if (isSuccessfulResponse(json))
            return { status: 200, result: json.results.budget, rawJson: json };
        return {
            status: json.results.error[0].code,
            error: json.results.error[0].message,
            rawJson: json,
        };
    }
}
