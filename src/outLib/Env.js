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
    EState["DELETED"] = "DELETED";
    EState["READY"] = "READY";
})(EState || (exports.EState = EState = {}));
var ERROR;
(function (ERROR) {
    ERROR["NEGATIVE_DELAY"] = "Delay must be a positive number.";
    ERROR["TYPE_INVALID"] = "TYPE_INVALID";
    ERROR["NAME_IS_NOT_PRESENT"] = "NAME_IS_NOT_PRESENT";
    ERROR["INSTANCE_DESTROYED"] = "INSTANCE_DESTROYED";
})(ERROR || (exports.ERROR = ERROR = {}));
