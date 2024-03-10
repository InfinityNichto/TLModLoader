function findKeyIgnoreCase(obj, key) {
    const keys = Object.keys(obj);
    for (let k of keys) {
        if (k.toUpperCase() === key.toUpperCase()) {
            return k;
        }
    }

    return null;
}

function internalTryGetValue(obj, key) {
    if (key in obj) { return { found: true, value: obj[key] };
    } else { return { found: false, value: undefined }; }
}

export class ModLoader {
    static registeredMod = [];
    static modsByName = {};

    static Register(mod) {
        this.registeredMod.push(mod);
    }

    static Load() {
        this.registeredMod.forEach(m => m.Load());
    }

    static IsMod(mod) {
        return this.registeredMod.includes(mod);
    }

    static GetMod(name) {
        return this.modsByName[findKeyIgnoreCase(name)];
    }

    static TryGetMod(name) {
        return internalTryGetValue(this.modsByName, name);
    }

    static HasMod(name) {
		return name in this.modsByName;
	}   

    // obsolete?
    static GetModByName(name) {
        for (const m of this.registeredMod) {
            if (m.constructor.name == name) {
                return m;
            }
        }

        return null;
    }
}