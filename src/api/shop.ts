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
    };
}

export class Shop {
    private _URL = `${ENDPOINT}/shop/v1`;
    private _keyManager = KeyManager.instance;

    private _params: ShopSearchQuery = {
        keyword: [],
    };

    constructor() {}

    keyword(keyword: string): this {
        this._params.keyword?.push(keyword);
        return this;
    }

    tel(tel: string): this {
        this._params.tel = tel;
        return this;
    }

    start(start: number): this {
        this._params.start = start;
        return this;
    }

    count(count: number): this {
        this._params.count = count;
        return this;
    }

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
