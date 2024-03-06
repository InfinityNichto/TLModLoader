import { ModTypeLoader } from "./Loaders/ModTypeLoader.js";

export class ModType {
    Mod;
    Name = this.constructor.name;
    FullName = (this.Mod?.Name ?? "Terraria") + '/' + this.Name;

    ModTypeLoad(mod) {
        this.Mod = mod;
        this.Load();
        this.Register();
    }

    static RegisterType() {
		ModTypeLoader.RegisterType(this);
	}

    Load() { }

    IsLoadingEnabled(mod) {
        return true;
    }

    Register() { }

    SetupContent() { }

    SetStaticDefaults() { }
}