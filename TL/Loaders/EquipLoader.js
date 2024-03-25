import { EquipType, TextureMap } from "../EquipType.js";
import { EquipTexture } from "../EquipTexture.js";
import { Terraria, System, Microsoft } from "../ModImports.js";

const Item = Terraria.Item;
const ArmorIDs = Terraria.ID.ArmorIDs;
const Texture2D = Microsoft.Xna.Framework.Graphics.Texture2D;
const Array = System.Array;

export class EquipLoader {
    static nextEquip = {};
    static equipTextures = {};
    static idToSlot;
    static slotToId;
    static EquipTypes = [];
 
    constructor() {
        Object.keys(EquipType).forEach(k => this.EquipTypes.push(obj[k]));

        const equipTypes = EquipTypes;
        for (const type of equipTypes) {
            this.nextEquip[type] = this.GetNumVanilla(type);
            this.equipTextures[type] = {};
        }

        this.slotToId[EquipType.Head] = {};
        this.slotToId[EquipType.Body] = {};
        this.slotToId[EquipType.Legs] = {};
    }
 
    static ReserveEquipID(type) {
        if (typeof this.nextEquip[type] === "undefined") {
            this.nextEquip[type] = 0;
        }
            
        return this.nextEquip[type]++;
    }

    static GetEquipTexture(type, slot) {
        if (!this.equipTextures[type].hasOwnProperty(slot)) {
            return null;
        }
        
        return this.equipTextures[type][slot];
    }
 
    static ResizeAndFillArrays() {
        TextureAssets.ArmorBody = TextureAssets.ArmorBody.cloneResized(this.nextEquip[EquipType.Body]);
        TextureAssets.ArmorBodyComposite = TextureAssets.ArmorBodyComposite.cloneResized(this.nextEquip[EquipType.Body]);
        TextureAssets.FemaleBody = TextureAssets.FemaleBody.cloneResized(this.nextEquip[EquipType.Body]);
        TextureAssets.ArmorArm = TextureAssets.ArmorArm.cloneResized(this.nextEquip[EquipType.Body]);
        TextureAssets.ArmorLeg = TextureAssets.ArmorLeg.cloneResized(this.nextEquip[EquipType.Legs]);
        TextureAssets.AccHandsOn = TextureAssets.AccHandsOn.cloneResized(this.nextEquip[EquipType.HandsOn]);
        TextureAssets.AccHandsOnComposite = TextureAssets.AccHandsOnComposite.cloneResized(this.nextEquip[EquipType.HandsOn]);
        TextureAssets.AccHandsOff = TextureAssets.AccHandsOff.cloneResized(this.nextEquip[EquipType.HandsOff]);
        TextureAssets.AccHandsOffComposite = TextureAssets.AccHandsOffComposite.cloneResized(this.nextEquip[EquipType.HandsOff]);
        TextureAssets.AccBack = TextureAssets.AccBack.cloneResized(this.nextEquip[EquipType.Back]);
        TextureAssets.AccFront = TextureAssets.AccFront.cloneResized(this.nextEquip[EquipType.Front]);
        TextureAssets.AccShoes = TextureAssets.AccShoes.cloneResized(this.nextEquip[EquipType.Shoes]);
        TextureAssets.AccWaist = TextureAssets.AccWaist.cloneResized(this.nextEquip[EquipType.Waist]);
        TextureAssets.Wings = TextureAssets.Wings.cloneResized(this.nextEquip[EquipType.Wings]);
        TextureAssets.AccShield = TextureAssets.AccShield.cloneResized(this.nextEquip[EquipType.Shield]);
        TextureAssets.AccNeck = TextureAssets.AccNeck.cloneResized(this.nextEquip[EquipType.Neck]);
        TextureAssets.AccFace = TextureAssets.AccFace.cloneResized(this.nextEquip[EquipType.Face]);
        TextureAssets.AccBeard = TextureAssets.AccBeard.cloneResized(this.nextEquip[EquipType.Beard]);
        TextureAssets.AccBalloon = TextureAssets.AccBalloon.cloneResized(this.nextEquip[EquipType.Balloon]);

        Utility.ResetStaticMembers(typeof(ArmorIDs));

        WingStatsInitializer.Load();
        const equipTypes = this.EquipTypes;
        for (const type of equipTypes) {
            for (const [slot, equipTexture] of Object.entries(this.equipTextures[type])) {
                const texture = equipTexture.Texture;
                GetTextureArray(type) = ModContent.Request(Texture2D, texture);

                switch (type) {
                case EquipType.Body:
                    ArmorIDs.Body.Sets.UsesNewFramingCode[slot] = true;
                    break;
                case EquipType.HandsOn:
                    ArmorIDs.HandOn.Sets.UsesNewFramingCode[slot] = true;
                    break;
                case EquipType.HandsOff:
                    ArmorIDs.HandOff.Sets.UsesNewFramingCode[slot] = true;
                    break;
                }
            }
        }

        Item.headType = ResizeAndRegisterType(EquipType.Head, Item.headType);
        Item.bodyType = ResizeAndRegisterType(EquipType.Body, Item.bodyType);
        Item.legType = ResizeAndRegisterType(EquipType.Legs, Item.legType);

        ResizeAndRegisterType = (equipType, typeArray) => {
            const res = typeArray.cloneResized(nextEquip[equipType]);
            for (const [key, value] of Object.entries(this.equipTextures[type])) {
                res[key] = value;
            }

            return res;
        }
    }
 
    static GetNumVanilla(type) {
        switch (type) {
            case EquipType.Head:
                count = ArmorIDs.Head.Count;
                break;
            case EquipType.Body:
                count = ArmorIDs.Body.Count;
                break;
            case EquipType.Legs:
                count = ArmorIDs.Legs.Count;
                break;
            case EquipType.HandsOn:
                count = ArmorIDs.HandOn.Count;
                break;
            case EquipType.HandsOff:
                count = ArmorIDs.HandOff.Count;
                break;
            case EquipType.Back:
                count = ArmorIDs.Back.Count;
                break;
            case EquipType.Front:
                count = ArmorIDs.Front.Count;
                break;
            case EquipType.Shoes:
                count = ArmorIDs.Shoe.Count;
                break;
            case EquipType.Waist:
                count = ArmorIDs.Waist.Count;
                break;
            case EquipType.Wings:
                count = ArmorIDs.Wing.Count;
                break;
            case EquipType.Shield:
                count = ArmorIDs.Shield.Count;
                break;
            case EquipType.Neck:
                count = ArmorIDs.Neck.Count;
                break;
            case EquipType.Face:
                count = ArmorIDs.Face.Count;
                break;
            case EquipType.Beard:
                count = ArmorIDs.Beard.Count;
                break;
            case EquipType.Balloon:
                count = ArmorIDs.Balloon.Count;
                break;
            default:
                return 0;
        }
    }
 
    static GetTextureArray(type) {
        return TextureMap[type] || null;
    }
 
    static SetSlot(item) {
        const { found: flag, value: slots } = this.idToSlot.TryGetValue(item.type);
        if (!flag) {
            return;
        }

        for (const [key, value] of Object.entries(slots)) {
            const slot = value;
            switch (key) {
                case EquipType.Head:
                    item.headSlot = slot;
                    break;
                case EquipType.Body:
                    item.bodySlot = slot;
                    break;
                case EquipType.Legs:
                    item.legSlot = slot;
                    break;
                case EquipType.HandsOn:
                    item.handOnSlot = slot;
                    break;
                case EquipType.HandsOff:
                    item.handOffSlot = slot;
                    break;
                case EquipType.Back:
                    item.backSlot = slot;
                    break;
                case EquipType.Front:
                    item.frontSlot = slot;
                    break;
                case EquipType.Shoes:
                    item.shoeSlot = slot;
                    break;
                case EquipType.Waist:
                    item.waistSlot = slot;
                    break;
                case EquipType.Wings:
                    item.wingSlot = slot;
                    break;
                case EquipType.Shield:
                    item.shieldSlot = slot;
                    break;
                case EquipType.Neck:
                    item.neckSlot = slot;
                    break;
                case EquipType.Face:
                    item.faceSlot = slot;
                    break;
                case EquipType.Beard:
                    item.beardSlot = slot;
                    break;
                case EquipType.Balloon:
                    item.balloonSlot = slot;
                    break;
            }
        }
    }
 
    static GetPlayerEquip(player, type) {
        switch (type) {
            case EquipType.Head:
                return player.head;
            case EquipType.Body:
                return player.body;
            case EquipType.Legs:
                return player.legs;
            case EquipType.HandsOn:
                return player.handon;
            case EquipType.HandsOff:
                return player.handoff;
            case EquipType.Back:
                return player.back;
            case EquipType.Front:
                return player.front;
            case EquipType.Shoes:
                return player.shoe;
            case EquipType.Waist:
                return player.waist;
            case EquipType.Wings:
                return player.wings;
            case EquipType.Shield:
                return player.shield;
            case EquipType.Neck:
                return player.neck;
            case EquipType.Face:
                return player.face;
            case EquipType.Beard:
                return player.beard;
            case EquipType.Balloon:
                return player.balloon;
            default:
                return 0;
        }
    }
 
    static AddEquipTexture(mod, texture, type, item = null, name = null, equipTexture = null) {
        if (name == null && item == null) {
            throw new Error("null arguments. AddEquipTexture requires either an item or a name be provided");
        }

        if (equipTexture == null) {
            equipTexture = new EquipTexture();
        }

        ModContent.Request(Texture2D, texture);
        equipTexture.Texture = texture;
        equipTexture.Name = name ?? item.Name;
        equipTexture.Type = type;
        equipTexture.Item = item;

        const slot = (equipTexture.Slot = this.ReserveEquipID(type));
        this.equipTextures[type][slot] = equipTexture;
        mod.equipTextures[[name ?? item.Name, type]] = equipTexture;
        
        if (item != null) {
            const { found: flag, value: slots } = this.idToSlot.TryGetValue(item.Type);
            if (!found) {
                slots = (this.idToSlot[item.Type] = {});
            }
            slots[type] = slot;

            if (type == EquipType.Head || type == EquipType.Body || type == EquipType.Legs) {
                this.slotToId[type][slot] = item.Type;
            }
        }

        return slot;
    }
 
    static GetEquipTexture(mod, name, type) {
        const { found: flag, value: texture } = mod.equipTextures.TryGetValue([name, type]);
        if (!flag) {
            return null;
        }

        return texture;
    }
 
    static GetEquipSlot(mod, name, type) {
        return this.GetEquipTexture(mod, name, type)?.Slot ?? -1;
    }
 
    static EquipFrameEffects(player) {
        for (const type in EquipTypes) {
            const slot = this.GetPlayerEquip(player, EquipType[type]);
            this.GetEquipTexture(type, slot)?.FrameEffects(player, type);
        }
    }
}
