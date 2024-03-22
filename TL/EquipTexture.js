export class EquipTexture {
    Texture;
    Name;
    Type;
    Slot;
    Item;
 
    FrameEffects(player, type) {
        if (this.Item != null) {
            this.Item.EquipFrameEffects(player, type);
        }
    }
 
    IsVanitySet(head, body, legs) {
        if (this.Item == null) {
            return false;
        }

        return this.Item.IsVanitySet(head, body, legs);
    }
 
    PreUpdateVanitySet(player) {
        if (this.Item != null) {
            this.Item.PreUpdateVanitySet(player);
        }
    }
 
    UpdateVanitySet(player) {
        if (this.Item != null) {
            this.Item.UpdateVanitySet(player);
        }
    }
 
    ArmorSetShadows(player) {
        if (this.Item != null) {
            this.Item.ArmorSetShadows(player);
        }
    }
 
    SetMatch(male, equipSlot, robes) {
        if (this.Item != null) {
            this.Item.SetMatch(male, equipSlot, robes);
        }
    }
 
    DrawArmorColor(drawPlayer, shadow, color, glowMask, glowMaskColor) {
        if (this.Item != null) {
            this.Item.DrawArmorColor(drawPlayer, shadow, color, glowMask, glowMaskColor);
        }
    }
 
    ArmorArmGlowMask(drawPlayer, shadow, glowMask, color) {
        if (this.Item != null) {
            this.Item.ArmorArmGlowMask(drawPlayer, shadow, glowMask, color);
        }
    }
 
    VerticalWingSpeeds(player, ascentWhenFalling, ascentWhenRising, maxCanAscendMultiplier, maxAscentMultiplier, constantAscend) {
        if (this.Item != null) {
            this.Item.VerticalWingSpeeds(player, ascentWhenFalling, ascentWhenRising, maxCanAscendMultiplier, maxAscentMultiplier, constantAscend);
        }
    }
 
    HorizontalWingSpeeds( player, speed, acceleration) {
        if (this.Item != null) {
            this.Item.HorizontalWingSpeeds(player, speed, acceleration);
        }
    }
 
    WingUpdate(player, inUse) {
        return this.Item?.WingUpdate(player, inUse) ?? false;
    }
}
