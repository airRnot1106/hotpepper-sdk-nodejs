import { KeyManager } from './keyManager';

export const setApiKey = (apiKey: string) => {
    KeyManager.instance.apiKey = apiKey;
};
