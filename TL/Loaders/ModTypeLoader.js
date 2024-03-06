export class ModTypeLoader {
    static registeredType = [];

    static RegisterType(type) {
        this.registeredType.push(type);
    }

    static Load() {
        this.registeredType.forEach(t => t.Load());
    }

    static SetupContent() {
        this.registeredType.forEach(t => t.SetupContent());
    }

    static IsType(type) {
        return this.registeredType.includes(type);
    }

    static GetTypeByName(name) {
        for (const t of this.registeredType) {
            if (t.constructor.name == name) {
                return t;
            }
        }

        return null;
    }
}