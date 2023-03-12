"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.BasePlugin = void 0;
var event_emitter_js_1 = require("./event-emitter.js");
var BasePlugin = /** @class */ (function (_super) {
    __extends(BasePlugin, _super);
    function BasePlugin(params) {
        var _this = _super.call(this) || this;
        _this.subscriptions = [];
        _this.wavesurfer = params.wavesurfer;
        _this.renderer = params.renderer;
        return _this;
    }
    BasePlugin.prototype.destroy = function () {
        this.subscriptions.forEach(function (unsubscribe) { return unsubscribe(); });
    };
    return BasePlugin;
}(event_emitter_js_1["default"]));
exports.BasePlugin = BasePlugin;
exports["default"] = BasePlugin;
