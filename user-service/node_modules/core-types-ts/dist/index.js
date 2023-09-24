"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helpers = exports.convertTypeScriptToCoreTypes = exports.convertSingleCoreTypeToTypeScriptAst = exports.convertCoreTypesToTypeScript = void 0;
var core_types_to_ts_1 = require("./lib/core-types-to-ts");
Object.defineProperty(exports, "convertCoreTypesToTypeScript", { enumerable: true, get: function () { return core_types_to_ts_1.convertCoreTypesToTypeScript; } });
Object.defineProperty(exports, "convertSingleCoreTypeToTypeScriptAst", { enumerable: true, get: function () { return core_types_to_ts_1.convertSingleCoreTypeToTypeScriptAst; } });
var ts_to_core_types_1 = require("./lib/ts-to-core-types");
Object.defineProperty(exports, "convertTypeScriptToCoreTypes", { enumerable: true, get: function () { return ts_to_core_types_1.convertTypeScriptToCoreTypes; } });
exports.helpers = require("./lib/ts-helpers");
