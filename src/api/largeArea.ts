import fetch from 'node-fetch';

import { KeyManager } from '../keyManager';
import { ENDPOINT, HotPepperResponse, isSuccessfulResponse, ResponseField } from './apiBase';
import { ResponseLargeServiceArea } from './largeServiceArea';
import { ResponseServiceArea } from './serviceArea';

interface SearchQueryLargeArea {
    large_area?: string[];
    keyword?: string;
}

export interface ResponseLargeArea {
    large_area: {
        code: string;
        name: string;
        service_area: ResponseServiceArea[keyof ResponseServiceArea][number];
        large_service_area: ResponseLargeServiceArea[keyof ResponseLargeServiceArea][number];
    }[];
}

export class LargeArea {
    private _URL = `${ENDPOINT}/large_area/v1`;
    private _keyManager = KeyManager.instance;

    private _params: SearchQueryLargeArea = { large_area: [] };

    constructor() {}

    largeArea(...codes: string[]): this {
        this._params.large_area?.push(...codes);
        return this;
    }

    keyword(keyword: string): this {
        this._params.keyword = keyword;
        return this;
    }

    async search(): Promise<
        HotPepperResponse<ResponseField<ResponseLargeArea>>
    > {
        const params = new URLSearchParams({
            key: this._keyManager.apiKey,
            format: 'json',
            ...Object.fromEntries(
                Object.entries(this._params).map(([key, value]) => {
                    if (Array.isArray(value)) return [key, value.join(',')];
                    return [key, value];
                })
            ),
        });
        console.log(params.toString());
        const res = await fetch(`${this._URL}?${params}`);
        const json = <ResponseField<ResponseLargeArea>>await res.json();
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
