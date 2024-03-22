import { ModFile  } from "../Core/ModFile.js";
import { System } from "../ModImports.js";

const Path = System.IO.Path;

export class ModContentSource {
constructor(file) {
        this.file = file ?? new Error("null argument");
        
        for (const entry of this.file) {
            const name = entry.Name;
            const extension =
        }
    }
    
    OpenStream(assetName) {
        return this.file.GetStream(assetName, true);
    }
}