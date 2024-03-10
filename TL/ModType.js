import { ModTypeLoader } from "./Loaders/ModTypeLoader.js";

export class ModType {
    Mod = undefined;
    Name = this.constructor.name;
    FullName = (this.Mod?.Name ?? "Terraria") + '/' + this.Name;
    get NameWithSpaces() { return this.Name.replace(/([A-Z])/g, ' $1').trim() };

    ModTypeLoad(mod) {
        this.Mod = mod;
        this.InitTemplateInstance();
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

    InitTemplateInstance() { }
}

export class ModEntityType extends ModType {
    Entity;

    InitTemplateInstance() {
        this.Entity = this.CreateTemplateInstance();
    }

    CreateTemplateInstance() { }
}

export class ModTexturedType extends ModType {
    Texture = this.constructor.name;
    FrameCount = -1;
    TicksPerFrame = 100;
}