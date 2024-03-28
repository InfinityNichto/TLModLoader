import { Terraria } from "../ModImports.js";

const ItemRarity = Terraria.GameContent.ItemRarity;

export class RarityLoader {
    static rarities = [];
    static get RarityCount() { return 12 + this.rarities.length };
 
    static Add(rarity) {
        this.rarities.push(rarity);
        return this.RarityCount - 1;
    }
 
    static FinishSetup() {
        ItemRarity.Initialize();
    }
 
    static GetRarity(type) {
        if (type < 12 || type >= this.RarityCount) {
            return null;
        }

        return this.rarities[type - 12];
    }
}