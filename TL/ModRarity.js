import { Microsoft } from "./ModImports.js";

const Color = Microsoft.Xna.Framework.Graphics.Color;

export class ModRarity extends ModType {
    Type;
    RarityColor = Color.White;
 
    Register() {
        ModTypeLookup.Register(this.constructor);
        this.Type = RarityLoader.Add(this.constructor);
    }
 
    SetupContent() {
        this.SetStaticDefaults();
    }
 
    GetPrefixedRarity(offset, valueMult) {
        return this.Type;
    }
}