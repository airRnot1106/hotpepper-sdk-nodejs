import fetch from 'node-fetch';

import { KeyManager } from '../keyManager';
import {
    ENDPOINT, formatParams, HotPepperResponse, isSuccessfulResponse, MasterResponse, ResponseField
} from './apiBase';
import { ServiceAreaResponse } from './serviceArea';

interface LargeAreaSearchQuery {
    large_area?: string[];
    keyword?: string;
}

export interface LargeAreaResponse {
    large_area: (MasterResponse & {
        [key in
            | keyof ServiceAreaResponse
            | keyof ServiceAreaResponse[keyof ServiceAreaResponse][number]]: MasterResponse;
    })[];
}

/**
 * Large Area Master API.
 *
 * @class LargeArea
 * @export
 * @see https://webservice.recruit.co.jp/doc/hotpepper/reference.html
 */
export class LargeArea {
    private _URL = `${ENDPOINT}/large_area/v1`;
    private _keyManager = KeyManager.instance;

    private _params: LargeAreaSearchQuery = { large_area: [] };

    constructor() {}

    /**
     * Sets large area code (exact match). (Up to 3 codes can be specified. If
     * more than 4 codes are specified, the fourth and subsequent codes will be ignored.)
     *
     * @memberof LargeArea
     * @param {...string[]} codes Large area codes.
     * @returns {any} {this}
     */
    largeArea(...codes: string[]): this {
        this._params.large_area?.push(...codes);
        return this;
    }

    /**
     * Sets large area name (partial match), specified in UTF8 (URL encoding)
     *
     * @memberof LargeArea
     * @param {string} keyword Large area keyword.
     * @returns {any} {this}
     */
    keyword(keyword: string): this {
        this._params.keyword = keyword;
        return this;
    }

    /**
     * Search large areas.
     *
     * @memberof LargeArea
     * @returns {any}
     *   {Promise<HotPepperResponse<ResponseField<LargeAreaResponse>>>}
     */
    async search(): Promise<
        HotPepperResponse<ResponseField<LargeAreaResponse>>
    > {
        const params = new URLSearchParams({
            key: this._keyManager.apiKey,
            format: 'json',
            ...formatParams({ ...this._params }),
        });
        const res = await fetch(`${this._URL}?${params}`);
        const json = <ResponseField<LargeAreaResponse>>await res.json();
        if (isSuccessfulResponse(json))
            return {
                status: 200,
                result: json.results.large_area,
                rawJson: json,
            };
        return {
            status: json.results.error[0].code,
            error: json.results.error[0].message,
            rawJson: json,
        };
    }
}
