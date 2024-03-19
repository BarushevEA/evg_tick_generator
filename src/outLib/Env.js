"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR = exports.EState = void 0;
var EState;
(function (EState) {
    EState["INIT"] = "INIT";
    EState["STARTED"] = "STARTED";
    EState["STOPPED"] = "STOPPED";
    EState["PROCESS"] = "PROCESS";
    EState["DESTROYED"] = "DESTROYED";
    EState["UNDEFINED"] = "UNDEFINED";
})(EState || (exports.EState = EState = {}));
var ERROR;
(function (ERROR) {
    ERROR["ERROR_NEGATIVE_DELAY"] = "Delay must be a positive number.";
})(ERROR || (exports.ERROR = ERROR = {}));
