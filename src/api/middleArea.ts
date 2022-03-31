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

export class MiddleArea {
    private _URL = `${ENDPOINT}/middle_area/v1`;
    private _keyManager = KeyManager.instance;

    private _params: MiddleAreaSearchQuery = {
        middle_area: [],
        large_area: [],
    };

    constructor() {}

    middleArea(...codes: string[]): this {
        this._params.middle_area?.push(...codes);
        return this;
    }

    largeArea(...codes: string[]): this {
        this._params.large_area?.push(...codes);
        return this;
    }

    keyword(keyword: string): this {
        this._params.keyword = keyword;
        return this;
    }

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
