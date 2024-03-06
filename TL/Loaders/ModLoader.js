export class ModLoader {
    static registeredMod = [];

    static Register(mod) {
        this.registeredMod.push(mod);
    }

    static Load() {
        this.registeredMod.forEach(m => m.Load());
    }

    static IsMod(mod) {
        return this.registeredMod.includes(mod);
    }

    static GetModByName(name) {
        for (const m of this.registeredMod) {
            if (m.constructor.name == name) {
                return m;
            }
        }

        return null;
    }
}