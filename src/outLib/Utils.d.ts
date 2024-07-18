import { Status } from "./Types";
import { ERROR, EState } from "./Env";
export declare function getPositiveStatus(state: EState): Status;
export declare function getNegativeStatus(state: EState | ERROR): Status;
export declare function getMaxNum(a: number, b: number): number;
export declare function getMinNum(a: number, b: number): number;
export declare function getMinNumNotZero(a: number, b: number): number;
export declare function getAvgNum(a: number, b: number): number;
