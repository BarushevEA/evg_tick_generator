import { EState } from "./Env";
import { ICallback, ISubscriptionLike } from "evg_observable/src/outLib/Types";
import { IGenerator, IRequestAnimationFrame, Status } from "./Types";
export declare class GAnimationFrame implements IGenerator, IRequestAnimationFrame {
    private rafId;
    private fps;
    private state$;
    get state(): EState;
    setFPS(num: number): Status;
    set60fps(): Status;
    set30fps(): Status;
    setDefault(): Status;
    start(): Status;
    stop(): Status;
    destroy(): Status;
    subscribeOnState(callback: ICallback<EState>): ISubscriptionLike | undefined;
    subscribeOnProcess(callback: ICallback<EState>): ISubscriptionLike | undefined;
    isDestroyed(): boolean;
}
