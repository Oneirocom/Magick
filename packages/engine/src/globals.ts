class GlobalsManager {
    globals = new Map();
    registerGlobal(name: string, value: any) {
        this.globals.set(name, value);
    }

    getGlobal(name: string) {
        return this.globals.get(name);
    }
}

export const globalsManager = new GlobalsManager();