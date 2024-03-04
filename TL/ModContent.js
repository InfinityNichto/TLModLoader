import { Terraria, ReLogic } from "./ModImports.js";
import { ModLoader } from "./ModLoader.js";

export class ModContent {
    static Load() {
        ModLoader.OnLoad();
    }

    static Request(name, mode = ReLogic.Content.AssetRequestMode.ImmediateLoad) {
        const { modName, path } = this.splitName(name);

        if (modName == "Terraria") {
            return Terraria.Main.Assets.Request(path, mode);
        } else {
            const mod = ModLoader.GetModByName(modName);
            if (mod) {
                return mod.Assets.Request(path, mode);
            }
        }
    }

    static splitName(name) {
        const firstSlash = name.indexOf('/');
        const lastSlash = name.lastIndexOf('/');

        const domain = name.substring(0, firstSlash);
        const subName = name.substring(firstSlash + 1);
        const content = name.substring(lastSlash + 1);
        
        return { domain, subName, content };
    }
}