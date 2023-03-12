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
var player_js_1 = require("./player.js");
var WebAudioPlayer = /** @class */ (function (_super) {
    __extends(WebAudioPlayer, _super);
    function WebAudioPlayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.audioCtx = null;
        _this.sourceNode = null;
        return _this;
    }
    WebAudioPlayer.prototype.destroy = function () {
        var _a, _b;
        (_a = this.sourceNode) === null || _a === void 0 ? void 0 : _a.disconnect();
        this.sourceNode = null;
        (_b = this.audioCtx) === null || _b === void 0 ? void 0 : _b.close();
        this.audioCtx = null;
        _super.prototype.destroy.call(this);
    };
    WebAudioPlayer.prototype.loadUrl = function (url) {
        _super.prototype.loadUrl.call(this, url);
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext ||
                window.webkitAudioContext)({
                latencyHint: 'playback'
            });
        }
        if (this.sourceNode) {
            this.sourceNode.disconnect();
        }
        this.sourceNode = this.audioCtx.createMediaElementSource(this.media);
        this.sourceNode.connect(this.audioCtx.destination);
    };
    return WebAudioPlayer;
}(player_js_1["default"]));
exports["default"] = WebAudioPlayer;
