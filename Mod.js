import { ModLoader } from "./ModLoader.js";

export class Mod {
	Name;
	Assets;

	static Register() {
		ModLoader.Register(this);
	}

	Load() { }
	Unload() { }
}