import { ModLoader } from "./Loaders/ModLoader.js";
import { ModContentSource } from "./Assets/ModContentSource.js";
import { Terraria, ReLogic } from "./ModImports.js";

const Main = Terraria.Main;
const LocalizationText = Terraria.Localization.LocalizedText;
const LanguageManager = Terraria.Localization.LanguageManager;
const AssetRepository = ReLogic.Content.AssetRepository;
const AssetReaderCollection = ReLogic.Content.AssetReaderCollection;

export class Mod {
	get Name() { this.File.Name; }

	File;
	fileHandle;
	Content = [];
	Assets;
	AssetSourceController;
	ContentSource;
	equipTextures;
	ModdedKeys = new Set();
	loading = false;

	static Register() {
		ModLoader.Register(this);
	}

	static GetLocalizationKey(suffix) {
		return "Mods." + this.Name + suffix;
	}

	static GetLocalization(suffix, makeDefaultValue) {
		const flag = LanguageManager._localizedTexts.hasOwnProperty(this.GetLocalizationKey(suffix));

		let text;
		if (flag) {
			text = LanguageManager._localizedTexts[this.GetLocalizationKey(suffix)];
		} else {
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
        this.Assets = AssetRepository.new()
			["void .ctor(AssetReaderCollection readers, IEnumerable sources)"]
			(Main.instance.Services.GetService(AssetReaderCollection), this.ContentSource)
    }

	Load() { }

	SetupContent() { }

	PostSetupContent() { }

}