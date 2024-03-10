import { ModEntityType } from "../ModType.js";

export class ModPlayer extends ModEntityType {
    damageData = [];

    getCritChance(damageClass) {
        return this.damageData[damageClass.Type].critChance;
    }
}