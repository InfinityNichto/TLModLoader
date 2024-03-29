export class TooltipLine {
    constructor(name, text, mod = "Terraria") {
        if (typeof mod != "string") {
            this.Mod = mod.Name;
        } else { 
            this.Mod = mod;
        }

        this.Name = name;
        this.Text = text;
    }

    get FullName() { return this.Mod + "/" + this.Name };

    Visible = true;
    IsModifier;
    IsModifierBad;
    OverrideColor;
    OneDropLogo;
 
    Hide() {
        this.Visible = false;
    }
}