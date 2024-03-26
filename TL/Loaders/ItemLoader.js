import { EquipLoader } from "./EquipLoader.js";
import { Terraria, System, Microsoft } from "../ModImports.js";

const Main = Terraria.Main;
const Item = Terraria.Item;
const Recipe = Terraria.Recipe;
const ID = Terraria.ID;
const ContentSamples = ID.ContentSamples;
const Lang = Terraria.Lang;
const LocalizedText = Terraria.Localization.LocalizedText;
const ItemTooltip = Terraria.UI.ItemTooltip;
const TextureAssets = Terraria.GameContent.TextureAssets;
const Vector2 = Microsoft.Xna.Framework.Vector2;

const Add = Vector2["Vector2 Add(Vector2 value1, Vector2 value2)"];

export class ItemLoader {
    static items = [];
    static get ItemCount() { return ItemID.Count; }

    static Register(item) {
        this.items.push(item);
        return this.ItemCount++;
    }

    static GetItem(type) {
        return type < ID.ItemID.Count || type >= this.ItemCount ? null : items[type - ID.ItemID.Count];
    }

    ResizeArrays() {
        TextureAssets.Item = TextureAssets.cloneResized(ItemLoader.ItemCount);
        TextureAssets.ItemFlame, TextureAssets.ItemFlame.cloneResized(ItemLoader.ItemCount);
        LoaderUtils.ResetStaticMembers(typeof(ItemID));
        LoaderUtils.ResetStaticMembers(typeof(AmmoID));
        LoaderUtils.ResetStaticMembers(typeof(PrefixLegacy.ItemSets));
        Item.cachedItemSpawnsByType = Item.cachedItemSpawnsByType.cloneResized(ItemLoader.ItemCount);
        Item.staff = Item.staff.cloneResized(ItemLoader.ItemCount);
        Item.claw = Item.claw.cloneResized(ItemLoader.ItemCount);
        Lang._itemNameCache = Lang._itemNameCache.cloneResized(ItemLoader.ItemCount);
        Lang._itemTooltipCache = Lang._itemTooltipCache.cloneResized(ItemLoader.ItemCount);

        for (let i = ID.ItemID.Count; i < ItemLoader.ItemCount; i++) {
            Lang._itemNameCache[i] = LocalizedText.Empty;
            Lang._itemTooltipCache[i] = ItemTooltip.None;
            Item.cachedItemSpawnsByType[i] = -1;
        }

        Main.itemAnimations = Main.itemAnimations.cloneResized(ItemLoader.ItemCount);
        Main.InitializeItemAnimations();

        Main.anglerQuestItemNetIDs = Main.anglerQuestItemNetIDs.Concat(
            ItemLoader.items.filter(modItem => modItem.IsQuestFish())
                 .map(modItem => modItem.Type)
        );
    }

    static FinishSetup() {
        for (const item of this.items) {
            Lang._itemNameCache[item.Type] = item.DisplayName;
            Lang._itemTooltipCache[item.Type] = ItemTooltip.FromLocalization(item.Tooltip);
            ContentSamples.ItemsByType[item.Type].RebuildTooltip();
        }

        this.ValidateDropsSet();
    }

    static ValidateDropsSet() {
        const GeodeDropsCount = ID.ItemID.Sets.GeodeDrops.Count;
        for (let i = 0; i < GeodeDropsCount; i++) {
            const exception = Lang.GetItemNameValue(i) + " registered in 'ItemID.Sets.GeodeDrops'";
            const value1 = ID.ItemID.Sets.GeodeDrops[i].Item1;
            const value2 = ID.ItemID.Sets.GeodeDrops[i].Item2;

            if (value1 < 1) {
                throw new Error(exception + " must have minStack bigger than 0");
            }
            if (value2 <= value1) {
                throw new Exception(exception + " must have maxStack bigger than minStack");
            }
        }

        const OreDropsFromSlimeCount = ID.ItemID.Sets.OreDropsFromSlime.Count;
        for (let i = 0; i < OreDropsFromSlimeCount; i++) {
            const exception = Lang.GetItemNameValue(i) + " registered in 'ItemID.Sets.OreDropsFromSlime'";
            const value1 = ID.ItemID.Sets.OreDropsFromSlime[i].Item1;
            const value2 = ID.ItemID.Sets.OreDropsFromSlime[i].Item2;

            if (value1 < 1) {
                throw new Error(exception + " must have minStack bigger than 0");
            }
            if (value2 < value1) {
                throw new Error(exception + " must have maxStack bigger than or equal to minStack");
            }
        }
    }

    static IsModItem(index) {
        return index >= ID.ItemID.Count;
    }
 
    static MeleePrefix(item) {
        return this.IsModItem(item.type) ? this.GetItem(item.type)?.MeleePrefix() : false;
    }
 
    static WeaponPrefix(item) {
        return this.IsModItem(item.type) ? this.GetItem(item.type)?.WeaponPrefix() : false;
    }

    static RangedPrefix(item) {
        return this.IsModItem(item.type) ? this.GetItem(item.type)?.RangedPrefix() : false;
    }

    static MagicPrefix(item) {
        return this.IsModItem(item.type) ? this.GetItem(item.type)?.MagicPrefix() : false;
    }

    static SetDefaults() {
        for (const item of this.items) {
            item.SetDefaults();
            item.AutoDefaults();
        }
    }

    static OnSpawn(item, entitySource) {
        this.IsModItem(item.type)?.OnSpawn(entitySource);
    }

    static OnCreation(item, itemCreationContext) {
        this.IsModItem(item.type)?.OnCreation(itemCreationContext);
    }

    static ChoosePrefix(item, rand) {
        if (this.IsModItem(item.type)) {
            const pre = this.GetItem(item.type)?.ChoosePrefix(rand);
            if (pre > 0) {
                return pre;
            }
        }

        return -1;
    }

    static PrefixChance(item, pre, rand) {
        if (this.IsModItem(item.type)) {
            const r = this.GetItem(item.type)?.PrefixChance(pre, rand);
            return r != null && r != undefined;
        }

        return null;
    }

    static AllowPrefix(item, pre) {
        let result = true;
        if (this.IsModItem(item.type)) {
            result &= this.GetItem(item.type)?.AllowPrefix(pre);
        }

        return result;
    }

    static CanUseItem(item, player) {
        if (this.IsModItem(item.type) && !this.GetItem(item.type)?.CanUseItem(player)) {
            return false;
        }

        return true;
    }

    static CanAutoReuseItem(item, player) {
        if (this.IsModItem(item.type)) {
            const allow = this.GetItem(item.type)?.CanAutoReuseItem(player);
            return allow != null && allow != undefined;
        }

        return null;
    }

    static UseStyle(item, player, heldItemFrame) {
        if (!item.IsAir) {
            this.GetItem(item.type)?.UseStyle(player, heldItemFrame);
        }
    }

    static HoldStyle(item, player, heldItemFrame) {
        if (!item.IsAir && !player.pulley && !(player.itemAnimation > 0)) {
            this.GetItem(item.type)?.HoldStyle(player, heldItemFrame);
        }
    }
 
    static HoldItem(item, player) {
        if (!item.IsAir) {
            this.GetItem(item.type)?.HoldItem(player);
        }
    }
 
    static UseTimeMultiplier(item, player) {
        if (item.IsAir) {
            return 1;
        }

        const multiplier = this.GetItem(item.type)?.UseTimeMultiplier(player) ?? 1;
        return multiplier;
    }
 
    static UseAnimationMultiplier(item, player) {
        if (item.IsAir) {
            return 1;
        }

        const multiplier = this.GetItem(item.type)?.UseAnimationMultiplier(player) ?? 1;
        return multiplier;
    }
 
    static UseSpeedMultiplier(item, player) {
        if (item.IsAir) {
            return 1;
        }

        const multiplier = this.GetItem(item.type)?.UseSpeedMultiplier(player) ?? 1;
        return multiplier;
    }
 
    static GetHealLife(item, player, quickHeal, healValue) {
        if (!item.IsAir) {
            this.GetItem(item.type)?.GetHealLife(player, quickHeal, healValue);
        }
    }
 
    static GetHealMana(item, player, quickHeal, healValue) {
        if (!item.IsAir) {
            this.GetItem(item.type)?.GetHealMana(player, quickHeal, healValue);
        }
    }
 
    static ModifyManaCost(item, player, reduce, mult) {
        if (!item.IsAir) {
            this.GetItem(item.type)?.ModifyManaCost(player, reduce, mult);
        }
    }
 
    static OnMissingMana(item, player, neededMana) {
        if (!item.IsAir) {
            this.GetItem(item.type)?.OnMissingMana(player, neededMana);
        }
    }
 
    static OnConsumeMana(item, player, manaConsumed) {
        if (!item.IsAir) {
            this.GetItem(item.type)?.OnConsumeMana(player, manaConsumed);
        }
    }
 
    static CanConsumeBait(player, bait) {
        return this.GetItem(bait.type)?.CanConsumeBait(player);
    }
 
    static ModifyResearchSorting(item, itemGroup) {
        if (!item.IsAir) {
            this.GetItem(item.type)?.ModifyResearchSorting(itemGroup);
        }
    }
 
    static CanResearch(item) {
        if (this.IsModItem(item.type) && !this.GetItem(item.type)?.CanResearch()) {
            return false;
        }

        return true;
    }
 
    static OnResearched(item, fullyResearched) {
        if (!item.IsAir) {
            this.GetItem(item.type)?.OnResearched(fullyResearched);
        }
    }
 
    static ModifyWeaponDamage(item, player, damage) {
        if (!item.IsAir) {
            this.GetItem(item.type)?.ModifyWeaponDamage(player, damage);
        }
    }
 
    static ModifyWeaponKnockback(item, player, knockback) {
        if (!item.IsAir) {
            this.GetItem(item.type)?.ModifyWeaponKnockback(player, knockback);
        }
    }
 
    static ModifyWeaponCrit(item, player, crit) {
        if (!item.IsAir) {
            this.GetItem(item.type)?.ModifyWeaponCrit(player, crit);
        }
    }
 
    static NeedsAmmo(weapon, player) {
        const modItem = this.GetItem(weapon.type);
        if (modItem != null && !modItem.NeedsAmmo(player)) {
            return false;
        }

        return true;
    }
 
    static PickAmmo(weapon, ammo, player, type, speed, damage, knockback) {
        this.GetItem(ammo.type)?.PickAmmo(weapon, player, type, speed, damage, knockback);
    }
 
    static CanChooseAmmo(weapon, ammo, player) {
        if (this.IsModItem(weapon.type)) {
            const r = this.GetItem(weapon.type)?.CanChooseAmmo(ammo, player);
            if (!r) return r;
        }

        if (this.IsModItem(ammo.type)) {
            const r = this.GetItem(ammo.type)?.CanBeChosenAsAmmo(weapon, player);
            if (!r) return r;
        }

        return ammo.ammo == weapon.useAmmo;
    }
 
    static CanConsumeAmmo(weapon, ammo, player) {
        if ((this.IsModItem(weapon.type) && !this.GetItem(weapon.type).CanConsumeAmmo(ammo, player)) || (this.IsModItem(ammo.type) && !this.GetItem(ammo.type).CanBeConsumedAsAmmo(weapon, player))) {
            return false;
        }

        return true;
    }
 
    static OnConsumeAmmo(weapon, ammo, player) {
        if (!weapon.IsAir) {
            this.GetItem(weapon.type)?.OnConsumeAmmo(ammo, player);
            this.GetItem(ammo.type)?.OnConsumedAsAmmo(weapon, player);
        }
    }
 
    static CanShoot(item, player) {
        return this.GetItem(item.type)?.CanShoot(player) ?? true;
    }
 
    static ModifyShootStats(item, player, position, velocity, type, damage, knockback) {
        this.GetItem(item.type)?.ModifyShootStats(player, position, velocity, type, damage, knockback);
    }
 
    static Shoot(item, player, source, position, velocity, type, damage, knockback, defaultResult = true) {
        if (defaultResult) {
            return this.GetItem(item.type)?.Shoot(player, source, position, velocity, type, damage, knockback) ?? true;
        }

        return false;
    }
 
    static UseItemHitbox(item, player, hitbox, noHitbox) {
        this.GetItem(item.type)?.UseItemHitbox(player, hitbox, noHitbox);
    }
 
    static MeleeEffects(item, player, hitbox) {
        this.GetItem(item.type)?.MeleeEffects(player, hitbox);
    }
 
    static CanCatchNPC(item, target, player) {
        let canCatchOverall = null;
        if (this.IsModItem(item.type)) {
            const canCatchAsModItem = this.GetItem(item.type).CanCatchNPC(target, player);
            if (!canCatchAsModItem) {
                return false;
            }
        
            canCatchOverall = true;
        } // Windows has stopped this device because it has reported problems. (Code 43)

        return canCatchOverall;
    }
 
    static OnCatchNPC(item, npc, player, failed) {
        this.GetItem(item.type)?.OnCatchNPC(npc, player, failed);
    }
 
    static ModifyItemScale(item, player, scale) {
        this.GetItem(item.type)?.ModifyItemScale(player, scale);
    }
 
    static CanHitNPC(item, player, target) {
        if (this.IsModItem(item.type)) {
            return this.GetItem(item.type).CanHitNPC(player, target) || false;
        }

        return null;
    }
 
    static CanMeleeAttackCollideWithNPC(item, meleeAttackHitbox, player, target) {
        if (this.IsModItem(item.type)) {
            return this.GetItem(item.type).CanMeleeAttackCollideWithNPC(meleeAttackHitbox, player, target) || false;
        }

        return null;
    }
 
    static ModifyHitNPC(item, player, target, modifiers) {
        this.GetItem(item.type)?.ModifyHitNPC(player, target, modifiers);
    }
 
    static OnHitNPC(item, player, target, hit, damageDone) {
        this.GetItem(item.type)?.OnHitNPC(player, target, hit, damageDone);
    }
 
    static CanHitPvp(item, player, target) {
        if (this.IsModItem(item.type)) {
            return this.GetItem(item.type).CanHitPvp(player, target);
        }

        return true;
    }
 
    static ModifyHitPvp(item, player, target, modifiers) {
        this.GetItem(item.type)?.ModifyHitPvp(player, target, modifiers);
    }
 
    static OnHitPvp(item, player, target, hurtInfo) {
        this.GetItem(item.type)?.OnHitPvp(player, target, hurtInfo);
    }
 
    static UseItem(item, player) {
        if (item.IsAir) {
            return null;
        }

        return this.GetItem(item.type)?.UseItem(player);
    }
 
    static UseAnimation(item, player) {
        this.GetItem(item.type)?.UseAnimation(player);
    }
 
    static ConsumeItem(item, player) {
        if (item.IsAir) {
            return true;
        }

        if (this.IsModItem(item.type) && !this.GetItem(item.type)?.ConsumeItem(player)) {
            return false;
        }
    
        this.OnConsumeItem(item, player);
        return true;
    }
 
    static OnConsumeItem(item, player) {
        if (!item.IsAir) {
            this.GetItem(item.type)?.OnConsumeItem(player);
        }
    }
 
    static UseItemFrame(item, player) {
        if (!item.IsAir) {
            this.GetItem(item.type)?.UseItemFrame(player);
        }
    }
 
    static HoldItemFrame(item, player) {
        if (!item.IsAir) {
            this.GetItem(item.type)?.HoldItemFrame(player);
        }
    }
 
    static AltFunctionUse(item, player) {
        if (item.IsAir) {
            return false;
        }
    
        if (this.IsModItem(item.type) && this.GetItem(item.type).AltFunctionUse(player)) {
            return true;
        }

        return false;
    }
 
    static UpdateInventory(item, player) {
        if (!item.IsAir) {
            this.GetItem(item.type)?.UpdateInventory(player);
        }
    }
 
    static UpdateInfoAccessory(item, player) {
        if (!item.IsAir) {
            this.GetItem(item.type)?.UpdateInfoAccessory(player);
        }
    }
 
    static UpdateEquip(item, player) {
        if (!item.IsAir) {
            this.GetItem(item.type)?.UpdateEquip(player);
        }
    }
 
    static UpdateAccessory(item, player, hideVisual) {
        if (!item.IsAir) {
            this.GetItem(item.type)?.UpdateAccessory(player, hideVisual);
        }
    }
 
    static UpdateVanity(item, player) {
        if (!item.IsAir) {
            this.GetItem(item.type)?.UpdateVanity(player);
        }
    }
 
    static UpdateArmorSet(player, head, body, legs) {

        if (this.IsModItem(head.type) != null && this.GetItem(head.type).IsArmorSet(head, body, legs)) {
            head.ModItem.UpdateArmorSet(player);
        }

        if (this.IsModItem(body.type) != null && this.GetItem(body.type).IsArmorSet(head, body, legs)) {
            body.ModItem.UpdateArmorSet(player);
        }

        if (this.IsModItem(legs.type) != null && this.GetItem(legs.type).IsArmorSet(head, body, legs)) {
            legs.ModItem.UpdateArmorSet(player);
        }
    }
 
    static PreUpdateVanitySet(player) {
        const headTexture = EquipLoader.GetEquipTexture(EquipType.Head, player.head);
        const bodyTexture = EquipLoader.GetEquipTexture(EquipType.Body, player.body);
        const legTexture = EquipLoader.GetEquipTexture(EquipType.Legs, player.legs);

        if (headTexture != null && headTexture.IsVanitySet(player.head, player.body, player.legs)) {
            headTexture.PreUpdateVanitySet(player);
        }

        if (bodyTexture != null && bodyTexture.IsVanitySet(player.head, player.body, player.legs)) {
            bodyTexture.PreUpdateVanitySet(player);
        }

        if (legTexture != null && legTexture.IsVanitySet(player.head, player.body, player.legs)) {
            legTexture.PreUpdateVanitySet(player);
        }
    }
 
    static UpdateVanitySet(player) {
        const headTexture = EquipLoader.GetEquipTexture(EquipType.Head, player.head);
        const bodyTexture = EquipLoader.GetEquipTexture(EquipType.Body, player.body);
        const legTexture = EquipLoader.GetEquipTexture(EquipType.Legs, player.legs);

        if (headTexture != null && headTexture.IsVanitySet(player.head, player.body, player.legs)) {
            headTexture.UpdateVanitySet(player);
        }

        if (bodyTexture != null && bodyTexture.IsVanitySet(player.head, player.body, player.legs)) {
            bodyTexture.UpdateVanitySet(player);
        }

        if (legTexture != null && legTexture.IsVanitySet(player.head, player.body, player.legs)) {
            legTexture.UpdateVanitySet(player);
        }
        
    }
 
    static ArmorSetShadows(player) {
        const headTexture = EquipLoader.GetEquipTexture(EquipType.Head, player.head);
        const bodyTexture = EquipLoader.GetEquipTexture(EquipType.Body, player.body);
        const legTexture = EquipLoader.GetEquipTexture(EquipType.Legs, player.legs);

        if (headTexture != null && headTexture.IsVanitySet(player.head, player.body, player.legs)) {
            headTexture.ArmorSetShadows(player);
        }

        if (bodyTexture != null && bodyTexture.IsVanitySet(player.head, player.body, player.legs)) {
            bodyTexture.ArmorSetShadows(player);
        }

        if (legTexture != null && legTexture.IsVanitySet(player.head, player.body, player.legs)) {
            legTexture.ArmorSetShadows(player);
        }
    }
 
    static SetMatch(armorSlot, type, male, equipSlot, robes) {
        EquipLoader.GetEquipTexture(armorSlot, type)?.SetMatch(male, equipSlot, robes);
    }
 
    static CanRightClick(item) {
        if (item.IsAir) {
            return false;
        }

        if (ItemID.Sets.OpenableBag[item.type]) {
            return true;
        }

        if (this.IsModItem(item.type) && this.GetItem(item.type).CanRightClick()) {
            return true;
        }

        return false;
    }
 
    static RightClick(item, player) {
        this.GetItem(item.type)?.RightClick(player);
        if (ConsumeItem(item, player) && --item.stack == 0) {
            item.SetDefaults();
        }

        SoundEngine.PlaySound(7);
        Main.stackSplit = 30;
        Main.mouseRightRelease = false;
        Recipe.FindRecipes();
    }
 
    static ModifyItemLoot(item, itemLoot) {
        this.GetItem(item.type)?.ModifyItemLoot(itemLoot);
    }
 
    static CanStack(destination, source) {
        if (destination.prefix != source.prefix) {
            return false;
        }

        return this.GetItem(destination.type)?.CanStack(source) ?? true;
    }
 
    static CanStackInWorld(destination, source) {
        return this.GetItem(destination.type)?.CanStackInWorld(source) ?? true;
    }
 
    static TryStackItems(destination, source, infiniteSource = false) {
        if (!CanStack(destination, source)) {
            return { result: false, numTransferred: 0 };
        }

        const numTransferred = StackItems(destination, source, infiniteSource);
        return { result: true, numTransferred: numTransferred };
    }
 
    static StackItems(destination, source, infiniteSource = false, numToTransfer = null) {
        const numTransferred = numToTransfer ?? System.Math.Min(source.stack, destination.maxStack - destination.stack);
        this.OnStack(destination, source, numTransferred);
        const isSplittingToHand = numTransferred < source.stack && destination == Main.mouseItem;

        if (source.favorited && !isSplittingToHand) {
            destination.favorited = true;
            source.favorited = false;
        }

        destination.stack += numTransferred;

        if (!infiniteSource) {
            source.stack -= numTransferred;
        }

        return numTransferred;
    }
 
    static OnStack(destination, source, numToTransfer) {
        this.GetItem(destination.type)?.OnStack(source, numToTransfer);
    }
 
    static TransferWithLimit(source, limit) {
        destination = source.Clone();
        if (source.stack <= limit) {
            source.TurnToAir();
        } else {
            this.SplitStack(destination, source, limit);
        }

        return destination;
    }
 
    static SplitStack(destination, source, numToTransfer) {
        destination.stack = 0;
        destination.favorited = false;
        this.GetItem(destination.type)?.SplitStack(source, numToTransfer);
        destination.stack += numToTransfer;
        source.stack -= numToTransfer;
    }
 
    static ReforgePrice(item, reforgePrice, canApplyDiscount) {
        return this.GetItem(item.type)?.ReforgePrice(reforgePrice, canApplyDiscount) ?? true;
    }
 
    static CanReforge(item) {
        return this.GetItem(item.type)?.CanReforge() ?? true;
    }
 
    static PreReforge(item) {
        this.GetItem(item.type)?.PreReforge();
    }

    static PostReforge(item) {
        this.GetItem(item.type)?.PostReforge();
    }
 
    static DrawArmorColor(type, slot, drawPlayer, shadow, color, glowMask, glowMaskColor) {
        EquipLoader.GetEquipTexture(type, slot)?.DrawArmorColor(drawPlayer, shadow, color, glowMask, glowMaskColor);
    }
 
    static ArmorArmGlowMask(slot, drawPlayer, shadow, glowMask, color) {
        EquipLoader.GetEquipTexture(EquipType.Body, slot)?.ArmorArmGlowMask(drawPlayer, shadow, glowMask, color);
    }
 
    static VerticalWingSpeeds(player, ascentWhenFalling, ascentWhenRising, maxCanAscendMultiplier, maxAscentMultiplier, constantAscend) {
        const item = player.equippedWings;
        if (item == null) {
            EquipLoader.GetEquipTexture(EquipType.Wings, player.wingsLogic)?.VerticalWingSpeeds(player, ascentWhenFalling, ascentWhenRising, maxCanAscendMultiplier, maxAscentMultiplier, constantAscend);
            return;
        }

        this.GetItem(item.type)?.VerticalWingSpeeds(player, ascentWhenFalling, ascentWhenRising, maxCanAscendMultiplier, maxAscentMultiplier, constantAscend);
    }
 
    static HorizontalWingSpeeds(player) {
        const item = player.equippedWings;
        if (item == null) {
            EquipLoader.GetEquipTexture(EquipType.Wings, player.wingsLogic)?.HorizontalWingSpeeds(player, player.accRunSpeed, player.runAcceleration);
            return;
        }

        this.GetItem(item.type)?.HorizontalWingSpeeds(player, player.accRunSpeed, player.runAcceleration);
    }

 
    static WingUpdate(player, inUse) {
        if (player.wings <= 0) {
            return false;
        }

        const retVal = EquipLoader.GetEquipTexture(EquipType.Wings, player.wings)?.WingUpdate(player, inUse);
        return retVal.GetValueOrDefault();
    }
 
    static Update(item, gravity, maxFallSpeed) {
        this.GetItem(item.type)?.Update(gravity, maxFallSpeed);
    }

 
    static PostUpdate(item) {
        this.GetItem(item.type)?.PostUpdate();
    }

    static GrabRange(item, player, grabRange) {
        this.GetItem(item.type)?.GrabRange(player, grabRange);
    }

    static GrabStyle(item, player) {
        if (this.IsModItem(item.type)) {
            return this.GetItem(item.type).GrabStyle(player);
        }

        return false;
    }
 
    static CanPickup(item, player) {
        return this.GetItem(item.type)?.CanPickup(player) ?? true;
    }
 
    static OnPickup(item, player) {
        return this.GetItem(item.type)?.OnPickup(player) ?? true;
    }
 
    static ItemSpace(item, player) {
        return this.GetItem(item.type)?.ItemSpace(player) ?? false;
    }
 
    static GetAlpha(item, lightColor) {
        if (item.IsAir) {
            return null;
        }

        return this.GetItem(item.type)?.GetAlpha(lightColor);
    }
 
    static PreDrawInWorld(item, spriteBatch, lightColor, alphaColor, rotation, scale, whoAmI) {
        let flag = true;
        if (this.IsModItem(item.type)) {
            flag &= this.GetItem(item.type).PreDrawInWorld(spriteBatch, lightColor, alphaColor, rotation, scale, whoAmI);
        }

        return flag;
    }
 
    static PostDrawInWorld(item, spriteBatch, lightColor, alphaColor, rotation, scale, whoAmI) {
        this.GetItem(item.type)?.PostDrawInWorld(spriteBatch, lightColor, alphaColor, rotation, scale, whoAmI);
    }
 
    static PreDrawInInventory(item, spriteBatch, position, frame, drawColor, itemColor, origin, scale) {
        let flag = true;
        if (this.IsModItem(item.type)) {
            flag &= this.GetItem(item.type).PreDrawInInventory(spriteBatch, position, frame, drawColor, itemColor, origin, scale);
        }

        return flag;
    }
 
    static PostDrawInInventory(item, spriteBatch, position, frame, drawColor, itemColor, origin, scale) {
        this.GetItem(item.type)?.PostDrawInInventory(spriteBatch, position, frame, drawColor, itemColor, origin, scale);
    }
 
    static HoldoutOffset(gravDir, type) {
        const result = Vector2.new();

        const modItem = this.GetItem(type);
        if (modItem != null) {
            const modOffset = modItem.HoldoutOffset();
            if (modOffset) {
                result.X = modOffset.X;
                result.Y += gravDir * modOffset.Y;
            }
        }

        return result;
    }
 
    static HoldoutOrigin(player, origin) {
        const modOrigin = Vector2.Zero;
        if (this.IsModItem(item.type)) {
            const resultOrigin = this.GetItem(item.type).HoldoutOrigin();
            if (resultOrigin) {
                modOrigin = resultOrigin;
            }
        }
        
        modOrigin.X *= player.direction;
        modOrigin.Y *= 0 - player.gravDir;
        origin = Add(origin, modOrigin);
    }
 
    static CanEquipAccessory(item, slot, modded) {
        const player = Main.player[Main.myPlayer];
        if (this.IsModItem(item.type) && !this.GetItem(item.type)?.CanEquipAccessory(player, slot, modded)) {
            return false;
        }

        return true;
    }
 
    static CanAccessoryBeEquippedWith(equippedItem, incomingItem, player) {
        equippedItem = this.GetItem(equippedItem.type);
        if (equippedItem != null && !equippedItem.CanAccessoryBeEquippedWith(equippedItem, incomingItem, player)) {
            return false;
        }

        incomingItem = this.GetItem(incomingItem.type);
        if (incomingItem != null && !incomingItem.CanAccessoryBeEquippedWith(equippedItem, incomingItem, player)) {
            return false;
        }
        
        return true;
    }
 
    static ExtractinatorUse(resultType, resultStack, extractType, extractinatorBlockType) {
        this.GetItem(extractType)?.ExtractinatorUse(extractinatorBlockType, resultType, resultStack);
    }
 
    static CaughtFishStack(item) {
        this.GetItem(item.type)?.CaughtFishStack(item.stack);
    }

 
    static IsAnglerQuestAvailable(itemID, notAvailable) {
        const modItem = this.GetItem(itemID);
        if (modItem != null) {
            notAvailable |= !modItem.IsAnglerQuestAvailable();
        }
    }
 
    static AnglerChat(type) {
        const chat = "";
        const catchLocation = "";
        this.GetItem(type)?.AnglerQuestChat(chat, catchLocation);

        return chat + "\n\n(" + catchLocation + ")";
    }
 
    static PreDrawTooltip(item, lines, x, y) {
        return this.GetItem(item.type)?.PreDrawTooltip(lines, x, y) ?? true;
    }
 
    static PostDrawTooltip(item, lines) {
        this.GetItem(item.type)?.PostDrawTooltip(lines);
    }

 
    static PreDrawTooltipLine(item, line, yOffset) {
        return this.GetItem(item.type)?.PreDrawTooltipLine(line, yOffset) ?? true;
    }
 
    static PostDrawTooltipLine(item, line) {
        this.GetItem(item.type)?.PostDrawTooltipLine(line);
    }

 
    static ModifyTooltips(item, numTooltips, names, text, modifier, badModifier, oneDropLogo, prefixlineIndex) {
        const tooltips = [];
        for (let i = 0; i < numTooltips; i++) {
            const tooltip = new TooltipLine(names[i], text[i]);
            tooltip.IsModifier = modifier[i];
            tooltip.IsModifierBad = badModifier[i];
    
            if (i == oneDropLogo) {
                tooltip.OneDropLogo = true;
            }

            tooltips.push(tooltip);
        }

        if (item.prefix >= ID.PrefixID.Count && prefixlineIndex != -1) {
            const tooltipLines = PrefixLoader.GetPrefix(item.prefix)?.GetTooltipLines(item);
            if (tooltipLines != null) {
                for (const line of tooltipLines) {
                    tooltips.splice(prefixlineIndex, 0, line);
                    prefixlineIndex++;
                }
            }
        }

        this.GetItem(item.type)?.ModifyTooltips(tooltips);

        tooltips.RemoveAll((x) => !x.Visible);
        numTooltips = tooltips.length;
        text = [];
        modifier = [];
        badModifier = [];
        oneDropLogo = -1;

        let overrideColor = [];
    
        for (let i = 0; i < numTooltips; i++) {
            text[i] = tooltips[i].Text;
            modifier[i] = tooltips[i].IsModifier;
            badModifier[i] = tooltips[i].IsModifierBad;
            if (tooltips[i].OneDropLogo) {
                oneDropLogo = i;
            }
            overrideColor[i] = tooltips[i].OverrideColor;
        }

        return { tooltips: tooltips, overrideColor: overrideColor };
    }
 
    static NeedsModSaving(item) {
        if (item.type <= 0) {
            return false;
        }

        if (this.IsModItem(item.type) || item.prefix >= ID.PrefixID.Count) {
            return true;
        }

        return false;
    }
}