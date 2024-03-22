import { Terraria, ReLogic, System } from "../ModImports.js";

const AssetInitializer = Terraria.Initializers.AssetInitializer;
const ContentSource = ReLogic.Content.Sources.ContentSource;
const Path = System.IO.Path;

const GetExtension = Path["string GetExtension(string path)"];

export class ModContentSource {
    constructor(file) {
        this.base = ContentSource.new();
        this.file = file ?? new Error("null file argument");
        
        const assetNames = [];
        for (const entry of this.file) {
            const name = entry.Name;
            const extension = GetExtension(name);

            if (AssetInitializer.assetReaderCollection.TryGetReader(extension, _)) {
                assetNames.push(name);
            }
        }

        this.base.SetAssetNames(assetNames);
    }
    
    OpenStream(assetName) {
        return this.file.GetStream(assetName, true);
    }
}