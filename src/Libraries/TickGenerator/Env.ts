export enum EState {
    INIT = "INIT",
    STARTED = "STARTED",
    STOPPED = "STOPPED",
    PROCESS = "PROCESS",
    DESTROYED = "DESTROYED",
    UNDEFINED = "UNDEFINED",
    READY = "READY",
}

export enum ERROR {
    NEGATIVE_DELAY = "Delay must be a positive number.",
    TYPE_INVALID = "TYPE_INVALID",
}
