import { ModFile  } from "../Core/ModFile.js";
import { ReLogic, System } from "../ModImports.js";

const ContentSource = ReLogic.Content.Sources.ContentSource;
const Path = System.IO.Path;

const GetExtension = Path["string GetExtension(string path)"];

export class ModContentSource {
    constructor(file) {
        this.file = file ?? new Error("null argument");
        
        const assetNames = [];
        for (const entry of this.file) {
            const name = entry.Name;
            const extension = GetExtension(name);

            if (AssetInitializer.assetReaderCollection.TryGetReader(extension, _)) {
                assetNames.push(name);
            }
        }

        ContentSource.SetAssetNames(assetNames);
    }
    
    OpenStream(assetName) {
        return this.file.GetStream(assetName, true);
    }
}