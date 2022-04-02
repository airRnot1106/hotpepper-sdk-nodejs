import fetch from 'node-fetch';

import { KeyManager } from '../keyManager';
import {
    ENDPOINT, formatParams, HotPepperResponse, isSuccessfulResponse, MasterResponse, ResponseField
} from './apiBase';
import { MiddleAreaResponse } from './middleArea';

interface SmallAreaSearchQuery {
    middle_area?: string[];
    small_area?: string[];
    keyword?: string;
    start?: number;
    count?: number;
}

export interface SmallAreaResponse {
    small_area: (MasterResponse & {
        [key in
            | keyof MiddleAreaResponse
            | keyof MiddleAreaResponse[keyof MiddleAreaResponse][number]]: MasterResponse;
    })[];
}

/**
 * Small Area Master API.
 *
 * @class SmallArea
 * @export
 * @see https://webservice.recruit.co.jp/doc/hotpepper/reference.html
 */
export class SmallArea {
    private _URL = `${ENDPOINT}/small_area/v1`;
    private _keyManager = KeyManager.instance;

    private _params: SmallAreaSearchQuery = { small_area: [], middle_area: [] };

    constructor() {}

    /**
     * Sets small area codes (exact match). (Up to 5 codes can be specified. If
     * 6 or more codes are specified, the 6th and subsequent codes will be ignored.)
     *
     * @memberof SmallArea
     * @param {...string[]} codes Small area codes.
     * @returns {any} {this}
     */
    smallArea(...codes: string[]): this {
        this._params.small_area?.push(...codes);
        return this;
    }

    /**
     * Sets middle area codes (exact match). (Up to 5 codes can be specified. If
     * 6 or more codes are specified, the 6th and subsequent codes will be ignored.)
     *
     * @memberof SmallArea
     * @param {...string[]} codes Middle area codes.
     * @returns {any} {this}
     */
    middleArea(...codes: string[]): this {
        this._params.middle_area?.push(...codes);
        return this;
    }

    /**
     * Sets small area name (partial match), specified in UTF8 (URL encoding)
     *
     * @memberof SmallArea
     * @param {string} keyword
     * @returns {any} {this}
     */
    keyword(keyword: string): this {
        this._params.keyword = keyword;
        return this;
    }

    /**
     * Specify the number of search results to start outputting.
     *
     * @memberof SmallArea
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
     * @memberof SmallArea
     * @param {number} count The number of search results to be output from.
     * @returns {any} {this}
     */
    count(count: number): this {
        this._params.count = count;
        return this;
    }

    /**
     * Search small areas.
     *
     * @memberof SmallArea
     * @returns {any}
     *   {Promise<HotPepperResponse<ResponseField<SmallAreaResponse>>>}
     */
    async search(): Promise<
        HotPepperResponse<ResponseField<SmallAreaResponse>>
    > {
        const params = new URLSearchParams({
            key: this._keyManager.apiKey,
            format: 'json',
            ...formatParams({ ...this._params }),
        });
        const res = await fetch(`${this._URL}?${params}`);
        const json = <ResponseField<SmallAreaResponse>>await res.json();
        if (isSuccessfulResponse(json))
            return {
                status: 200,
                result: json.results.small_area,
                rawJson: json,
            };
        return {
            status: json.results.error[0].code,
            error: json.results.error[0].message,
            rawJson: json,
        };
    }
}
