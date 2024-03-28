import { Mod } from "./Mod.js";
import { ModType } from "./ModType.js";
import { ModTypeLookup } from "./ModTypeLookup.js";
import { PrefixLoader } from "./Loaders/PrefixLoader.js";
import { PrefixCategory } from "./PrefixCategory.js";

const ID = Terraria.ID;

export class ModPrefix extends ModType {
    Type;
    LocalizationCategory = "Prefixes";
    get DisplayName() { return Mod.GetLocalization("DisplayName", this.NameWithSpaces); }
    get Category() { PrefixCategory.Custom; }
 
    Register() {
        ModTypeLookup.Register(this.constructor);
        this.Type = PrefixLoader.ReservePrefixID();
        PrefixLoader.RegisterPrefix(this.constructor);
    }
 
    SetupContent() {
        this.SetStaticDefaults();
        ID.PrefixID.Search.Add(this.FullName, this.Type);
    }
 
    RollChance(item) {
        return 1;
    }
 
    CanRoll(item) {
        return RollChance(item) > 0;
    }
 
    SetStats(damageMult, knockbackMult, useTimeMult, scaleMult, shootSpeedMult, manaMult, critBonus) {
        return { damageMult, knockbackMult, useTimeMult, scaleMult, shootSpeedMult, manaMult, critBonus }
    }
 
    AllStatChangesHaveEffectOn(item) {
        return true;
    }
 
    Apply(item) { }
 
    ModifyValue(valueMult) {
        return valueMult;
    }
 
    ApplyAccessoryEffects(player) {
    }
 
    GetTooltipLines(item) {
        return null;
    }
}