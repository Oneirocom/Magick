export class Cache {
    constructor() {
        this._map = new WeakMap();
    }

    track(value) {
        if (this._map.has(value)) return true;
        this._map.set(value, true);
    }
}
