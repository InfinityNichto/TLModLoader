import { ModLoader } from "./ModLoader.js";
import { Terraria, ReLogic } from "./ModImports.js";

const Main = Terraria.Main;
const Asset = ReLogic.Content.Asset;
const AssetState = ReLogic.Content.AssetState;
const AssetRequestMode = ReLogic.Content.AssetRequestMode;

function NativeRequest(type, assetName, mode = AssetRequestMode.AsyncLoad) {
    if (Main.Assets._readers == null) {
        mode = AssetRequestMode.DoNotLoad;
    }

    Main.Assets.ThrowIfDisposed();
    let asset = null;

    if (Main.Assets._assets.ContainsKey(assetName)) {
        asset = Main.Assets._assets[assetName];
    }

    if (asset == null) {
        asset = Asset.makeGeneric(type).new(assetName);
        Main.Assets._assets[assetName] = asset;
    }

    if (asset.State == AssetState.NotLoaded) {
        Main.Assets.LoadAsset(asset, mode);
    }

    if (mode == AssetRequestMode.ImmediateLoad) {
        asset.Wait();
    }

    return asset;
}


function isNullOrWhiteSpace(str) {
    return !str || str.trim() === '';
}

export class ModContent {
    static Load() {
        ModLoader.OnLoad();
    }

    static Request(type, name, mode = ReLogic.Content.AssetRequestMode.ImmediateLoad) {
        const { domain: modName, subName: path } = this.splitName(name);

        if (modName == "Terraria") {
            return NativeRequest(type, name, mode);
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

        const { domain: modName, subName: subName } = this.splitName(name);
        if (modName == "Terraria") {
			return Main.AssetSourceController._staticSources.Single().HasAsset(subName);
		}

        const { found: flag, value: mod } = ModLoader.TryGetMod(modName);
        if (flag) {
			return mod.RootContentSource.HasAsset(subName);
		}
    }

    static RequestIfExists(type, name, mode = AssetRequestMode.AsyncLoad) {
		if (!this.HasAsset(name)) {
            return { exists: false, asset: null };
		}

		return { exists: true, asset: this.Request(type, name, mode) };
	}

    static splitName(name) {
        const firstSlash = name.indexOf('/');
        const lastSlash = name.lastIndexOf('/');

        const domain = name.substring(0, firstSlash);
        const subName = name.substring(firstSlash + 1);
        const content = name.substring(lastSlash + 1);
        
        return { domain: domain, subName: subName, content: content };
    }
}