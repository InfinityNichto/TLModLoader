function internalTryGetValue(obj, key) {
    if (key in obj) { return { found: true, value: obj[key] };
    } else { return { found: false, value: undefined }; }
}

export class ModTypeLookup {
    dict = {};
    tieredDict = {};

    static Register(instance) {
        this.RegisterWithName(instance, instance.Name, instance.FullName);
    }

    static RegisterWithName(instance, name, fullName) {
		if (fullName in this.dict) {
			throw new Error("Exception LoadErrorDuplicateName");
		}

		this.dict[fullName] = instance;
		const modName = instance.Mod?.Name ?? "Terraria";

        const { flag, subDictionary } = internalTryGetValue(this.this.tieredDict, modName);
		if (!flag) {
			subDictionary = (this.tieredDict[modName] = {});
		}

		subDictionary[name] = instance;
	}

    static Get(fullName) {
        return this.dict[fullName];
    }

    static TryGetValue(fullName) {
        return internalTryGetValue(this.dict, fullName);
    }

    static TryGetValue2(modType, modName, contentName) {
        const { flag, subDictionary } = internalTryGetValue(this.tieredDict, modName);
		if (!flag) {
			return { found: false, value: new modType() }
		}

		return internalTryGetValue(subDictionary, contentName);
	}
}