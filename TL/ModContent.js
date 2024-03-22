import { ModLoader } from "./ModLoader.js";
import { Terraria, ReLogic } from "./ModImports.js";

const Main = Terraria.Main;
const Asset = ReLogic.Content.Asset;
const AssetState = ReLogic.Content.AssetState;
const AssetRequestMode = ReLogic.Content.AssetRequestMode;

function NativeRequest(type, repository, assetName, mode = AssetRequestMode.AsyncLoad) {
    if (repository._readers == null) {
        mode = AssetRequestMode.DoNotLoad;
    }

    repository.ThrowIfDisposed();
    let asset = null;

    if (repository._assets.ContainsKey(assetName)) {
        asset = repository._assets[assetName];
    }

    if (asset == null) {
        asset = Asset.makeGeneric(type).new(assetName);
        repository._assets[assetName] = asset;
    }

    if (asset.State == AssetState.NotLoaded) {
        repository.LoadAsset(asset, mode);
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
            return NativeRequest(type, Main.Assets, name, mode);
        } else {
            const mod = ModLoader.GetModByName(modName);
            if (mod) {
                return NativeRequest(type, mod.Assets, path, mode);
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
			return mod.ContentSource.HasAsset(subName);
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