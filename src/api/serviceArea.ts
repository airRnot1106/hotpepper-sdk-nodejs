import fetch from 'node-fetch';

import { KeyManager } from '../keyManager';
import {
    ENDPOINT, HotPepperResponse, isSuccessfulResponse, MasterResponse, ResponseField
} from './apiBase';
import { LargeServiceAreaResponse } from './largeServiceArea';

export interface ServiceAreaResponse {
    service_area: (MasterResponse & {
        [key in keyof LargeServiceAreaResponse]: MasterResponse;
    })[];
}

/**
 * Service Area Master API.
 *
 * @class ServiceArea
 * @export
 * @see https://webservice.recruit.co.jp/doc/hotpepper/reference.html
 */
export class ServiceArea {
    private _URL = `${ENDPOINT}/service_area/v1`;
    private _keyManager = KeyManager.instance;

    constructor() {}

    /**
     * Search service areas.
     *
     * @memberof ServiceArea
     * @returns {any}
     *   {Promise<HotPepperResponse<ResponseField<ServiceAreaResponse>>>}
     */
    async search(): Promise<
        HotPepperResponse<ResponseField<ServiceAreaResponse>>
    > {
        const params = new URLSearchParams({
            key: this._keyManager.apiKey,
            format: 'json',
        });
        const res = await fetch(`${this._URL}?${params}`);
        const json = <ResponseField<ServiceAreaResponse>>await res.json();
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
