import fetch from 'node-fetch';

import { KeyManager } from '../keyManager';
import {
    ENDPOINT, formatParams, HotPepperResponse, isSuccessfulResponse, MasterResponse, ResponseField
} from './apiBase';
import { SpecialCategoryResponse } from './specialCategory';

interface SpecialSearchQuery {
    special?: string[];
    special_category?: string[];
}

export interface SpecialResponse {
    special: (MasterResponse & {
        [key in keyof SpecialCategoryResponse]: MasterResponse;
    })[];
}

export class Special {
    private _URL = `${ENDPOINT}/special/v1`;
    private _keyManager = KeyManager.instance;

    private _params: SpecialSearchQuery = { special: [], special_category: [] };

    constructor() {}

    special(special: string): this {
        this._params.special?.push(special);
        return this;
    }

    specialCategory(specialCategory: string): this {
        this._params.special_category?.push(specialCategory);
        return this;
    }

    async search(): Promise<HotPepperResponse<ResponseField<SpecialResponse>>> {
        const params = new URLSearchParams({
            key: this._keyManager.apiKey,
            format: 'json',
            ...formatParams({ ...this._params }),
        });
        const res = await fetch(`${this._URL}?${params}`);
        const json = <ResponseField<SpecialResponse>>await res.json();
        if (isSuccessfulResponse(json))
            return {
                status: 200,
                result: json.results.special,
                rawJson: json,
            };
        return {
            status: json.results.error[0].code,
            error: json.results.error[0].message,
            rawJson: json,
        };
    }
}
