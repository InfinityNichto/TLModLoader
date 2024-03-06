import { ModType } from "./ModType.js";
 export class ModTexturedType extends ModType {
    Texture = this.constructor.name;
    FrameCount = -1;
    TicksPerFrame = 100;
 }