import { IRequestAnimationFrame, Status } from "./Types";
import { AbstractOrderedGenerator } from "./AbstractOrderedGenerator";
export declare class GAnimationFrameOrdered extends AbstractOrderedGenerator implements IRequestAnimationFrame {
    private id;
    private fps;
    constructor();
    setFPS(num: number): Status;
    set60fps(): Status;
    set30fps(): Status;
    setDefault(): Status;
    startProcess(): Status;
    stopProcess(): Status;
}
