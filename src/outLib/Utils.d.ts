import { Status } from "./Types";
import { ERROR, EState } from "./Env";
export declare function getPositive(state: EState): Status;
export declare function getNegative(state: EState | ERROR): Status;
export declare function getMax(a: number, b: number): number;
export declare function getMin(a: number, b: number): number;
export declare function getMinNumNotZero(a: number, b: number): number;
export declare function getAvg(a: number, b: number): number;
