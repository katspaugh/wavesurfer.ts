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
var event_emitter_js_1 = require("./event-emitter.js");
var Timer = /** @class */ (function (_super) {
    __extends(Timer, _super);
    function Timer() {
        var _this = _super.call(this) || this;
        _this.unsubscribe = function () { return undefined; };
        _this.unsubscribe = _this.on('tick', function () {
            requestAnimationFrame(function () {
                _this.emit('tick');
            });
        });
        _this.emit('tick');
        return _this;
    }
    Timer.prototype.destroy = function () {
        this.unsubscribe();
    };
    return Timer;
}(event_emitter_js_1["default"]));
exports["default"] = Timer;
