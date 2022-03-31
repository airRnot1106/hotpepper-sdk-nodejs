import fetch from 'node-fetch';

import { KeyManager } from '../keyManager';
import { ENDPOINT, HotPepperResponse, isSuccessfulResponse, ResponseField } from './apiBase';
import { ResponseLargeServiceArea } from './largeServiceArea';

export interface ResponseServiceArea {
    service_area: {
        code: string;
        name: string;
        large_service_area: ResponseLargeServiceArea[keyof ResponseLargeServiceArea][number];
    }[];
}

export class ServiceArea {
    private _URL = `${ENDPOINT}/service_area/v1`;
    private _keyManager = KeyManager.instance;

    constructor() {}

    async search(): Promise<
        HotPepperResponse<ResponseField<ResponseServiceArea>>
    > {
        const params = new URLSearchParams({
            key: this._keyManager.apiKey,
            format: 'json',
        });
        const res = await fetch(`${this._URL}?${params}`);
        const json = <ResponseField<ResponseServiceArea>>await res.json();
        if (isSuccessfulResponse(json))
            return {
                status: 200,
                result: json.results.service_area,
                rawJson: json,
            };
        return {
            status: json.results.error[0].code,
            error: json.results.error[0].message,
            rawJson: json,
        };
    }
}
