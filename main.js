import { Mod } from "./Mod.js";
import { ModContent } from "./ModContent.js";

class MyMod extends Mod {
    Load() {
        tl.log("I am being loaded!");
    }

    Unload() {
        tl.log("I am being unloaded!");
    }
}

MyMod.Register();
ModContent.Load(); // calls the ModLoader OnLoad, which calls every Load functions from all instances of Mod