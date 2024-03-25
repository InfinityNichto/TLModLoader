import { PrefixCategory } from "../PrefixCategory.js";
import { ModItem } from "../ModItem.js";
import { ItemLoader } from "./ItemLoader.js";
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
 
    static Roll(item, unifiedRandom, justCheck) {
        const elements = [];
        let prefix;
        const forcedPrefix = ItemLoader.ChoosePrefix(item, unifiedRandom);
        if (forcedPrefix > 0 && this.CanRoll(item, forcedPrefix)) {
            prefix = forcedPrefix;
            return { success: true, prefix: prefix };
        }

        prefix = 0;
        const prefixCategory = item.GetPrefixCategory();
        if (prefixCategory.HasValue)
        {
            PrefixCategory category2 = prefixCategory.GetValueOrDefault();
            if (justCheck)
            {
                return true;
            }
            int[] vanillaPrefixes = Item.GetVanillaPrefixes(category2);
            foreach (int pre in vanillaPrefixes)
            {
                wr.Add(pre);
            }
            if (PrefixLegacy.ItemSets.ItemsThatCanHaveLegendary2[item.type])
            {
                wr.Add(84);
            }
            AddCategory(category2);
            if (IsWeaponSubCategory(category2))
            {
                AddCategory(PrefixCategory.AnyWeapon);
            }
            for (int i = 0; i < 50; i++)
            {
                prefix = wr.Get();
                if (ItemLoader.AllowPrefix(item, prefix))
                {
                    return true;
                }
            }
            return false;
        }
        return false;
        void AddCategory(PrefixCategory category)
        {
            foreach (ModPrefix modPrefix in categoryPrefixes[category].Where((ModPrefix x) => x.CanRoll(item)))
            {
                wr.Add(modPrefix.Type, modPrefix.RollChance(item));
            }
        }
    }
 
    public static bool IsWeaponSubCategory(PrefixCategory category)
    {
        if (category != 0 && category != PrefixCategory.Ranged)
        {
            return category == PrefixCategory.Magic;
        }
        return true;
    }
 
    public static void ApplyAccessoryEffects(Player player, Item item)
    {
        GetPrefix(item.prefix)?.ApplyAccessoryEffects(player);
    }
}