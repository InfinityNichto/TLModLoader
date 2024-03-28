import { ItemLoader } from "../Loaders/ItemLoader.js";
import { PrefixLoader } from "../Loaders/PrefixLoader.js";
import { Terraria, System } from "../ModImports.js";
import { ModItem } from "../ModItem.js";

const Main = Terraria.Main;
const WorldGen = Terraria.WorldGen;
const Item = Terraria.Item;
const Player = Terraria.Player;
const Utils = Terraria.Utils;
const ID = Terraria.ID;
const UnifiedRandom = Terraria.Utilities.UnifiedRandom;
const Chat = Terraria.UI.Chat;
const TextSnippet = Chat.TextSnippet;
const Int32 = System.Int32;

const TryParse = Int32["bool TryParse(string s, int result)"];

export function Initialize() {
    ID.PrefixID.Sets["void .cctor()"].hook((original) => {
        original();

        ID.PrefixID.Sets.Factory = ID.SetFactory.new()["void .ctor(int size)"](PrefixLoader.PrefixCount);
    });

    Player.GrantPrefixBenefits.hook((original, self, item) => {
        original(self, item);

        PrefixLoader.ApplyAccessoryEffects(self, item);
    });

    Item.TryGetPrefixStatMultipliersForItem.hook((original, self, rolledPrefix, dmg, kb, spd, size, shtspd, mcst, crt) => {
		dmg = 1;
		kb = 1;
		spd = 1;
		size = 1;
		shtspd = 1;
		mcst = 1;
		crt = 0;
		switch (rolledPrefix) {
            case 1:
                size = 1.12;
                break;
            case 2:
                size = 1.18;
                break;
            case 3:
                dmg = 1.05;
                crt = 2;
                size = 1.05;
                break;
            case 4:
                dmg = 1.1;
                size = 1.1;
                kb = 1.1;
                break;
            case 5:
                dmg = 1.15;
                break;
            case 6:
                dmg = 1.1;
                break;
            case 81:
                kb = 1.15;
                dmg = 1.15;
                crt = 5;
                spd = 0.9;
                size = 1.1;
                break;
            case 7:
                size = 0.82;
                break;
            case 8:
                kb = 0.85;
                dmg = 0.85;
                size = 0.87;
                break;
            case 9:
                size = 0.9;
                break;
            case 10:
                dmg = 0.85;
                break;
            case 11:
                spd = 1.1;
                kb = 0.9;
                size = 0.9;
                break;
            case 12:
                kb = 1.1;
                dmg = 1.05;
                size = 1.1;
                spd = 1.15;
                break;
            case 13:
                kb = 0.8;
                dmg = 0.9;
                size = 1.1;
                break;
            case 14:
                kb = 1.15;
                spd = 1.1;
                break;
            case 15:
                kb = 0.9;
                spd = 0.85;
                break;
            case 16:
                dmg = 1.1;
                crt = 3;
                break;
            case 17:
                spd = 0.85;
                shtspd = 1.1;
                break;
            case 18:
                spd = 0.9;
                shtspd = 1.15;
                break;
            case 19:
                kb = 1.15;
                shtspd = 1.05;
                break;
            case 20:
                kb = 1.05;
                shtspd = 1.05;
                dmg = 1.1;
                spd = 0.95;
                crt = 2;
                break;
            case 21:
                kb = 1.15;
                dmg = 1.1;
                break;
            case 82:
                kb = 1.15;
                dmg = 1.15;
                crt = 5;
                spd = 0.9;
                shtspd = 1.1;
                break;
            case 22:
                kb = 0.9;
                shtspd = 0.9;
                dmg = 0.85;
                break;
            case 23:
                spd = 1.15;
                shtspd = 0.9;
                break;
            case 24:
                spd = 1.1;
                kb = 0.8;
                break;
            case 25:
                spd = 1.1;
                dmg = 1.15;
                crt = 1;
                break;
            case 58:
                spd = 0.85;
                dmg = 0.85;
                break;
            case 26:
                mcst = 0.85;
                dmg = 1.1;
                break;
            case 27:
                mcst = 0.85;
                break;
            case 28:
                mcst = 0.85;
                dmg = 1.15;
                kb = 1.05;
                break;
            case 83:
                kb = 1.15;
                dmg = 1.15;
                crt = 5;
                spd = 0.9;
                mcst = 0.9;
                break;
            case 29:
                mcst = 1.1;
                break;
            case 30:
                mcst = 1.2;
                dmg = 0.9;
                break;
            case 31:
                kb = 0.9;
                dmg = 0.9;
                break;
            case 32:
                mcst = 1.15;
                dmg = 1.1;
                break;
            case 33:
                mcst = 1.1;
                kb = 1.1;
                spd = 0.9;
                break;
            case 34:
                mcst = 0.9;
                kb = 1.1;
                spd = 1.1;
                dmg = 1.1;
                break;
            case 35:
                mcst = 1.2;
                dmg = 1.15;
                kb = 1.15;
                break;
            case 52:
                mcst = 0.9;
                dmg = 0.9;
                spd = 0.9;
                break;
            case 84:
                kb = 1.17;
                dmg = 1.17;
                crt = 8;
                break;
            case 36:
                crt = 3;
                break;
            case 37:
                dmg = 1.1;
                crt = 3;
                kb = 1.1;
                break;
            case 38:
                kb = 1.15;
                break;
            case 53:
                dmg = 1.1;
                break;
            case 54:
                kb = 1.15;
                break;
            case 55:
                kb = 1.15;
                dmg = 1.05;
                break;
            case 59:
                kb = 1.15;
                dmg = 1.15;
                crt = 5;
                break;
            case 60:
                dmg = 1.15;
                crt = 5;
                break;
            case 61:
                crt = 5;
                break;
            case 39:
                dmg = 0.7;
                kb = 0.8;
                break;
            case 40:
                dmg = 0.85;
                break;
            case 56:
                kb = 0.8;
                break;
            case 41:
                kb = 0.85;
                dmg = 0.9;
                break;
            case 57:
                kb = 0.9;
                dmg = 1.18;
                break;
            case 42:
                spd = 0.9;
                break;
            case 43:
                dmg = 1.1;
                spd = 0.9;
                break;
            case 44:
                spd = 0.9;
                crt = 3;
                break;
            case 45:
                spd = 0.95;
                break;
            case 46:
                crt = 3;
                spd = 0.94;
                dmg = 1.07;
                break;
            case 47:
                spd = 1.15;
                break;
            case 48:
                spd = 1.2;
                break;
            case 49:
                spd = 1.08;
                break;
            case 50:
                dmg = 0.8;
                spd = 1.15;
                break;
            case 51:
                kb = 0.9;
                spd = 0.9;
                dmg = 1.05;
                crt = 2;
                break;
            default:
                const modPrefix = PrefixLoader.GetPrefix(rolledPrefix);
                if (modPrefix != null) {
                    if (!modPrefix.AllStatChangesHaveEffectOn(this.constructor)) {
                        return false;
                    }

                    ({ dmg, kb, spd, size, shtspd, mcst, crt } = modPrefix.SetStats(dmg, kb, spd, size, shtspd, mcst, crt));
                }

                break;
        }

        if (dmg != 1 && Math.Round(self.damage * dmg) == self.damage) {
            return false;
        }

        if (spd != 1 && Math.Round(self.useAnimation * spd) == self.useAnimation) {
            return false;
        }
        if (mcst != 1 && Math.Round(self.mana * mcst) == self.mana) {
            return false;
        }
        if (kb != 1 && self.knockBack == 0) {
            return false;
        }

        return true;
	});

    Item.Prefix.hook((original, self, prefixWeWant) => {
        if (!WorldGen.gen && Main.rand == null) {
            Main.rand = UnifiedRandom.new()["void .ctor()"]();
        }

        if (prefixWeWant == 0) {
            return false;
        }

        if (!self.CanHavePrefixes()) {
            return false;
        }

        if (prefixWeWant > 0 && !self.CanApplyPrefix(prefixWeWant)) {
            return false;
        }

        if (prefixWeWant == -1 && self.maxStack > 1) {
            return false;
        }

        const unifiedRandom = WorldGen.gen ? WorldGen.genRand : Main.rand;
        const applyPrefixOverride = ItemLoader.PrefixChance(self, prefixWeWant, unifiedRandom);
        if ((!applyPrefixOverride) ?? false) {
            return false;
        }

        let rolledPrefix = prefixWeWant;
        let dmg = 1;
        let kb = 1;
        let spd = 1;
        let size = 1;
        let shtspd = 1;
        let mcst = 1;
        let crt = 0;
        let flag = true;
        while (flag) {
            flag = false;
            if (((!applyPrefixOverride) ?? true) && rolledPrefix == -1 && unifiedRandom.Next(4) == 0) {
                return true;
            }

            if (prefixWeWant < -1) {
                rolledPrefix = -1;
            }

            if (prefixWeWant == -3) {
                return PrefixLoader.Roll(this, unifiedRandom, true);
            }

            const { success: rollSuccess, prefix: newPrefix } = PrefixLoader.Roll(self, unifiedRandom, rolledPrefix, false);
            if ((rolledPrefix == -1 || rolledPrefix == -2 || rolledPrefix == -3) && !rollSuccess) {
                return false;
            }
            rolledPrefix = newPrefix;

            switch (prefixWeWant) {
                case -3:
                    return true;
                case -1:
                    if (((!applyPrefixOverride) ?? true) && PrefixID.Sets.ReducedNaturalChance[rolledPrefix] && unifiedRandom.Next(3) != 0) {
                        return true;
                    }
                    break;
            }

            if (!self.TryGetPrefixStatMultipliersForItem(rolledPrefix, dmg, kb, spd, size, shtspd, mcst, crt)) {
                flag = true;
                rolledPrefix = -1;
            }
            if (prefixWeWant == -2 && rolledPrefix == 0) {
                rolledPrefix = -1;
                flag = true;
            }
        }

        ModItem.UndoItemAnimationCompensations(self);

        self.damage = Math.Round(self.damage * dmg);
        self.useAnimation = Math.Round(self.useAnimation * spd);
        self.useTime = Math.Round(self.useTime * spd);
        self.reuseDelay = Math.Round(self.reuseDelay * spd);
        self.mana = Math.Round(self.mana * mcst);
        self.knockBack *= kb;
        self.scale *= size;
        self.shootSpeed *= shtspd;
        self.crit += crt;

        if (rolledPrefix >= ID.PrefixID.Count) {
            PrefixLoader.GetPrefix(rolledPrefix)?.Apply(this.constructor);
        }

        ModItem.ApplyItemAnimationCompensationsToVanillaItems();
        let num = 1 * dmg * (2 - spd) * (2 - mcst) * size * kb * shtspd * (1 + crt * 0.02);
        if (rolledPrefix == 62 || rolledPrefix == 69 || rolledPrefix == 73 || rolledPrefix == 77) {
            num *= 1.05;
        }
        if (rolledPrefix == 63 || rolledPrefix == 70 || rolledPrefix == 74 || rolledPrefix == 78 || rolledPrefix == 67) {
            num *= 1.1;
        }
        if (rolledPrefix == 64 || rolledPrefix == 71 || rolledPrefix == 75 || rolledPrefix == 79 || rolledPrefix == 66) {
            num *= 1.15;
        }
        if (rolledPrefix == 65 || rolledPrefix == 72 || rolledPrefix == 76 || rolledPrefix == 80 || rolledPrefix == 68) {
            num *= 1.2;
        }
        if (rolledPrefix >= ID.PrefixID.Count) {
            num = PrefixLoader.GetPrefix(rolledPrefix)?.ModifyValue(num) ?? num;
        }

        const baseRarity = self.rare;
        if (num >= 1.2) {
            rare += 2;
        }
        else if (num >= 1.05) {
            rare++;
        }
        else if (num <= 0.8) {
            rare -= 2;
        }
        else if (num <= 0.95) {
            rare--;
        }
        if (baseRarity >= 12) {
            rare = RarityLoader.GetRarity(baseRarity).GetPrefixedRarity(rare - baseRarity, num);
        }
        else if (rare > 11) {
            rare = 11;
        }
        if (rare > -11) {
            if (rare < -1) {
                rare = -1;
            }
            if (rare > RarityLoader.RarityCount - 1) {
                rare = RarityLoader.RarityCount - 1;
            }
        }

        num *= num;
        self.value *= num;
        self.prefix = rolledPrefix;
        return true;
    });

    Item.CanRollPrefix.hook((original, self, prefix) => {
		if (!self.CanHavePrefixes()) {
			return false;
		}

		return PrefixLoader.CanRoll(self, prefix);
	});

    Chat.ItemTagHandler.Parse.hook((original, self, text, baseColor, options) => {
        const item = Item.new()["void .ctor()"]();
        let result;

        if (TryParse(text, result)) {
            item.netDefaults(result);
        }

        if (item.type <= 0) {
            return TextSnippet.new()["void .ctor(string text)"](text);
        }

        item.stack = 1;
        if (options != null) {
            const array = options.Split(',');
            for (let i = 0; i < array.Length; i++) {
                if (array[i].Length == 0) {
                    continue;
                }

                switch (array[i][0]) {
                    case 's':
                    case 'x':
                        if (TryParse(array[i].Substring(1), result)) {
                            item.stack = Utils.Clamp(result, 1, item.maxStack);
                        }
                        break;
                    case 'p':
                        if (TryParse(array[i].Substring(1), result)) {
                            item.Prefix(Utils.Clamp(result, 0, PrefixLoader.PrefixCount));
                        }
                        break;
                }
            }
        }

        let text2 = "";
        if (item.stack > 1) {
            text2 = " (" + item.stack + ")";
        }

        const itemSnippet = Chat.ItemTagHandler.ItemSnippet.new()["void .ctor(Item item)"](item);
        itemSnippet.Text = "[" + item.AffixName() + text2 + "]";
        itemSnippet.CheckForHover = true;
        itemSnippet.DeleteWhole = true;

        return itemSnippet;
    });
}