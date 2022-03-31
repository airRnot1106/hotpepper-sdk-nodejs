export const ENDPOINT = 'http://webservice.recruit.co.jp/hotpepper';

type SuccessfulStatus = 200;

type FailedStatus = 1000 | 2000 | 3000;

export interface SuccessfulResponseBase {
    api_version: string;
    results_available: number;
    results_returned: number;
    results_start: number;
}

export interface FailedResponse {
    api_version: string;
    error: [
        {
            code: FailedStatus;
            message: string;
        }
    ];
}

export interface MasterResponse {
    code: string;
    name: string;
}

export type ResponseField<T> =
    | {
          results: SuccessfulResponseBase & T;
      }
    | {
          results: FailedResponse;
      };

export interface SuccessfulResult<T extends ResponseField<unknown>> {
    status: SuccessfulStatus;
    result: T extends {
        [key in keyof T]: SuccessfulResponseBase & infer U;
    }
        ? Exclude<U[keyof U], string | number>
        : never;
    rawJson: T extends ResponseField<infer U>
        ? Extract<T, { [key in keyof T]: SuccessfulResponseBase & U }>
        : never;
}

export interface FailedResult<T extends ResponseField<unknown>> {
    status: FailedStatus;
    error: FailedResponse['error'][0]['message'];
    rawJson: Extract<T, { [key in keyof T]: FailedResponse }>;
}

export type HotPepperResponse<T extends ResponseField<unknown>> =
    | SuccessfulResult<T>
    | FailedResult<T>;

export const isSuccessfulResponse = <T>(
    response: ResponseField<T>
): response is { results: SuccessfulResponseBase & T } => {
    if (!('error' in response.results)) return true;
    return false;
};

export const formatParams = (
    params: Record<
        string,
        string | string[] | number | number[] | boolean | boolean[] | undefined
    >
): Record<string, string | number | boolean> =>
    Object.fromEntries(
        Object.entries(params)
            .filter(([_key, value]) => {
                if (Array.isArray(value)) return value.length > 0;
                return value !== undefined;
            })
            .map(([key, value]) => {
                if (Array.isArray(value)) return [key, value.join(',')];
                return [key, value];
            })
            .flatMap(([key, value]) => (value ? [[key, value]] : []))
    );
