export class StatInheritanceData {
    constructor(damageInheritance = 0, critChanceInheritance = 0, attackSpeedInheritance = 0, armorPenInheritance = 0, knockbackInheritance = 0) {
        this.damageInheritance = damageInheritance;
        this.critChanceInheritance = critChanceInheritance;
        this.attackSpeedInheritance = attackSpeedInheritance;
        this.armorPenInheritance = armorPenInheritance;
        this.knockbackInheritance = knockbackInheritance;
    }

    static Full = new StatInheritanceData(1, 1, 1, 1, 1);
    static None = new StatInheritanceData(0, 0, 0, 0, 0);
}