import { Status } from "./Types";
import { ERROR, EState } from "./Env";
export declare const getPositiveStatus: (state: EState) => Status;
export declare const getNegativeStatus: (state: EState | ERROR) => Status;
export declare const getMaxNum: (a: number, b: number) => number;
export declare const getMinNum: (a: number, b: number) => number;
export declare const getMinNumNotZero: (a: number, b: number) => number;
export declare const getAvgNum: (a: number, b: number) => number;
