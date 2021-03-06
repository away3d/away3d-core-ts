"use strict";
var LoaderEvent_1 = require("awayjs-core/lib/events/LoaderEvent");
var URLRequest_1 = require("awayjs-core/lib/net/URLRequest");
var AssetLibrary_1 = require("awayjs-core/lib/library/AssetLibrary");
var RequestAnimationFrame_1 = require("awayjs-core/lib/utils/RequestAnimationFrame");
var Debug_1 = require("awayjs-core/lib/utils/Debug");
var View_1 = require("awayjs-display/lib/View");
var Skybox_1 = require("awayjs-display/lib/display/Skybox");
var DefaultRenderer_1 = require("awayjs-renderergl/lib/DefaultRenderer");
var CubeTextures = (function () {
    function CubeTextures() {
        var _this = this;
        Debug_1.Debug.LOG_PI_ERRORS = false;
        Debug_1.Debug.THROW_ERRORS = false;
        this._view = new View_1.View(new DefaultRenderer_1.DefaultRenderer());
        this._view.camera.z = -500;
        this._view.camera.y = 250;
        this._view.camera.rotationX = 20;
        this._view.camera.projection.near = 0.5;
        this._view.camera.projection.far = 14000;
        this._view.backgroundColor = 0x2c2c32;
        var session = AssetLibrary_1.AssetLibrary.getLoader();
        session.addEventListener(LoaderEvent_1.LoaderEvent.LOAD_COMPLETE, function (event) { return _this.onLoadComplete(event); });
        session.load(new URLRequest_1.URLRequest('assets/SingleCubeTextureTest.cube'));
        window.onresize = function (event) { return _this.onResize(event); };
        this.onResize();
        this._timer = new RequestAnimationFrame_1.RequestAnimationFrame(this.render, this);
        this._timer.start();
    }
    CubeTextures.prototype.onLoadComplete = function (event) {
        var loader = event.target;
        switch (event.url) {
            case 'assets/SingleCubeTextureTest.cube':
                this._view.scene.addChild(new Skybox_1.Skybox(loader.baseDependency.assets[0]));
                break;
        }
    };
    CubeTextures.prototype.render = function (dt) {
        this._view.camera.rotationY += 0.01 * dt;
        this._view.render();
    };
    CubeTextures.prototype.onResize = function (event) {
        if (event === void 0) { event = null; }
        this._view.y = 0;
        this._view.x = 0;
        this._view.width = window.innerWidth;
        this._view.height = window.innerHeight;
    };
    return CubeTextures;
}());

//# sourceMappingURL=data:application/json;base64,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LFlBQW9CO1FBRW5DLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakIsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUNyQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO0lBQ3hDLENBQUM7SUFDRixtQkFBQztBQUFELENBdkRBLEFBdURDLElBQUEiLCJmaWxlIjoidGV4dHVyZXMvQ3ViZVRleHR1cmVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtCaXRtYXBJbWFnZUN1YmV9XHRcdFx0XHRmcm9tIFwiYXdheWpzLWNvcmUvbGliL2ltYWdlL0JpdG1hcEltYWdlQ3ViZVwiO1xuaW1wb3J0IHtMb2FkZXJFdmVudH1cdFx0XHRcdFx0ZnJvbSBcImF3YXlqcy1jb3JlL2xpYi9ldmVudHMvTG9hZGVyRXZlbnRcIjtcbmltcG9ydCB7VVJMUmVxdWVzdH1cdFx0XHRcdFx0ZnJvbSBcImF3YXlqcy1jb3JlL2xpYi9uZXQvVVJMUmVxdWVzdFwiO1xuaW1wb3J0IHtBc3NldExpYnJhcnl9XHRcdFx0XHRcdGZyb20gXCJhd2F5anMtY29yZS9saWIvbGlicmFyeS9Bc3NldExpYnJhcnlcIjtcbmltcG9ydCB7TG9hZGVyfVx0XHRcdFx0XHRcdGZyb20gXCJhd2F5anMtY29yZS9saWIvbGlicmFyeS9Mb2FkZXJcIjtcbmltcG9ydCB7UmVxdWVzdEFuaW1hdGlvbkZyYW1lfVx0XHRmcm9tIFwiYXdheWpzLWNvcmUvbGliL3V0aWxzL1JlcXVlc3RBbmltYXRpb25GcmFtZVwiO1xuaW1wb3J0IHtEZWJ1Z31cdFx0XHRcdFx0XHRmcm9tIFwiYXdheWpzLWNvcmUvbGliL3V0aWxzL0RlYnVnXCI7XG5cbmltcG9ydCB7Vmlld31cdFx0XHRcdFx0XHRcdGZyb20gXCJhd2F5anMtZGlzcGxheS9saWIvVmlld1wiO1xuaW1wb3J0IHtTa3lib3h9XHRcdFx0XHRcdFx0ZnJvbSBcImF3YXlqcy1kaXNwbGF5L2xpYi9kaXNwbGF5L1NreWJveFwiO1xuXG5pbXBvcnQge0RlZmF1bHRSZW5kZXJlcn1cdFx0XHRcdGZyb20gXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvRGVmYXVsdFJlbmRlcmVyXCI7XG5cbmNsYXNzIEN1YmVUZXh0dXJlc1xue1xuXHRwcml2YXRlIF92aWV3OlZpZXc7XG5cdHByaXZhdGUgX3RpbWVyOlJlcXVlc3RBbmltYXRpb25GcmFtZTtcblxuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHREZWJ1Zy5MT0dfUElfRVJST1JTICAgID0gZmFsc2U7XG5cdFx0RGVidWcuVEhST1dfRVJST1JTICAgICA9IGZhbHNlO1xuXG5cdFx0dGhpcy5fdmlldyA9IG5ldyBWaWV3KG5ldyBEZWZhdWx0UmVuZGVyZXIoKSk7XG5cdFx0dGhpcy5fdmlldy5jYW1lcmEueiA9IC01MDA7XG5cdFx0dGhpcy5fdmlldy5jYW1lcmEueVx0PSAyNTA7XG5cdFx0dGhpcy5fdmlldy5jYW1lcmEucm90YXRpb25YID0gMjA7XG5cdFx0dGhpcy5fdmlldy5jYW1lcmEucHJvamVjdGlvbi5uZWFyID0gMC41O1xuXHRcdHRoaXMuX3ZpZXcuY2FtZXJhLnByb2plY3Rpb24uZmFyID0gMTQwMDA7XG5cdFx0dGhpcy5fdmlldy5iYWNrZ3JvdW5kQ29sb3IgPSAweDJjMmMzMjtcblxuXHRcdHZhciBzZXNzaW9uOkxvYWRlciA9IEFzc2V0TGlicmFyeS5nZXRMb2FkZXIoKTtcblx0XHRzZXNzaW9uLmFkZEV2ZW50TGlzdGVuZXIoTG9hZGVyRXZlbnQuTE9BRF9DT01QTEVURSwgKGV2ZW50OkxvYWRlckV2ZW50KSA9PiB0aGlzLm9uTG9hZENvbXBsZXRlKGV2ZW50KSk7XG5cdFx0c2Vzc2lvbi5sb2FkKG5ldyBVUkxSZXF1ZXN0KCdhc3NldHMvU2luZ2xlQ3ViZVRleHR1cmVUZXN0LmN1YmUnKSk7XG5cblx0XHR3aW5kb3cub25yZXNpemUgPSAoZXZlbnQ6VUlFdmVudCkgPT4gdGhpcy5vblJlc2l6ZShldmVudCk7XG5cblx0XHR0aGlzLm9uUmVzaXplKCk7XG5cblx0XHR0aGlzLl90aW1lciA9IG5ldyBSZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5yZW5kZXIsIHRoaXMpO1xuXHRcdHRoaXMuX3RpbWVyLnN0YXJ0KCk7XG5cdH1cblxuXHRwdWJsaWMgb25Mb2FkQ29tcGxldGUoZXZlbnQ6TG9hZGVyRXZlbnQpXG5cdHtcblx0XHR2YXIgbG9hZGVyOkxvYWRlciA9IDxMb2FkZXI+IGV2ZW50LnRhcmdldDtcblxuXHRcdHN3aXRjaChldmVudC51cmwpIHtcblx0XHRcdGNhc2UgJ2Fzc2V0cy9TaW5nbGVDdWJlVGV4dHVyZVRlc3QuY3ViZSc6XG5cdFx0XHRcdHRoaXMuX3ZpZXcuc2NlbmUuYWRkQ2hpbGQobmV3IFNreWJveCg8Qml0bWFwSW1hZ2VDdWJlPiBsb2FkZXIuYmFzZURlcGVuZGVuY3kuYXNzZXRzWzBdKSk7XG5cblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSByZW5kZXIoZHQ6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5fdmlldy5jYW1lcmEucm90YXRpb25ZICs9IDAuMDEgKiBkdDtcblx0XHR0aGlzLl92aWV3LnJlbmRlcigpO1xuXHR9XG5cblx0cHVibGljIG9uUmVzaXplKGV2ZW50OlVJRXZlbnQgPSBudWxsKVxuXHR7XG5cdFx0dGhpcy5fdmlldy55ID0gMDtcblx0XHR0aGlzLl92aWV3LnggPSAwO1xuXHRcdHRoaXMuX3ZpZXcud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcblx0XHR0aGlzLl92aWV3LmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblx0fVxufSJdLCJzb3VyY2VSb290IjoiLi90ZXN0cyJ9
