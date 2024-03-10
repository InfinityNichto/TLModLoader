import { StatModifier } from "./StatModifier.js";

export class DamageClassData {
    damage = StatModifier.Default;
    critChance;
    attackSpeed = 1;
    armorPen;
    knockback = StatModifier.Default;
}