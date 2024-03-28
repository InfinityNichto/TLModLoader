import { Mod } from "./Mod.js";
import { ModContent } from "./ModContent.js"; 
import { ModTypeLookup } from "./ModTypeLookup.js";
import { ItemLoader } from "./Loaders/ItemLoader.js";
import { DamageClass } from "./DamageClass.js";
import { DamageClassLoader } from "./Loaders/DamageClassLoader.js";
import { PrefixCategory } from "./PrefixCategory.js";
import { Terraria, Microsoft, ReLogic } from "./ModImports.js";

const Item = Terraria.Item;
const Recipe = Terraria.Recipe;
const PrefixLegacy = Terraria.GameContent.PrefixLegacy;
const ID = Terraria.ID;
const ContentSamples = ID.ContentSamples;
const TextureAssets = Terraria.GameContent.TextureAssets;
const Texture2D = Microsoft.Xna.Framework.Graphics.Texture2D;
const AssetRequestMode = ReLogic.Content.AssetRequestMode;

export class ModItem extends ModEntityType {
    Item = this.Entity;
    Type = this.Item.type;
    ModItemTemplate = undefined;
    LocalizationCategory = "Items";
    get DisplayName() { return Mod.GetLocalization("DisplayName", this.NameWithSpaces) }
    get Tooltip() { return Mod.GetLocalization("Tooltip", () => "") }
    Texture = `Textures/${this.Name}`;

	currentUseAnimationCompensation = [0];
	useTurnOnAnimationStart = [false];

    CreateTemplateInstance() {
        this.ModItemTemplate = this.constructor;
        return NativeClass("Terraria", "Item").new()["void .ctor()"]();
    }

    Register() {
		ModTypeLookup.Register(this.constructor);
		Item.ResetStats(ItemLoader.Register(this.constructor));
        this.ModItemTemplate = this.constructor;
		OnCreated(new InitializationItemCreationContext());
	}

    SetupContent() {
		ItemLoader.SetDefaults(this.Item, false);
		AutoStaticDefaults();
		SetStaticDefaults();
		ID.ItemID.Search.Add(this.FullName, this.Type);
	}

    _damageClass = DamageClass.Default;
    get DamageType() { return this._damageClass }
    set DamageType(value) { this._damageClass = value ?? new Error("Item DamageType cannot be null.") }

    CountsAsClass(damageClass) {
        return DamageClassLoader.effectInheritanceCache[this.DamageType.Type, this.damageClass.Type];
    }

	static GetVanillaPrefixes(category) {
		switch (category) {
			case PrefixCategory.Melee:
				return PrefixLegacy.Prefixes.PrefixesForSwords;
			case PrefixCategory.Ranged:
				return PrefixLegacy.Prefixes.PrefixesForGunsBows;
			case PrefixCategory.Magic:
				return PrefixLegacy.Prefixes.PrefixesForMagicAndSummons;
			case PrefixCategory.AnyWeapon:
				return PrefixLegacy.Prefixes.PrefixesForSpears;
			case PrefixCategory.Accessory:
				return PrefixLegacy.Prefixes.PrefixesForAccessories;
		}
	}

	GetPrefixCategories() {
        if (PrefixLegacy.ItemSets.SwordsHammersAxesPicks[this.Type] || ItemLoader.MeleePrefix(this.constructor)) {
            return PrefixCategory.Melee;
        }

        if (PrefixLegacy.ItemSets.GunsBows[this.Type] || ItemLoader.RangedPrefix(this.constructor)) {
            return PrefixCategory.Ranged;
        }

        if (PrefixLegacy.ItemSets.MagicAndSummon[this.Type] || ItemLoader.MagicPrefix(this.constructor)) {
            return PrefixCategory.Magic;
        }

        if (PrefixLegacy.ItemSets.SpearsMacesChainsawsDrillsPunchCannon[this.Type] || PrefixLegacy.ItemSets.BoomerangsChakrams[this.Type] || PrefixLegacy.ItemSets.ItemsThatCanHaveLegendary2[this.Type] || ItemLoader.WeaponPrefix(this.constructor)) {
            return PrefixCategory.AnyWeapon;
        }

        if (this.IsAPrefixableAccessory()) {
            return PrefixCategory.Accessory;
        }
		
        return null;
	}

	static UndoItemAnimationCompensations(item) {
        item.useAnimation -= this.currentUseAnimationCompensation.getOrDefault(item.type);
        this.currentUseAnimationCompensation[item.type] = 0;
    }

	static ApplyItemAnimationCompensationsToVanillaItems(item) {
		this.currentUseAnimationCompensation[item.type] = 0;
		if (item.type < ID.ItemID.Count && item.autoReuse && !item.noMelee) {
			item.useAnimation--;
			this.currentUseAnimationCompensation[item.type]--;
		}

		if (item.type < ID.ItemID.Count && item.useStyle != 0 && !item.autoReuse && !item.useTurn && item.shoot == 0 && item.damage > 0) {
			this.useTurnOnAnimationStart[item.type] = true;
		}
	}

    SetDefaults() { }

    OnSpawn(entitySource) { }

    OnCreated(itemCreationContext) { }

    AutoDefaults() {
        EquipLoader.SetSlot(this.Item);
    }

    AutoStaticDefaults() {
		TextureAssets.Item[this.Item.type] = ModContent.Request(Texture2D, this.Texture);
    
        const { exists: flag, asset: flameTexture } = ModContent.RequestIfExists(Texture2D, this.Texture + "_Flame", AssetRequestMode.AsyncLoad);
		if (flag) {
			TextureAssets.ItemFlame[this.Item.type] = flameTexture;
		}

		this.Item.ResearchUnlockCount = 1;
	}

    ChoosePrefix(rand) {
		return -1;
	}

    MeleePrefix() {
		return this.Item.melee ? !this.Item.noUseGraphic : false;
	}

    WeaponPrefix() {
		return this.Item.melee ? this.Item.noUseGraphic : false;
	}

    RangedPrefix() {
		return !this.Item.ranged ? this.Item.CountsAsClass(DamageClass.Throwing) : true;
	}

    MagicPrefix() {
		return !this.Item.magic ? this.Item.summon : true;
	}

    PrefixChance(pre, rand) {
		return null;
	}

    AllowPrefix(pre) {
        return true;
    }

    CanUseItem(player) {
		return true;
	}

    CanAutoReuseItem(player) {
		return null;
	}

    UseStyle(player, heldItemFrame) { }

    HoldStyle(player, heldItemFrame) { }

    UseTimeMultiplier(player) {
		return 1;
	}

    UseAnimationMultiplier(player) {
		return 1;
	}

    UseSpeedMultiplier(player) {
		return 1;
	}

	GetHealLife(player, quickHeal, healValue) { }

	GetHealMana(player, quickHeal, healValue) { }
	
	ModifyManaCost(player, reduce, mult) { }
	
	OnMissingMana(player, neededMana) { }

    OnConsumeMana(player, manaConsumed) { }
	
	ModifyWeaponDamage(player, damage) { }

	ModifyResearchSorting(itemGroup) { }

	CanConsumeBait(player) {
		return null;
	}

	CanResearch() {
		return true;
	}

	OnResearched(fullyResearched) { }

	ModifyWeaponKnockback(player, knockback) { }

	ModifyWeaponCrit(player, crit) { }

    NeedsAmmo(player) {
		return true;
	}

	
	PickAmmo(weapon, player, type, speed, damage, knockback) { }

    CanChooseAmmo(ammo, player) {
		return null;
	}
    
    CanBeChosenAsAmmo(weapon, player) {
		return null;
	}

    CanConsumeAmmo(ammo, player) {
		return true;
	}

    CanBeConsumedAsAmmo(weapon, player) {
		return true;
	}

	OnConsumeAmmo(ammo, player) { }

	OnConsumedAsAmmo(weapon, player) { }

    CanShoot(player) {
		return true;
	}

	ModifyShootStats(player, position, velocity, type, damage, knockback) { }

	Shoot(player, source, position, velocity, type, damage, knockback) {
		return true;
	}

	UseItemHitbox(player,  hitbox, noHitbox) { }

    MeleeEffects(player,  hitbox) { }

    CanCatchNPC(target, player) {
		return null;
	}

	OnCatchNPC(npc, player, failed) { }

	ModifyItemScale(player, scale) { }

	CanHitNPC(player, target) {
		return null;
	}

	CanMeleeAttackCollideWithNPC( meleeAttackHitbox, player, target) {
		return null;
	}
	
	ModifyHitNPC(player, target, modifiers) { }

    OnHitNPC(player, target, hit, damageDone) { }

    CanHitPvp(player, target) {
		return true;
	}

	ModifyHitPvp(player, target, modifiers) { }

	OnHitPvp(player, target, hurtInfo) { }

	UseItem(player) {
		return null;
	}

    UseAnimation(player) { }

	ConsumeItem(player) {
		return true;
	}

    OnConsumeItem(player) { }

	UseItemFrame(player) { }

	HoldItemFrame(player) { }

    AltFunctionUse(player) {
		return false;
	}

    UpdateInventory(player) { }
    
    UpdateInfoAccessory(player) { }
	
    UpdateEquip(player) { }
    
    UpdateAccessory(player, hideVisual) { }
	
    UpdateVanity(player) { }
    
    EquipFrameEffects(player, type) { }

	IsArmorSet(head, body, legs) {
		return false;
	}

	UpdateArmorSet(player) { }

	IsVanitySet(head, body, legs) {
		let headItemType = 0;
		if (head >= 0) {
			headItemType = this.Item.headType[head];
		}
        const headItem = ContentSamples.ItemsByType[headItemType];
		
        let bodyItemType = 0;
		if (body >= 0) {
			bodyItemType = this.Item.bodyType[body];
		}
		const bodyItem = ContentSamples.ItemsByType[bodyItemType];

		let legsItemType = 0;
		if (legs >= 0) {
			legsItemType = this.Item.legType[legs];
		}
		const legItem = ContentSamples.ItemsByType[legsItemType];

		return this.IsArmorSet(headItem, bodyItem, legItem);
	}

	PreUpdateVanitySet(player) { }
	
    UpdateVanitySet(player) { }
    
    ArmorSetShadows(player) { }
    
    SetMatch(male, equipSlot, robes) { }

	CanRightClick() {
		return false;
	}

	RightClick(player) { }

	ModifyItemLoot(itemLoot) { }
    
    CanStack(source) {
		return true;
	}

	CanStackInWorld(source) {
		return true;
	}

	OnStack(source, numToTransfer) { }

	SplitStack(source, numToTransfer) { }

    ReforgePrice(reforgePrice, canApplyDiscount) {
		return true;
	}

    CanReforge() {
		return true;
	}

	PreReforge() { }

	PostReforge() { }

    DrawArmorColor(drawPlayer, shadow, color, glowMask, glowMaskColor) { }
	
	ArmorArmGlowMask(drawPlayer, shadow, glowMask, color) { }

	VerticalWingSpeeds(player, ascentWhenFalling, ascentWhenRising, maxCanAscendMultiplier, maxAscentMultiplier, constantAscend) { }

	HorizontalWingSpeeds(player, speed, acceleration) { }

	WingUpdate(player, inUse) {
		return false;
	}

    Update(gravity, maxFallSpeed) { }

	PostUpdate() { }

    GrabRange(player, grabRange) { }

    GrabStyle(player) {
		return false;
	}

	CanPickup(player) {
		return true;
	}

    OnPickup(player) {
		return true;
	}

    ItemSpace(player) {
		return false;
	}

    GetAlpha(lightColor) {
		return null;
	}

	PreDrawInWorld( spriteBatch, lightColor, alphaColor, rotation, scale, whoAmI) {
		return true;
	}

	PostDrawInWorld( spriteBatch, lightColor, alphaColor, rotation, scale, whoAmI) { }
    
    PreDrawInInventory( spriteBatch, position,  frame, drawColor, itemColor, origin, scale) {
		return true;
	}
	PostDrawInInventory( spriteBatch, position,  frame, drawColor, itemColor, origin, scale) { }
	
    HoldoutOffset() {
		return null;
	}

	HoldoutOrigin() {
		return null;
	}

	CanEquipAccessory(player, slot, modded) {
		return true;
	}

	CanAccessoryBeEquippedWith(equippedItem, incomingItem, player) {
		return true;
	}

	ExtractinatorUse(extractinatorBlockType, resultType, resultStack) { }
	
    CaughtFishStack(stack) { }

	IsQuestFish() {
		return false;
	}

	IsAnglerQuestAvailable() {
		return true;
	}

    AnglerQuestChat(description, catchLocation) { }
	
	AddRecipes() { }

	/* [Obsolete("Use OnCreate and check if context is RecipeCreationContext", true)] */
	OnCraft(recipe) { }
	
	PreDrawTooltip(lines, x, y) {
		return true;
	}
    
    PostDrawTooltip(lines) { }

	PreDrawTooltipLine(line, yOffset) {
		return true;
	}

	PostDrawTooltipLine(line) { }
	
    ModifyTooltips(tooltips) { }

    CreateRecipe(amount = 1) {
		return Recipe.Create(this.Type, amount);
	}
}