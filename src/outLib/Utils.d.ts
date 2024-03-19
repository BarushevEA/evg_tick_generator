import { Status } from "./Types";
import { ERROR, EState } from "./Env";
export declare function getPositiveStatus(state: EState): Status;
export declare function getNegativeStatus(state: EState | ERROR): Status;
