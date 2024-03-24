import { EquipLoader } from "../Loaders/EquipLoader.js";
import { EquipType } from "../EquipType.js";
import { Terraria } from "../ModImports.js";

const ID = Terraria.ID;
const WingStatsInitializer = Terraria.Initializers.WingStatsInitializer;

export function Initialize() {
    WingStatsInitializer.Load.hook((original) => {
        original();

        ID.ArmorIDs.Wing.Sets.Stats = ID.ArmorIDs.Wing.Sets.Stats.cloneResized(EquipLoader.nextEquip[EquipType.Wings]);
    });
}