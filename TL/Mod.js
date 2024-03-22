import { ModLoader } from "./Loaders/ModLoader.js";
import { ModContentSource } from "./Assets/ModContentSource.js";
import { Terraria, ReLogic } from "./ModImports.js";

const LocalizationText = Terraria.Localization.LocalizedText;
const LanguageManager = Terraria.Localization.LanguageManager;
const AssetRepository = ReLogic.Content.AssetRepository;

export class Mod {
	get Name() { this.File.Name; }

	File;
	fileHandle;
	Content = [];
	AssetSourceController;
	ContentSource;
	ModdedKeys = new Set();

	loading = false;

	static Register() {
		ModLoader.Register(this);
	}

	static GetLocalizationKey(suffix) {
		return "Mods." + this.Name + suffix;
	}

	static GetLocalization(suffix, makeDefaultValue) {
		let text;
		const flag = LanguageManager._localizedTexts.TryGetValue(this.GetLocalizationKey(suffix), text);

		if (!flag) {
			this.moddedKeys.add(suffix);
			text = LanguageManager._localizedTexts[suffix] = LocalizationText.new()["void .ctor(string key, string text)"](suffix, (makeDefaultValue ? makeDefaultValue() : null) || suffix);
		}

		return text;
	}

	AddContent(content) {
        if (!this.loading) {
            throw new Error(`[${this.constructor.name}] Cannot add content when mod is not loading.`);
        }
        if (!this.Content.IsLoadingEnabled(this)) {
            return false;
        }
        this.Content.Load(this);
        this.Content.push(content);

        return true;
    }

	GetFileNames() {
        return this.File?.GetFileNames();
    }
 
    GetFileBytes(name) {
        return this.File?.GetBytes(name);
    }
 
    GetFileStream(name, newFileStream = false) {
        return this.File?.GetStream(name, newFileStream);
    }
 
    FileExists(name) {
        if (this.File != null) {
            return this.File.HasFile(name);
        }

        return false;
	}

	PrepareAssets() {
        this.ContentSource = new ModContentSource(this.File);
        Assets = new AssetRepository(((IServiceProvider)((Game)Main.instance).Services).Get<AssetReaderCollection>(), new IContentSource[1] { RootContentSource })
        {
            AssetLoadFailHandler = OnceFailedLoadingAnAsset
        };
    }

	Load() { }

	SetupContent() { }

	PostSetupContent() { }

}