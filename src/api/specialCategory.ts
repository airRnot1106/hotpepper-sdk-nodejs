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

/**
 * Special Category Master API.
 *
 * @class SpecialCategory
 * @export
 * @see https://webservice.recruit.co.jp/doc/hotpepper/reference.html
 */
export class SpecialCategory {
    private _URL = `${ENDPOINT}/special_category/v1`;
    private _keyManager = KeyManager.instance;

    private _params: SpecialCategorySearchQuery = { special_category: [] };

    constructor() {}

    /**
     * Sets special category codes (exact match). Multiple ones can be specified.
     *
     * @memberof SpecialCategory
     * @param {string} specialCategory Special category codes.
     * @returns {any} {this}
     */
    specialCategory(specialCategory: string): this {
        this._params.special_category?.push(specialCategory);
        return this;
    }

    /**
     * Search special categories.
     *
     * @memberof SpecialCategory
     * @returns {any} {Promise<
     *   HotPepperResponse<ResponseField<SpecialCategoryResponse>> >}
     */
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
