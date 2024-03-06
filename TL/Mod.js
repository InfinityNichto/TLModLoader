import { ModLoader } from "./Loaders/ModLoader.js";

export class Mod {
	Name;
	Version;
	Content = [];
	Assets = [];
	loading = false;

	static Register() {
		ModLoader.Register(this);
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