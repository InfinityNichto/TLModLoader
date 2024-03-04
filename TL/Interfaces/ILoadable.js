export class ILoadable {
    ILoad(mod) {
        throw new Error(`[${this.constructor.name}] method 'ILoad' must be implemented`);
    }

    IsLoadingEnabled(mod) {
        return true;
    }

    IUnload() {
        throw new Error(`[${this.constructor.name}] method 'IUnload' must be implemented`);
    }
}