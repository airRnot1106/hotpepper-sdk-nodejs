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

export class SmallArea {
    private _URL = `${ENDPOINT}/small_area/v1`;
    private _keyManager = KeyManager.instance;

    private _params: SmallAreaSearchQuery = { small_area: [], middle_area: [] };

    constructor() {}

    smallArea(...codes: string[]): this {
        this._params.small_area?.push(...codes);
        return this;
    }

    middleArea(...codes: string[]): this {
        this._params.middle_area?.push(...codes);
        return this;
    }

    keyword(keyword: string): this {
        this._params.keyword = keyword;
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
