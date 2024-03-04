import { ILoadable } from "./Interfaces/ILoadable.js";

export class ModType extends ILoadable {
    Mod;
    Name = this.constructor.name;
    FullName = (Mod?.Name ?? "Terraria") + '/' + this.Name;

    ILoad(mod) {
        this.Mod = mod;
        this.InitTemplateInstance();
        this.Load();
        this.Register();
    }

    Load() { }

    IsLoadingEnabled(mod) {
        return true;
    }

    Register() {
        throw new Error(`[${this.constructor.name}] method 'Register' must be implemented`);
    }

    SetupContent() { }

    SetStaticDefaults() { }

    Unload() { }

    InitTemplateInstance() { }

    ValidateType() { }
}

export class ModEntityType extends ModType {
    Entity;

    InitTemplateInstance() {
        this.Entity = this.CreateTemplateEntity();
    }

    CreateTemplateEntity() {
        throw new Error(`[${this.constructor.name}] method 'CreateTemplateEntity' must be implemented`);
    }

    Register() {
        throw new Error(`[${this.constructor.name}] method 'Register' must be implemented`);
    }
}

export class FromModEntityType extends ModEntityType {
    _isCloneable = undefined;

    get IsCloneable() {
        let valueOrDefault = this._isCloneable ?? false;
        if (this._isCloneable === undefined) {
            valueOrDefault = FromModEntityType.Cloning.IsCloneable(this, () => this.Clone);
            this._isCloneable = valueOrDefault;
        }
        return valueOrDefault;
    }

    CloneNewInstances() {
        return false;
    }

    Clone(newEntity) {
        if (!this.IsCloneable) {
            FromModEntityType.Cloning.WarnNotCloneable(this.constructor);
        }
        const obj = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
        obj.Entity = newEntity;
        return obj;
    }

    NewInstance(entity) {
        if (this.CloneNewInstances()) {
            return this.Clone(entity);
        }
        const obj = new this.constructor();
        obj.Mod = this.Mod;
        obj.Entity = entity;
        return obj;
    }

    CreateTemplateEntity() {
        throw new Error(`[${this.constructor.name}] method 'CreateTemplateEntity' must be implemented`);
    }
}