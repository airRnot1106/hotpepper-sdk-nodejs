import fetch from 'node-fetch';

import { KeyManager } from '../keyManager';
import {
    ENDPOINT, formatParams, HotPepperResponse, isSuccessfulResponse, MasterResponse, ResponseField
} from './apiBase';
import { LargeAreaResponse } from './largeArea';

interface MiddleAreaSearchQuery {
    middle_area?: string[];
    large_area?: string[];
    keyword?: string;
    start?: number;
    count?: number;
}

export interface MiddleAreaResponse {
    middle_area: (MasterResponse & {
        [key in
            | keyof LargeAreaResponse
            | keyof LargeAreaResponse[keyof LargeAreaResponse][number]]: MasterResponse;
    })[];
}

/**
 * Middle Area Master API.
 *
 * @class MiddleArea
 * @export
 * @see https://webservice.recruit.co.jp/doc/hotpepper/reference.html
 */
export class MiddleArea {
    private _URL = `${ENDPOINT}/middle_area/v1`;
    private _keyManager = KeyManager.instance;

    private _params: MiddleAreaSearchQuery = {
        middle_area: [],
        large_area: [],
    };

    constructor() {}

    /**
     * Sets middle area code (exact match). (Up to 5 codes can be specified. If
     * 6 or more codes are specified, the 6th and subsequent codes will be ignored.)
     *
     * @memberof MiddleArea
     * @param {...string[]} codes Middle area codes.
     * @returns {any} {this}
     */
    middleArea(...codes: string[]): this {
        this._params.middle_area?.push(...codes);
        return this;
    }

    /**
     * Sets large area code (exact match). (Up to 3 codes can be specified. If
     * more than 4 codes are specified, the fourth and subsequent codes will be ignored.)
     *
     * @memberof MiddleArea
     * @param {...string[]} codes Large area codes.
     * @returns {any} {this}
     */
    largeArea(...codes: string[]): this {
        this._params.large_area?.push(...codes);
        return this;
    }

    /**
     * Sets middle area name (partial match), specified in UTF8 (URL encoding)
     *
     * @memberof MiddleArea
     * @param {string} keyword Middle area name.
     * @returns {any} {this}
     */
    keyword(keyword: string): this {
        this._params.keyword = keyword;
        return this;
    }

    /**
     * Specify the number of search results to start outputting.
     *
     * @memberof MiddleArea
     * @param {number} start The number of search results to start outputting.
     * @returns {any} {this}
     */
    start(start: number): this {
        this._params.start = start;
        return this;
    }

    /**
     * Specifies the number of search results to be output from.
     *
     * @memberof MiddleArea
     * @param {number} count The number of search results to be output from.
     * @returns {any} {this}
     */
    count(count: number): this {
        this._params.count = count;
        return this;
    }

    /**
     * Search middle areas.
     *
     * @memberof MiddleArea
     * @returns {any}
     *   {Promise<HotPepperResponse<ResponseField<MiddleAreaResponse>>>}
     */
    async search(): Promise<
        HotPepperResponse<ResponseField<MiddleAreaResponse>>
    > {
        const params = new URLSearchParams({
            key: this._keyManager.apiKey,
            format: 'json',
            ...formatParams({ ...this._params }),
        });
        const res = await fetch(`${this._URL}?${params}`);
        const json = <ResponseField<MiddleAreaResponse>>await res.json();
        if (isSuccessfulResponse(json))
            return {
                status: 200,
                result: json.results.middle_area,
                rawJson: json,
            };
        return {
            status: json.results.error[0].code,
            error: json.results.error[0].message,
            rawJson: json,
        };
    }
}
