import fetch from 'node-fetch';

import { KeyManager } from '../keyManager';
import {
    ENDPOINT, HotPepperResponse, isSuccessfulResponse, MasterResponse, ResponseField
} from './apiBase';

export interface LargeServiceAreaResponse {
    large_service_area: MasterResponse[];
}

/**
 * Large Service Area Master API.
 *
 * @class LargeServiceArea
 * @export
 * @see https://webservice.recruit.co.jp/docs/hotpepper/large_service_area.html
 */
export class LargeServiceArea {
    private _URL = `${ENDPOINT}/large_service_area/v1`;
    private _keyManager = KeyManager.instance;

    constructor() {}

    /**
     * Search large service areas.
     *
     * @memberof LargeServiceArea
     * @returns {any}
     *   {Promise<HotPepperResponse<ResponseField<LargeServiceAreaResponse>>>}
     */
    async search(): Promise<
        HotPepperResponse<ResponseField<LargeServiceAreaResponse>>
    > {
        const params = new URLSearchParams({
            key: this._keyManager.apiKey,
            format: 'json',
        });
        const res = await fetch(`${this._URL}?${params}`);
        const json = <ResponseField<LargeServiceAreaResponse>>await res.json();
        if (isSuccessfulResponse(json))
            return {
                status: 200,
                result: json.results.large_service_area,
                rawJson: json,
            };
        return {
            status: json.results.error[0].code,
            error: json.results.error[0].message,
            rawJson: json,
        };
    }
}
