export class StatModifier {
    static Default = new StatModifier();
    Base;
    Flat;
    Additive;
    Multiplicative;
 
    constructor(additive = 1, multiplicative = 1, flat = 0, base = 0) {
        this.Additive = additive;
        this.Multiplicative = multiplicative;
        this.Flat = flat;
        this.Base = base;
    }
 
    static Add(modifier, add) {
        return new StatModifier(modifier.Additive + add, modifier.Multiplicative, modifier.Flat, modifier.Base);
    }
 
    static Subtract(modifier, sub)
    {
        return new StatModifier(modifier.Additive - sub, modifier.Multiplicative, modifier.Flat, modifier.Base);
    }
 
    static Multiply(modifier, mul)
    {
        return new StatModifier(modifier.Additive, modifier.Multiplicative * mul, modifier.Flat, modifier.Base);
    }
 
    static Divide(modifier, div)
    {
        return new StatModifier(modifier.Additive, modifier.Multiplicative / div, modifier.Flat, modifier.Base);
    }
 
    static IsEqual(modifier1, modifier2) {
        return modifier1.Additive == modifier2.Additive && modifier1.Multiplicative == modifier2.Multiplicative && modifier1.Flat == modifier2.Flat && modifier1.Base == modifier2.Base;
    }
 
    static IsNotEqual(modifier1, modifier2) {
        return !this.IsEqual(modifier1, modifier2);
    }
 
    ApplyTo(baseValue) {
        return (baseValue + this.Base) * this.Additive * this.Multiplicative + this.Flat;
    }
 
    CombineWith(modifier) {
        return new StatModifier(this.Additive + modifier.Additive - 1, this.Multiplicative * modifier.Multiplicative, this.Flat + modifier.Flat, this.Base + modifier.Base);
    }
 
    Scale(scale) {
        return new StatModifier(1 + (this.Additive - 1) * scale, 1 + (this.Multiplicative - 1) * scale, this.Flat * scale, this.Base * scale);
    }
}
