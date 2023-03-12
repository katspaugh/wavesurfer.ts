"use strict";
exports.__esModule = true;
var Player = /** @class */ (function () {
    function Player(_a) {
        var media = _a.media, mediaType = _a.mediaType;
        this.isExternalMedia = false;
        if (media) {
            this.media = media;
            this.isExternalMedia = true;
        }
        else {
            this.media = document.createElement(mediaType || 'audio');
        }
    }
    Player.prototype.on = function (event, callback) {
        var _this = this;
        this.media.addEventListener(event, callback);
        return function () { return _this.media.removeEventListener(event, callback); };
    };
    Player.prototype.destroy = function () {
        if (!this.isExternalMedia) {
            this.media.remove();
        }
    };
    Player.prototype.loadUrl = function (src) {
        this.media.src = src;
    };
    Player.prototype.getCurrentTime = function () {
        return this.media.currentTime;
    };
    Player.prototype.play = function () {
        this.media.play();
    };
    Player.prototype.pause = function () {
        this.media.pause();
    };
    Player.prototype.isPlaying = function () {
        return this.media.currentTime > 0 && !this.media.paused && !this.media.ended;
    };
    Player.prototype.seekTo = function (time) {
        this.media.currentTime = time;
    };
    return Player;
}());
exports["default"] = Player;
