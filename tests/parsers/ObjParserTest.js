var View = require("awayjs-core/lib/containers/View");
var Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
var AssetLibrary = require("awayjs-core/lib/core/library/AssetLibrary");
var URLRequest = require("awayjs-core/lib/core/net/URLRequest");
var AssetEvent = require("awayjs-core/lib/events/AssetEvent");
var LoaderEvent = require("awayjs-core/lib/events/LoaderEvent");
var Debug = require("awayjs-core/lib/utils/Debug");
var RequestAnimationFrame = require("awayjs-core/lib/utils/RequestAnimationFrame");
var DefaultRenderer = require("awayjs-stagegl/lib/core/render/DefaultRenderer");
var OBJParser = require("awayjs-renderergl/lib/parsers/OBJParser");
/**
 *
 */
var ObjParserTest = (function () {
    function ObjParserTest() {
        var _this = this;
        Debug.LOG_PI_ERRORS = true;
        Debug.THROW_ERRORS = false;
        AssetLibrary.enableParser(OBJParser);
        this._token = AssetLibrary.load(new URLRequest('assets/t800.obj'));
        this._token.addEventListener(LoaderEvent.RESOURCE_COMPLETE, function (event) { return _this.onResourceComplete(event); });
        this._token.addEventListener(AssetEvent.ASSET_COMPLETE, function (event) { return _this.onAssetComplete(event); });
        this._view = new View(new DefaultRenderer());
        this._timer = new RequestAnimationFrame(this.render, this);
        window.onresize = function (event) { return _this.resize(event); };
        this._timer.start();
        this.resize();
    }
    ObjParserTest.prototype.resize = function (event) {
        if (event === void 0) { event = null; }
        this._view.y = 0;
        this._view.x = 0;
        this._view.width = window.innerWidth;
        this._view.height = window.innerHeight;
    };
    ObjParserTest.prototype.render = function (dt) {
        if (this._t800)
            this._t800.rotationY += 1;
        this._view.render();
    };
    ObjParserTest.prototype.onAssetComplete = function (event) {
        console.log('------------------------------------------------------------------------------');
        console.log('events.AssetEvent.ASSET_COMPLETE', AssetLibrary.getAsset(event.asset.name));
        console.log('------------------------------------------------------------------------------');
    };
    ObjParserTest.prototype.onResourceComplete = function (event) {
        console.log('------------------------------------------------------------------------------');
        console.log('events.LoaderEvent.RESOURCE_COMPLETE', event);
        console.log('------------------------------------------------------------------------------');
        console.log(AssetLibrary.getAsset('Mesh_g0'));
        this._t800 = AssetLibrary.getAsset('Mesh_g0');
        this._t800.y = -200;
        this._t800.transform.scale = new Vector3D(4, 4, 4);
        this._view.scene.addChild(this._t800);
    };
    return ObjParserTest;
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhcnNlcnMvb2JqcGFyc2VydGVzdC50cyJdLCJuYW1lcyI6WyJPYmpQYXJzZXJUZXN0IiwiT2JqUGFyc2VyVGVzdC5jb25zdHJ1Y3RvciIsIk9ialBhcnNlclRlc3QucmVzaXplIiwiT2JqUGFyc2VyVGVzdC5yZW5kZXIiLCJPYmpQYXJzZXJUZXN0Lm9uQXNzZXRDb21wbGV0ZSIsIk9ialBhcnNlclRlc3Qub25SZXNvdXJjZUNvbXBsZXRlIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFPLElBQUksV0FBaUIsaUNBQWlDLENBQUMsQ0FBQztBQUMvRCxJQUFPLFFBQVEsV0FBZ0Isb0NBQW9DLENBQUMsQ0FBQztBQUNyRSxJQUFPLFlBQVksV0FBZSwyQ0FBMkMsQ0FBQyxDQUFDO0FBRy9FLElBQU8sVUFBVSxXQUFlLHFDQUFxQyxDQUFDLENBQUM7QUFFdkUsSUFBTyxVQUFVLFdBQWUsbUNBQW1DLENBQUMsQ0FBQztBQUNyRSxJQUFPLFdBQVcsV0FBZSxvQ0FBb0MsQ0FBQyxDQUFDO0FBQ3ZFLElBQU8sS0FBSyxXQUFnQiw2QkFBNkIsQ0FBQyxDQUFDO0FBQzNELElBQU8scUJBQXFCLFdBQVksNkNBQTZDLENBQUMsQ0FBQztBQUV2RixJQUFPLGVBQWUsV0FBYyxnREFBZ0QsQ0FBQyxDQUFDO0FBRXRGLElBQU8sU0FBUyxXQUFlLHlDQUF5QyxDQUFDLENBQUM7QUFFMUUsQUFHQTs7R0FERztJQUNHLGFBQWE7SUFPbEJBLFNBUEtBLGFBQWFBO1FBQW5CQyxpQkFnRUNBO1FBdkRDQSxLQUFLQSxDQUFDQSxhQUFhQSxHQUFHQSxJQUFJQSxDQUFDQTtRQUMzQkEsS0FBS0EsQ0FBQ0EsWUFBWUEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFFM0JBLFlBQVlBLENBQUNBLFlBQVlBLENBQUNBLFNBQVNBLENBQUNBLENBQUVBO1FBRXRDQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxVQUFVQSxDQUFDQSxpQkFBaUJBLENBQUNBLENB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WUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7UUFDckRBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLENBQUNBO1FBQ3BCQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxRQUFRQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUVuREEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7SUFDdkNBLENBQUNBO0lBQ0ZMLG9CQUFDQTtBQUFEQSxDQWhFQSxBQWdFQ0EsSUFBQSIsImZpbGUiOiJwYXJzZXJzL09ialBhcnNlclRlc3QuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL3JvYmJhdGVtYW4vV2Vic3Rvcm1Qcm9qZWN0cy9hd2F5anMtcmVuZGVyZXJnbC8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVmlld1x0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2NvbnRhaW5lcnMvVmlld1wiKTtcbmltcG9ydCBWZWN0b3IzRFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9jb3JlL2dlb20vVmVjdG9yM0RcIik7XG5pbXBvcnQgQXNzZXRMaWJyYXJ5XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9jb3JlL2xpYnJhcnkvQXNzZXRMaWJyYXJ5XCIpO1xuaW1wb3J0IEFzc2V0TG9hZGVyXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9jb3JlL2xpYnJhcnkvQXNzZXRMb2FkZXJcIik7XG5pbXBvcnQgQXNzZXRMb2FkZXJUb2tlblx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2NvcmUvbGlicmFyeS9Bc3NldExvYWRlclRva2VuXCIpO1xuaW1wb3J0IFVSTFJlcXVlc3RcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2NvcmUvbmV0L1VSTFJlcXVlc3RcIik7XG5pbXBvcnQgTWVzaFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2VudGl0aWVzL01lc2hcIik7XG5pbXBvcnQgQXNzZXRFdmVudFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZXZlbnRzL0Fzc2V0RXZlbnRcIik7XG5pbXBvcnQgTG9hZGVyRXZlbnRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2V2ZW50cy9Mb2FkZXJFdmVudFwiKTtcbmltcG9ydCBEZWJ1Z1x0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi91dGlscy9EZWJ1Z1wiKTtcbmltcG9ydCBSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3V0aWxzL1JlcXVlc3RBbmltYXRpb25GcmFtZVwiKTtcblxuaW1wb3J0IERlZmF1bHRSZW5kZXJlclx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2NvcmUvcmVuZGVyL0RlZmF1bHRSZW5kZXJlclwiKTtcblxuaW1wb3J0IE9CSlBhcnNlclx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcGFyc2Vycy9PQkpQYXJzZXJcIik7XG5cbi8qKlxuICpcbiAqL1xuY2xhc3MgT2JqUGFyc2VyVGVzdFxue1xuXHRwcml2YXRlIF92aWV3OlZpZXc7XG5cdHByaXZhdGUgX3Rva2VuOkFzc2V0TG9hZGVyVG9rZW47XG5cdHByaXZhdGUgX3RpbWVyOlJlcXVlc3RBbmltYXRpb25GcmFtZTtcblx0cHJpdmF0ZSBfdDgwMDpNZXNoO1xuXG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdERlYnVnLkxPR19QSV9FUlJPUlMgPSB0cnVlO1xuXHRcdERlYnVnLlRIUk9XX0VSUk9SUyA9IGZhbHNlO1xuXG5cdFx0QXNzZXRMaWJyYXJ5LmVuYWJsZVBhcnNlcihPQkpQYXJzZXIpIDtcblxuXHRcdHRoaXMuX3Rva2VuID0gQXNzZXRMaWJyYXJ5LmxvYWQobmV3IFVSTFJlcXVlc3QoJ2Fzc2V0cy90ODAwLm9iaicpKTtcblx0XHR0aGlzLl90b2tlbi5hZGRFdmVudExpc3RlbmVyKExvYWRlckV2ZW50LlJFU09VUkNFX0NPTVBMRVRFLCAoZXZlbnQ6TG9hZGVyRXZlbnQpID0+IHRoaXMub25SZXNvdXJjZUNvbXBsZXRlKGV2ZW50KSk7XG5cdFx0dGhpcy5fdG9rZW4uYWRkRXZlbnRMaXN0ZW5lcihBc3NldEV2ZW50LkFTU0VUX0NPTVBMRVRFLCAoZXZlbnQ6QXNzZXRFdmVudCkgPT4gdGhpcy5vbkFzc2V0Q29tcGxldGUoZXZlbnQpKTtcblxuXHRcdHRoaXMuX3ZpZXcgPSBuZXcgVmlldyhuZXcgRGVmYXVsdFJlbmRlcmVyKCkpO1xuXHRcdHRoaXMuX3RpbWVyID0gbmV3IFJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnJlbmRlciwgdGhpcyk7XG5cblx0XHR3aW5kb3cub25yZXNpemUgPSAoZXZlbnQ6VUlFdmVudCkgPT4gdGhpcy5yZXNpemUoZXZlbnQpO1xuXG5cdFx0dGhpcy5fdGltZXIuc3RhcnQoKTtcblx0XHR0aGlzLnJlc2l6ZSgpO1xuXHR9XG5cblx0cHJpdmF0ZSByZXNpemUoZXZlbnQ6VUlFdmVudCA9IG51bGwpXG5cdHtcblx0XHR0aGlzLl92aWV3LnkgPSAwO1xuXHRcdHRoaXMuX3ZpZXcueCA9IDA7XG5cdFx0dGhpcy5fdmlldy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuXHRcdHRoaXMuX3ZpZXcuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXHR9XG5cblx0cHJpdmF0ZSByZW5kZXIoZHQ6bnVtYmVyKSAvL2FuaW1hdGUgYmFzZWQgb24gZHQgZm9yIGZpcmVmb3hcblx0e1xuXHRcdGlmICh0aGlzLl90ODAwKVxuXHRcdFx0dGhpcy5fdDgwMC5yb3RhdGlvblkgKz0gMTtcblxuXHRcdHRoaXMuX3ZpZXcucmVuZGVyKCk7XG5cdH1cblxuXHRwdWJsaWMgb25Bc3NldENvbXBsZXRlKGV2ZW50OkFzc2V0RXZlbnQpXG5cdHtcblx0XHRjb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XG5cdFx0Y29uc29sZS5sb2coJ2V2ZW50cy5Bc3NldEV2ZW50LkFTU0VUX0NPTVBMRVRFJywgQXNzZXRMaWJyYXJ5LmdldEFzc2V0KGV2ZW50LmFzc2V0Lm5hbWUpKTtcblx0XHRjb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XG5cdH1cblxuXHRwdWJsaWMgb25SZXNvdXJjZUNvbXBsZXRlKGV2ZW50OkxvYWRlckV2ZW50KVxuXHR7XG5cdFx0Y29uc29sZS5sb2coJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xuXHRcdGNvbnNvbGUubG9nKCdldmVudHMuTG9hZGVyRXZlbnQuUkVTT1VSQ0VfQ09NUExFVEUnLCBldmVudCk7XG5cdFx0Y29uc29sZS5sb2coJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xuXG5cdFx0Y29uc29sZS5sb2coQXNzZXRMaWJyYXJ5LmdldEFzc2V0KCdNZXNoX2cwJykpO1xuXG5cdFx0dGhpcy5fdDgwMCA9IDxNZXNoPiBBc3NldExpYnJhcnkuZ2V0QXNzZXQoJ01lc2hfZzAnKTtcblx0XHR0aGlzLl90ODAwLnkgPSAtMjAwO1xuXHRcdHRoaXMuX3Q4MDAudHJhbnNmb3JtLnNjYWxlID0gbmV3IFZlY3RvcjNEKDQsIDQsIDQpO1xuXG5cdFx0dGhpcy5fdmlldy5zY2VuZS5hZGRDaGlsZCh0aGlzLl90ODAwKTtcblx0fVxufSJdfQ==