import fetch from 'node-fetch';

import { KeyManager } from '../keyManager';
import {
    BooleanNum, ENDPOINT, formatParams, HotPepperResponse, isSuccessfulResponse, ResponseField
} from './apiBase';

interface ShopSearchQuery {
    keyword?: string[];
    tel?: string;
    start?: number;
    count?: number;
}

interface ShopResponse {
    shop: {
        address: string;
        genre: { name: string };
        id: string;
        name: string;
        name_kana: string;
        urls: { pc: string };
        desc: BooleanNum;
    }[];
}

/**
 * Shop Master API.
 *
 * @class Shop
 * @export
 * @see https://webservice.recruit.co.jp/doc/hotpepper/reference.html
 */
export class Shop {
    private _URL = `${ENDPOINT}/shop/v1`;
    private _keyManager = KeyManager.instance;

    private _params: ShopSearchQuery = {
        keyword: [],
    };

    constructor() {}

    /**
     * Sets keywords (partial match) of store name, pronunciation, and address.
     * Character code is UTF8. AND search is performed by passing a half-width
     * space-separated string. Multiple ones can be specified.
     *
     * @memberof Shop
     * @param {...string[]} keyword Keywords (partial match) of store name,
     *   pronunciation, and address.
     * @returns {any} {this}
     */
    keyword(...keyword: string[]): this {
        this._params.keyword?.push(...keyword);
        return this;
    }

    /**
     * Sets store phone number (exact match). Single-byte numbers (no hyphen)
     *
     * @memberof Shop
     * @param {string} tel Store phone number.
     * @returns {any} {this}
     */
    tel(tel: string): this {
        this._params.tel = tel;
        return this;
    }

    /**
     * Specify the number of search results to start outputting.
     *
     * @memberof Shop
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
     * @memberof Shop
     * @param {number} count The number of search results to be output from.
     * @returns {any} {this}
     */
    count(count: number): this {
        this._params.count = count;
        return this;
    }

    /**
     * Search shops.
     *
     * @memberof Shop
     * @returns {any} {Promise<HotPepperResponse<ResponseField<ShopResponse>>>}
     */
    async search(): Promise<HotPepperResponse<ResponseField<ShopResponse>>> {
        const params = new URLSearchParams({
            key: this._keyManager.apiKey,
            format: 'json',
            ...formatParams({ ...this._params }),
        });
        const res = await fetch(`${this._URL}?${params}`);
        const json = <ResponseField<ShopResponse>>await res.json();
        if (isSuccessfulResponse(json))
            return {
                status: 200,
                result: json.results.shop,
                rawJson: json,
            };
        return {
            status: json.results.error[0].code,
            error: json.results.error[0].message,
            rawJson: json,
        };
    }
}
