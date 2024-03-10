export const Terraria = {
    Player: new NativeClass('Terraria', 'Player'),
    Item: new NativeClass('Terraria', 'Item'),
    Projectile: new NativeClass('Terraria', 'Projectile'),
    NPC: new NativeClass('Terraria', 'NPC'),
    Main: new NativeClass('Terraria', 'Main'),
    WorldGen: new NativeClass('Terraria', 'WorldGen'),
    Lang: new NativeClass('Terraria', 'Lang'),
    Recipe: new NativeClass('Terraria', 'Recipe'),
    Tile: new NativeClass('Terraria', 'Tile'),
    TileData: new NativeClass('Terraria', 'TileData'),
    TileObject: new NativeClass('Terraria', 'TileObject'),
    Utils: new NativeClass('Terraria', 'Utils'),
    Mount : new NativeClass('Terraria', 'Mount'),
    GetItemSettings: new NativeClass('Terraria', 'GetItemSettings'),
    Chest: new NativeClass('Terraria', 'Chest'),
    Dust: new NativeClass('Terraria', 'Dust'),
    CombatText: new NativeClass('Terraria', 'CombatText'),
    Collision: new NativeClass('Terraria', 'Collision'),
    GUIPlayerCreateMenu: new NativeClass('', 'GUIPlayerCreateMenu'),
    PlayerSpawnContext: new NativeClass('Terraria', 'PlayerSpawnContext'),
    DelegateMethods: new NativeClass('Terraria', 'DelegateMethods'),

    ID: {
        NPCID: new NativeClass('Terraria.ID', 'NPCID'),
        SoundID: new NativeClass('Terraria.ID', 'SoundID'),
        ItemID: new NativeClass('Terraria.ID', 'ItemID'),
        TileID: new NativeClass('Terraria.ID', 'TileID'),
        ArmorIDs: new NativeClass('Terraria.ID', 'ArmorIDs'),
        ProjectileID: new NativeClass('Terraria.ID', 'ProjectileID'),
        ContentSamples: new NativeClass('Terraria.ID', 'ContentSamples'),
        AmmoID: new NativeClass('Terraria.ID', 'AmmoID'),
        MountID: new NativeClass('Terraria.ID', 'MountID'),
        ItemUseStyleID: new NativeClass('Terraria.ID', 'ItemUseStyleID'),
        ItemHoldStyleID: new NativeClass('Terraria.ID', 'ItemHoldStyleID'),
        PrefixID: new NativeClass('Terraria.ID', 'PrefixID'),
        CustomCurrencyID: new NativeClass('Terraria.ID', 'CustomCurrencyID'),
        BuffID: new NativeClass('Terraria.ID', 'BuffID')
    },

    Localization: {
        Language: new NativeClass('Terraria.Localization', 'Language'),
        LanguageManager: new NativeClass('Terraria.Localization', 'LanguageManager'),
        LocalizedText: new NativeClass('Terraria.Localization', 'LocalizedText'),
        GameCulture: new NativeClass('Terraria.Localization', 'GameCulture'),
    },

    UI: {
        ItemTooltip: new NativeClass("Terraria.UI", "ItemTooltip"),
        ItemSorting: new NativeClass("Terraria.UI", "ItemSorting"),
        
        Chat: {
            ChatManager: new NativeClass('Terraria.UI.Chat', 'ChatManager')
        }
    },

    GameContent: {
        TextureAssets: new NativeClass('Terraria.GameContent', 'TextureAssets'),
        FontAssets: new NativeClass('Terraria.GameContent', 'FontAssets'),
        
        ItemDropRules: {
            ItemDropRule: new NativeClass('Terraria.GameContent.ItemDropRules', 'ItemDropRule'),
            ItemDropDatabase: new NativeClass('Terraria.GameContent.ItemDropRules', 'ItemDropDatabase'),
            CommonCode: new NativeClass('Terraria.GameContent.ItemDropRules', 'CommonCode')
        },

        Creative: {
            CreativeItemSacrificesCatalog: new NativeClass('Terraria.GameContent.Creative', 'CreativeItemSacrificesCatalog'),
            ItemsSacrificedUnlocksTracker: new NativeClass('Terraria.GameContent.Creative', 'ItemsSacrificedUnlocksTracker')
        },

        Events: {
            Sandstorm: new NativeClass('Terraria.GameContent.Events', 'Sandstorm')
        },

        Biomes: {
            CorruptionPitBiome: new NativeClass('Terraria.GameContent.Biomes', 'CorruptionPitBiome'),
            
            CaveHouse: {
                HouseUtils: new NativeClass('Terraria.GameContent.Biomes.CaveHouse', 'HouseUtils')
            },
        },

        Metadata: {
            TileMaterials: new NativeClass('Terraria.GameContent.Metadata', 'TileMaterials')
        }
    },

    ObjectData: {
        TileObjectData: new NativeClass('Terraria.ObjectData', 'TileObjectData')
    },

    DataStructures: {
        PlayerDrawSet: new NativeClass('Terraria.DataStructures', 'PlayerDrawSet'),
        PlayerDeathReason: new NativeClass('Terraria.DataStructures', 'PlayerDeathReason')
    },

    Audio: {
        SoundEngine : new NativeClass('Terraria.Audio', 'SoundEngine')
    },
    Chat: {
        ChatCommandProcessor: new NativeClass('Terraria.Chat', 'ChatCommandProcessor')
    },

    Graphics: {
        Shaders: {
            GameShaders: new NativeClass('Terraria.Graphics.Shaders', 'GameShaders')
        }
    },

    IO: {
        WorldFile: new NativeClass('Terraria.IO', 'WorldFile'),
    }
}

export const Microsoft = {
    Xna: {
        Framework: {
            Vector2: new NativeClass('Microsoft.Xna.Framework', 'Vector2'),
            Vector3: new NativeClass('Microsoft.Xna.Framework', 'Vector3'),
            Vector4: new NativeClass('Microsoft.Xna.Framework', 'Vector4'),
            Rectangle: new NativeClass('Microsoft.Xna.Framework', 'Rectangle'),
            Point: new NativeClass('Microsoft.Xna.Framework', 'Point'),
            Matrix: new NativeClass('Microsoft.Xna.Framework', 'Matrix'),
            MathHelper: new NativeClass('Microsoft.Xna.Framework', 'MathHelper'),
            
            Graphics: {
                Texture2D: new NativeClass('Microsoft.Xna.Framework.Graphics', 'Texture2D'),
                Color: new NativeClass('Microsoft.Xna.Framework.Graphics', 'Color'),
                SpriteEffects: new NativeClass('Microsoft.Xna.Framework.Graphics', 'SpriteEffects'),
                SpriteBatch: new NativeClass('Microsoft.Xna.Framework.Graphics', 'SpriteBatch'),
                SpriteSortMode: new NativeClass('Microsoft.Xna.Framework.Graphics', 'SpriteSortMode'),
                BlendState: new NativeClass('Microsoft.Xna.Framework.Graphics', 'BlendState'),
                DepthStencilState: new NativeClass('Microsoft.Xna.Framework.Graphics', 'DepthStencilState'),
                SamplerState: new NativeClass('Microsoft.Xna.Framework.Graphics', 'SamplerState'),
                RasterizerState: new NativeClass('Microsoft.Xna.Framework.Graphics', 'RasterizerState')
            }
        }
    }
}

export const ReLogic = {
    Content: {
        Asset: new NativeClass('ReLogic.Content', 'Asset`1'),
        AssetRepository: new NativeClass('ReLogic.Content', 'AssetRepository'),
        AssetState: new NativeClass('ReLogic.Content', 'AssetState'),
        AssetRequestMode: new NativeClass('ReLogic.Content', 'AssetRequestMode')
    }
}

export const System = {
    Nullable: new NativeClass('System', 'Nullable`1'),
    Int32: new NativeClass('System', 'Int32'),
    Math: new NativeClass('System', 'Math'),
    DateTime: new NativeClass('System', 'DateTime'),
    Array: new NativeClass('System', 'Array'),

    IO: {
        File: new NativeClass('System.IO', 'File')
    }
}