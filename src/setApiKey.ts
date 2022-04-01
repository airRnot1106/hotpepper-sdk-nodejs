import { KeyManager } from './keyManager';

/**
 * Set the API key. This is required for all API calls. API keys can be
 * generated at https://webservice.recruit.co.jp/register/
 *
 * @param {string} apiKey
 */
export const setApiKey = (apiKey: string) => {
    KeyManager.instance.apiKey = apiKey;
};
