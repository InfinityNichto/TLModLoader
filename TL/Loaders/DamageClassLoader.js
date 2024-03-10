import { ModTypeLookup } from "../ModTypeLookup.js";
import { DamageClass } from "../DamageClass.js";

export class DamageClassLoader {
    static effectInheritanceCache = [];
    static DamageClasses = [];
    static DefaultClassCount;
    static get DamageClassCount() { return this.DamageClasses.length; }
 
    constructor () {
        this.DamageClasses = [
            DamageClass.Default,
            DamageClass.Generic,
            DamageClass.Melee,
            DamageClass.MeleeNoSpeed,
            DamageClass.Ranged,
            DamageClass.Magic,
            DamageClass.Summon,
            DamageClass.SummonMeleeSpeed,
            DamageClass.MagicSummonHybrid,
            DamageClass.Throwing
        ]

        this.DefaultClassCount = this.DamageClasses.length;
        this.RegisterDefaultClasses();
        this.ResizeArrays();
    }
 
    static Add(damageClass) {
        this.DamageClasses.push(damageClass);
        return DamageClasses.length - 1;
    }
 
    static ResizeArrays() {
        this.RebuildEffectInheritanceCache();
    }
 
    static Unload() {
        array.splice(this.DefaultClassCount, (this.DamageClasses.length - this.DefaultClassCount) - this.DefaultClassCount + 1);
    }
 
    static RebuildEffectInheritanceCache() {
        this.effectInheritanceCache = [];
        for (let i = 0; i < this.DamageClasses.length; i++) {
            for (let j = 0; j < this.DamageClasses.length; j++) {
                const damageClass = this.DamageClasses[i];
                if (damageClass == this.DamageClasses[j] || damageClass.GetEffectInheritance(this.DamageClasses[j])) {
                    this.effectInheritanceCache[i, j] = true;
                }
            }
        }
    }
 
    static RegisterDefaultClasses() {
        let i = 0;
        for (const damageClass of this.DamageClasses) {
            damageClass.Type = i++;
            ModTypeLookup.Register(damageClass);
        }
    }
 
    static GetDamageClass(type) {
        return type >= this.DamageClasses.length ? null : this.DamageClasses[type];
    }
}