import { ModLoader } from "./Loaders/ModLoader.js";
import { Terraria, ReLogic } from "./ModImports.js";

const LocalizationText = Terraria.Localization.LocalizedText;
const LanguageManager = Terraria.Localization.LanguageManager;
const AssetRepository = ReLogic.Content.AssetRepository;

export class Mod {
	Name = "";
	Version = "";
	Content = [];
	RootContentSource;
	Assets = AssetRepository.new();
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
        if (!Content.IsLoadingEnabled(this)) {
            return false;
        }
        Content.Load(this);
        this.Content.push(content);

        return true;
    }

	Load() { }

	SetupContent() { }

	PostSetupContent() { }

}