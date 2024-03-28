import { PrefixCategory } from "../PrefixCategory.js";
import { ModItem } from "../ModItem.js";
import { ItemLoader } from "./ItemLoader.js";
import { Utility } from "../Utilities.js";
import { Terraria } from "../ModImports.js";
 
const ID = Terraria.ID;
const Lang = Terraria.Lang;
const PrefixLegacy = Terraria.GameContent.PrefixLegacy;

export class PrefixLoader {
    static prefixes = [];
    static categoryPrefixes = {};
    static get PrefixCount() { return ID.PrefixID.Count; }
 
    static RegisterPrefix(prefix) {
        this.prefixes.push(prefix);
        this.categoryPrefixes[prefix.Category].push(prefix);
    }
 
    static ReservePrefixID() {
        return this.PrefixCount++;
    }
 
    static GetPrefix(type) {
        if (type < ID.PrefixID.Count || type >= this.PrefixCount) {
            return null;
        }

        return this.prefixes[type - ID.PrefixID.Count];
    }
 
    static GetPrefixesInCategory(category) {
        return this.categoryPrefixes[category];
    }
 
    static ResizeArrays() {
        LoaderUtils.ResetStaticMembers(typeof(PrefixID));
        Lang.prefix = Lang.prefix.cloneResized(this.PrefixCount);
    }
 
    static FinishSetup() {
        for (const prefix of this.prefixes) {
            Lang.prefix[prefix.Type] = prefix.DisplayName;
        }
    }

 
    static CanRoll(item, prefix) {
        if (!ItemLoader.AllowPrefix(item, prefix)) {
            return false;
        }

        const modPrefix = this.GetPrefix(prefix);
        let prefixCategory;
        if (modPrefix != null) {
            if (!modPrefix.CanRoll(item)) {
                return false;
            }

            if (modPrefix.Category == PrefixCategory.Custom) {
                return true;
            }

            prefixCategory = item.GetPrefixCategory();
            if (prefixCategory != undefined || prefixCategory != null) {
                const itemCategory = prefixCategory.GetValueOrDefault();
                if (modPrefix.Category != itemCategory) {
                    if (modPrefix.Category == PrefixCategory.AnyWeapon) {
                        return this.IsWeaponSubCategory(itemCategory);
                    }

                    return false;
                }

                return true;
            }

            return false;
        }

        prefixCategory = item.GetPrefixCategory();
        if (prefixCategory != undefined || prefixCategory != null) {
            const category = prefixCategory.GetValueOrDefault();
            if (ModItem.GetVanillaPrefixes(category).Contains(prefix)) {
                return true;
            }
        }

        if (PrefixLegacy.ItemSets.ItemsThatCanHaveLegendary2[item.type] && prefix == 84) {
            return true;
        }

        return false;
    }
 
    static Roll(item, unifiedRandom, prefix, justCheck) {
        const AddCategory = (category) => {
            for (const modPrefix of this.categoryPrefixes[category].filter((pre) => pre.CanRoll(item))) {
                Add(modPrefix.Type, modPrefix.RollChance(item));
            }
        }

        const Add = (value, weight = 1.0) => {
            weightedRandom.push([value, weight]);
        }

        const Get = () => {
            let totalWeight = 0;
            for (const num of weightedRandom) {
                totalWeight += num;
            }

            let randDouble = Utility.randFloat(0.0001, 1) * totalWeight;
            for (const num of weightedRandom) {
                if (randDouble > num) {
                    randDouble -= num;
                }
            }

            return 0;
        }

        const weightedRandom = [];
        const forcedPrefix = ItemLoader.ChoosePrefix(item, unifiedRandom);
        if (forcedPrefix > 0 && this.CanRoll(item, forcedPrefix)) {
            prefix = forcedPrefix;
            return { success: true, prefix: prefix };
        }

        prefix = 0;
        const prefixCategory = item.GetPrefixCategory();
        if (prefixCategory != null) {
            const category2 = prefixCategory;
            if (justCheck) {
                return true;
            }

            const vanillaPrefixes = ModItem.GetVanillaPrefixes(category2);
            for (const pre of vanillaPrefixes) {
                Add(pre);
            }

            if (PrefixLegacy.ItemSets.ItemsThatCanHaveLegendary2[item.type]) {
                Add(84);
            }

            AddCategory(category2);
            if (this.IsWeaponSubCategory(category2)) {
                AddCategory(PrefixCategory.AnyWeapon);
            }

            for (let i = 0; i < 50; i++) {
                prefix = Get();
                if (ItemLoader.AllowPrefix(item, prefix)) {
                    return true;
                }
            }

            return false;
        }
    }
 
    static IsWeaponSubCategory(category) {
        if (category != 0 && category != PrefixCategory.Ranged) {
            return category == PrefixCategory.Magic;
        }

        return true;
    }
 
    static ApplyAccessoryEffects(player, item) {
        this.GetPrefix(item.prefix)?.ApplyAccessoryEffects(player);
    }
}