import fetch from 'node-fetch';

import { KeyManager } from '../keyManager';
import {
    ENDPOINT, formatParams, HotPepperResponse, isSuccessfulResponse, MasterResponse, ResponseField
} from './apiBase';

interface SpecialCategorySearchQuery {
    special_category?: string[];
}

export interface SpecialCategoryResponse {
    special_category: MasterResponse[];
}

export class SpecialCategory {
    private _URL = `${ENDPOINT}/special_category/v1`;
    private _keyManager = KeyManager.instance;

    private _params: SpecialCategorySearchQuery = { special_category: [] };

    constructor() {}

    async search(): Promise<
        HotPepperResponse<ResponseField<SpecialCategoryResponse>>
    > {
        const params = new URLSearchParams({
            key: this._keyManager.apiKey,
            format: 'json',
            ...formatParams({ ...this._params }),
        });
        const res = await fetch(`${this._URL}?${params}`);
        const json = <ResponseField<SpecialCategoryResponse>>await res.json();
        if (isSuccessfulResponse(json))
            return {
                status: 200,
                result: json.results.special_category,
                rawJson: json,
            };
        return {
            status: json.results.error[0].code,
            error: json.results.error[0].message,
            rawJson: json,
        };
    }
}
