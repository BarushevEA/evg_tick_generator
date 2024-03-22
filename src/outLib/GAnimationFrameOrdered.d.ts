import { IRequestAnimationFrame, Status } from "./Types";
import { AbstractOrderedGenerator } from "./AbstractOrderedGenerator";
export declare class GAnimationFrameOrdered extends AbstractOrderedGenerator implements IRequestAnimationFrame {
    private rafId;
    private fps;
    constructor(rafId: number | null);
    setFPS(num: number): Status;
    set60fps(): Status;
    set30fps(): Status;
    setDefault(): Status;
    startProcess(): Status;
    stopProcess(): Status;
}
