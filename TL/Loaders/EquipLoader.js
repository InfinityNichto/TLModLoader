import { EquipType } from "../EquipType.js";
import { Terraria, System } from "../ModImports.js";

const Item = Terraria.Item;
const Array = System.Array;

export class EquipLoader {
    static nextEquip = {};
    static equipTextures = {};
    static idToSlot;
    static slotToId;
    static EquipTypes = [];
 
    constructor() {
        Object.keys(EquipType).forEach(k => EquipLoader.EquipTypes.push(obj[k]));

        const equipTypes = EquipTypes;
        for (const type of equipTypes) {
            EquipLoader.nextEquip[type] = EquipLoader.GetNumVanilla(type);
            EquipLoader.equipTextures[type] = {};
        }

        EquipLoader.slotToId[EquipType.Head] = {};
        EquipLoader.slotToId[EquipType.Body] = {};
        EquipLoader.slotToId[EquipType.Legs] = {};
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
        Array.Resize(TextureAssets.ArmorHead, this.nextEquip[EquipType.Head]);
        Array.Resize(TextureAssets.ArmorBody, this.nextEquip[EquipType.Body]);
        Array.Resize(TextureAssets.ArmorBodyComposite, this.nextEquip[EquipType.Body]);
        Array.Resize(TextureAssets.FemaleBody, this.nextEquip[EquipType.Body]);
        Array.Resize(TextureAssets.ArmorArm, this.nextEquip[EquipType.Body]);
        Array.Resize(TextureAssets.ArmorLeg, this.nextEquip[EquipType.Legs]);
        Array.Resize(TextureAssets.AccHandsOn, this.nextEquip[EquipType.HandsOn]);
        Array.Resize(TextureAssets.AccHandsOnComposite, this.nextEquip[EquipType.HandsOn]);
        Array.Resize(TextureAssets.AccHandsOff, this.nextEquip[EquipType.HandsOff]);
        Array.Resize(TextureAssets.AccHandsOffComposite, this.nextEquip[EquipType.HandsOff]);
        Array.Resize(TextureAssets.AccBack, this.nextEquip[EquipType.Back]);
        Array.Resize(TextureAssets.AccFront, this.nextEquip[EquipType.Front]);
        Array.Resize(TextureAssets.AccShoes, this.nextEquip[EquipType.Shoes]);
        Array.Resize(TextureAssets.AccWaist, this.nextEquip[EquipType.Waist]);
        Array.Resize(TextureAssets.Wings, this.nextEquip[EquipType.Wings]);
        Array.Resize(TextureAssets.AccShield, this.nextEquip[EquipType.Shield]);
        Array.Resize(TextureAssets.AccNeck, this.nextEquip[EquipType.Neck]);
        Array.Resize(TextureAssets.AccFace, this.nextEquip[EquipType.Face]);
        Array.Resize(TextureAssets.AccBeard, this.nextEquip[EquipType.Beard]);
        Array.Resize(TextureAssets.AccBalloon, this.nextEquip[EquipType.Balloon]);

        LoaderUtils.ResetStaticMembers(typeof(ArmorIDs));

        WingStatsInitializer.Load();
        const equipTypes = this.EquipTypes;
        for (const type of equipTypes) {
            for (const [slot, equipTexture] of Object.entries(this.equipTextures[type])) {
                const texture = equipTexture.Texture;
                GetTextureArray(type) = ModContent.Request<Texture2D>(texture);
                switch (type)
                {
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

        ResizeAndRegisterType(EquipType.Head, Item.headType);
        ResizeAndRegisterType(EquipType.Body, Item.bodyType);
        ResizeAndRegisterType(EquipType.Legs, Item.legType);

        ResizeAndRegisterType = (equipType, typeArray) => {
            System.Array.Resize(typeArray, nextEquip[equipType]);
            for (const [key, value] of Object.entries(this.equipTextures[type])) {
                typeArray[key] = value;
            }
        }
    }
 
    static GetNumVanilla(type) {
        switch(type) {
            EquipType.Head = ArmorIDs.Head.Count,
            EquipType.Body = ArmorIDs.Body.Count,
            EquipType.Legs = ArmorIDs.Legs.Count,
            EquipType.HandsOn = ArmorIDs.HandOn.Count,
            EquipType.HandsOff = ArmorIDs.HandOff.Count,
            EquipType.Back = ArmorIDs.Back.Count,
            EquipType.Front = ArmorIDs.Front.Count,
            EquipType.Shoes = ArmorIDs.Shoe.Count,
            EquipType.Waist = ArmorIDs.Waist.Count,
            EquipType.Wings = ArmorIDs.Wing.Count,
            EquipType.Shield = ArmorIDs.Shield.Count,
            EquipType.Neck = ArmorIDs.Neck.Count,
            EquipType.Face = ArmorIDs.Face.Count,
            EquipType.Beard = ArmorIDs.Beard.Count,
            EquipType.Balloon = ArmorIDs.Balloon.Count,
            _ => 0, 
    }
 
    internal static Asset<Texture2D>[] GetTextureArray(EquipType type)
    {
        return type switch
        {
            EquipType.Head => TextureAssets.ArmorHead, 
            EquipType.Body => TextureAssets.ArmorBodyComposite, 
            EquipType.Legs => TextureAssets.ArmorLeg, 
            EquipType.HandsOn => TextureAssets.AccHandsOnComposite, 
            EquipType.HandsOff => TextureAssets.AccHandsOffComposite, 
            EquipType.Back => TextureAssets.AccBack, 
            EquipType.Front => TextureAssets.AccFront, 
            EquipType.Shoes => TextureAssets.AccShoes, 
            EquipType.Waist => TextureAssets.AccWaist, 
            EquipType.Wings => TextureAssets.Wings, 
            EquipType.Shield => TextureAssets.AccShield, 
            EquipType.Neck => TextureAssets.AccNeck, 
            EquipType.Face => TextureAssets.AccFace, 
            EquipType.Beard => TextureAssets.AccBeard, 
            EquipType.Balloon => TextureAssets.AccBalloon, 
            _ => null, 
        };
    }
 
    internal static void SetSlot(Item item)
    {
        if (!idToSlot.TryGetValue(item.type, out var slots))
        {
            return;
        }
        foreach (KeyValuePair<EquipType, int> entry in slots)
        {
            int slot = entry.Value;
            switch (entry.Key)
            {
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
 
    internal static int GetPlayerEquip(Player player, EquipType type)
    {
        return type switch
        {
            EquipType.Head => player.head, 
            EquipType.Body => player.body, 
            EquipType.Legs => player.legs, 
            EquipType.HandsOn => player.handon, 
            EquipType.HandsOff => player.handoff, 
            EquipType.Back => player.back, 
            EquipType.Front => player.front, 
            EquipType.Shoes => player.shoe, 
            EquipType.Waist => player.waist, 
            EquipType.Wings => player.wings, 
            EquipType.Shield => player.shield, 
            EquipType.Neck => player.neck, 
            EquipType.Face => player.face, 
            EquipType.Beard => player.beard, 
            EquipType.Balloon => player.balloon, 
            _ => 0, 
        };
    }
 
    public static int AddEquipTexture(Mod mod, string texture, EquipType type, ModItem item = null, string name = null, EquipTexture equipTexture = null)
    {
        if (!mod.loading)
        {
            throw new Exception("AddEquipTexture can only be called from Mod.Load or Mod.Autoload");
        }
        if (name == null && item == null)
        {
            throw new Exception("AddEquipTexture requires either an item or a name be provided");
        }
        if (equipTexture == null)
        {
            equipTexture = new EquipTexture();
        }
        ModContent.Request<Texture2D>(texture);
        equipTexture.Texture = texture;
        equipTexture.Name = name ?? item.Name;
        equipTexture.Type = type;
        equipTexture.Item = item;
        int num2 = (equipTexture.Slot = ReserveEquipID(type));
        int slot = num2;
        equipTextures[type][slot] = equipTexture;
        mod.equipTextures[Tuple.Create(name ?? item.Name, type)] = equipTexture;
        if (item != null)
        {
            if (!idToSlot.TryGetValue(item.Type, out var slots))
            {
                slots = (idToSlot[item.Type] = new Dictionary<EquipType, int>());
            }
            slots[type] = slot;
            if (type == EquipType.Head || type == EquipType.Body || type == EquipType.Legs)
            {
                slotToId[type][slot] = item.Type;
            }
        }
        return slot;
    }
 
    public static EquipTexture GetEquipTexture(Mod mod, string name, EquipType type)
    {
        if (!mod.equipTextures.TryGetValue(Tuple.Create(name, type), out var texture))
        {
            return null;
        }
        return texture;
    }
 
    public static int GetEquipSlot(Mod mod, string name, EquipType type)
    {
        return GetEquipTexture(mod, name, type)?.Slot ?? (-1);
    }
 
    public static void EquipFrameEffects(Player player)
    {
        EquipType[] equipTypes = EquipTypes;
        foreach (EquipType type in equipTypes)
        {
            int slot = GetPlayerEquip(player, type);
            GetEquipTexture(type, slot)?.FrameEffects(player, type);
        }
    }
}
