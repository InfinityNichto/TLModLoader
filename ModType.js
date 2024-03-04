export class ModType {
    Mod;
    Name = this.constructor.name;
    FullName = (Mod?.Name ?? "Terraria") + '/' + this.Name;

}