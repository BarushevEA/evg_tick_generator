import { IRequestAnimationFrame, Status } from "./Types";
import { AbstractGenerator } from "./AbstractGenerator";
export declare class GAnimationFrame extends AbstractGenerator implements IRequestAnimationFrame {
    private rafId;
    private fps;
    constructor();
    setFPS(num: number): Status;
    set60fps(): Status;
    set30fps(): Status;
    setDefault(): Status;
    startProcess(): Status;
    stopProcess(): Status;
}
