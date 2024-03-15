import { Mod } from "./Mod.js";
import { ModType } from "./ModType.js";
import { StatInheritanceData } from "./StatInheritanceData.js";
import { Terraria } from "./ModImports.js";

const Language = Terraria.Localization.Language;

export class DamageClass extends ModType {
    static Default = new DefaultDamageClass();
    static Generic = new GenericDamageClass();
    static Melee = new MeleeDamageClass();
    static MeleeNoSpeed = new MeleeNoSpeedDamageClass();
    static Ranged = new RangedDamageClass();
    static Magic = new MagicDamageClass();
    static Summon = new SummonDamageClass();
    static SummonMeleeSpeed = new SummonMeleeSpeedDamageClass();
    static MagicSummonHybrid = new MagicSummonHybridDamageClass();
    static Throwing = new ThrowingDamageClass();
 
    Type;
    LocalizationCategory = "DamageClasses";
    get DisplayName() { return Mod.GetLocalization("DisplayName", this.NameWithSpaces) }
    UseStandardCritCalcs = true;

    GetModifierInheritance(damageClass) {
        return damageClass != DamageClass.Generic ? StatInheritanceData.None : StatInheritanceData.Full;
    }
 
    GetEffectInheritance(damageClass) {
        return false;
    }
 
    SetDefaultStats(player) { }
 
    ShowStatTooltipLine(player, lineName) {
        return true;
    }
 
    Register() {
        ModTypeLookup.Register(this.constructor);
        this.Type = DamageClassLoader.Add(this.constructor);
    }
 
    SetupContent() {
        this.SetStaticDefaults();
    }
}

class VanillaDamageClass extends DamageClass {
    DisplayName = Language.GetText(this.LangKey);
    LangKey;
}

class DefaultDamageClass extends VanillaDamageClass {
    LangKey = "LegacyTooltip.55";

    GetModifierInheritance(damageClass) {
        return StatInheritanceData.None;
    }
}

class GenericDamageClass extends VanillaDamageClass {
    LangKey = "LegacyTooltip.55";
 
    GetModifierInheritance(damageClass) {
        return StatInheritanceData.None;
    }
 
    SetDefaultStats(player) {
        player.GetCritChance(this.constructor) = 4;
    }
}

class MeleeDamageClass extends VanillaDamageClass {
    LangKey = "LegacyTooltip.2";
}

class MeleeNoSpeedDamageClass extends VanillaDamageClass {
    LangKey = "LegacyTooltip.2";
 
    GetModifierInheritance(damageClass) {
        if (damageClass == DamageClass.Generic || damageClass == DamageClass.Melee) {
            const full = StatInheritanceData.Full;
            full.attackSpeedInheritance = 0;
            return full;
        }
    
        return StatInheritanceData.None;
    }
 
    GetEffectInheritance(damageClass) {
        return damageClass == DamageClass.Melee;
    }
}

class RangedDamageClass extends VanillaDamageClass {
    LangKey = "LegacyTooltip.3";
}

class MagicDamageClass extends VanillaDamageClass {
    LangKey = "LegacyTooltip.4";
}

class SummonDamageClass extends VanillaDamageClass {
    LangKey = "LegacyTooltip.53";
    UseStandardCritCalcs = false;
 
    ShowStatTooltipLine(player, lineName) {
        if (lineName != "CritChance") {
            return lineName != "Speed";
        }

        return false;
    }
}

class SummonMeleeSpeedDamageClass extends VanillaDamageClass {
    LangKey = "LegacyTooltip.53";
    UseStandardCritCalcs = false;
 
    GetModifierInheritance(damageClass) {
        if (damageClass == DamageClass.Melee) {
            return new StatInheritanceData(0, 0, 1);
        }

        if (damageClass == DamageClass.Generic || damageClass == DamageClass.Summon) {
            return StatInheritanceData.Full;
        }

        return StatInheritanceData.None;
    }
 
    GetEffectInheritance(damageClass) {
        return damageClass == DamageClass.Summon;
    }
 
    ShowStatTooltipLine(player, lineName) {
        return lineName != "CritChance";
    }
}

class MagicSummonHybridDamageClass extends VanillaDamageClass {
    LangKey = "magic or summon damage";
 
    GetModifierInheritance(damageClass) {
        if (damageClass == DamageClass.Generic || damageClass == DamageClass.Magic || damageClass == DamageClass.Summon) {
            return StatInheritanceData.Full;
        }

        return StatInheritanceData.None;
    }
 
    GetEffectInheritance(damageClass) {
        if (damageClass != DamageClass.Magic) {
            return damageClass == DamageClass.Summon;
        }

        return true;
    }
}

class ThrowingDamageClass extends VanillaDamageClass {
    LangKey = "LegacyTooltip.58";
}