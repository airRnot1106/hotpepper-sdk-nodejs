import fetch from 'node-fetch';

import { KeyManager } from '../keyManager';
import {
    ENDPOINT, formatParams, HotPepperResponse, isSuccessfulResponse, MasterResponse, ResponseField
} from './apiBase';

interface GenreSearchQuery {
    code?: string[];
    keyword?: string;
}

export interface GenreResponse {
    genre: MasterResponse[];
}

export class Genre {
    private _URL = `${ENDPOINT}/genre/v1`;
    private _keyManager = KeyManager.instance;

    private _params: GenreSearchQuery = { code: [] };

    constructor() {}

    async search(): Promise<HotPepperResponse<ResponseField<GenreResponse>>> {
        const params = new URLSearchParams({
            key: this._keyManager.apiKey,
            format: 'json',
            ...formatParams({ ...this._params }),
        });
        const res = await fetch(`${this._URL}?${params}`);
        const json = <ResponseField<GenreResponse>>await res.json();
        if (isSuccessfulResponse(json))
            return {
                status: 200,
                result: json.results.genre,
                rawJson: json,
            };
        return {
            status: json.results.error[0].code,
            error: json.results.error[0].message,
            rawJson: json,
        };
    }
}
