export class KeyManager {
    private static _instance: KeyManager;
    private _apiKey?: string;

    private constructor() {}

    static get instance() {
        if (!this._instance) this._instance = new KeyManager();
        return this._instance;
    }

    get apiKey(): string {
        if (!this._apiKey) throw new Error('apiKey is not set.');
        return this._apiKey;
    }

    set apiKey(apiKey: string) {
        this._apiKey = apiKey;
    }
}
