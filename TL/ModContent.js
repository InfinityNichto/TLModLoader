import { ModLoader } from "./ModLoader.js";
import { Terraria, ReLogic } from "./ModImports.js";

const Main = Terraria.Main;

function isNullOrWhiteSpace(str) {
    return !str || str.trim() === '';
}

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

    static HasAsset(name) {
        if(isNullOrWhiteSpace(name) || !name.includes('/')) {
            return false;
        }

        const { modName, subName } = this.splitName(name);
        if (modName == "Terraria") {
			return Main.AssetSourceController._staticSources.Single().HasAsset(subName);
		}

        const { flag, mod } = ModLoader.TryGetMod(modName);
        if (flag) {
			return mod.RootContentSource.HasAsset(subName);
		}
    }

    static RequestIfExists(name, mode = AssetRequestMode.AsyncLoad) {
		if (!this.HasAsset(name)) {
            return { exists: false, asset: null };
		}

		return { exists: true, asset: this.Request(name, mode) };
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