import { EquipLoader } from "../Loaders/EquipLoader.js";
import { EquipType } from "../EquipType.js";
import { Terraria } from "../ModImports.js";

const ID = Terraria.ID;
const WingStats = Terraria.DataStructures.WingStats;
const WingStatsInitializer = Terraria.Initializers.WingStatsInitializer;

export function Initialize() {
    const NewWingStats = (flyTime = 100, flySpeedOverride = -1, accelerationMultiplier = 1, hasHoldDownHoverFeatures = false, hoverFlySpeedOverride = -1, hoverAccelerationMultiplier = 1) => {
        return WingStats.new()
            ["void .ctor (int flyTime, float flySpeedOverride, float accelerationMultiplier, bool hasHoldDownHoverFeatures, float hoverFlySpeedOverride, float hoverAccelerationMultiplier)"]
            (flyTime, flySpeedOverride, accelerationMultiplier, hasHoldDownHoverFeatures, hoverFlySpeedOverride, hoverAccelerationMultiplier);
    }

    WingStatsInitializer.Load.hook((original) => {
        original();

        ID.ArmorIDs.Wing.Sets.Stats = ID.ArmorIDs.Wing.Sets.Stats.cloneResized(EquipLoader.nextEquip[EquipType.Wings]);
    });
}