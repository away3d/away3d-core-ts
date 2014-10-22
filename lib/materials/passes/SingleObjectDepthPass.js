var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TriangleSubGeometry = require("awayjs-core/lib/core/base/TriangleSubGeometry");
var Matrix3D = require("awayjs-core/lib/core/geom/Matrix3D");
var RenderTexture = require("awayjs-core/lib/textures/RenderTexture");
var ContextGLProgramType = require("awayjs-stagegl/lib/core/stagegl/ContextGLProgramType");
var MaterialPassBase = require("awayjs-stagegl/lib/materials/passes/MaterialPassBase");
/**
 * The SingleObjectDepthPass provides a material pass that renders a single object to a depth map from the point
 * of view from a light.
 */
var SingleObjectDepthPass = (function (_super) {
    __extends(SingleObjectDepthPass, _super);
    /**
     * Creates a new SingleObjectDepthPass object.
     */
    function SingleObjectDepthPass() {
        _super.call(this);
        this._textureSize = 512;
        this._polyOffset = Array(15, 0, 0, 0);
        this._projectionTexturesInvalid = true;
        //this._pNumUsedStreams = 2;
        //this._pNumUsedVertexConstants = 7;
        //this._enc = Array<number>(1.0, 255.0, 65025.0, 16581375.0, 1.0/255.0, 1.0/255.0, 1.0/255.0, 0.0);
        //
        //this._pAnimatableAttributes = Array<string>("va0", "va1");
        //this._pAnimationTargetRegisters = Array<string>("vt0", "vt1");
    }
    Object.defineProperty(SingleObjectDepthPass.prototype, "textureSize", {
        /**
         * The size of the depth map texture to render to.
         */
        get: function () {
            return this._textureSize;
        },
        set: function (value) {
            this._textureSize = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SingleObjectDepthPass.prototype, "polyOffset", {
        /**
         * The amount by which the rendered object will be inflated, to prevent depth map rounding errors.
         */
        get: function () {
            return this._polyOffset[0];
        },
        set: function (value) {
            this._polyOffset[0] = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    SingleObjectDepthPass.prototype.dispose = function () {
        if (this._textures) {
            for (var key in this._textures) {
                var texture = this._textures[key];
                texture.dispose();
            }
            this._textures = null;
        }
    };
    /**
     * Updates the projection textures used to contain the depth renders.
     */
    SingleObjectDepthPass.prototype.updateProjectionTextures = function () {
        if (this._textures) {
            for (var key in this._textures) {
                var texture = this._textures[key];
                texture.dispose();
            }
        }
        this._textures = new Object();
        this._projections = new Object();
        this._projectionTexturesInvalid = false;
    };
    /**
     * @inheritDoc
     */
    SingleObjectDepthPass.prototype._iGetVertexCode = function () {
        var code;
        // offset
        code = "mul vt7, vt1, vc4.x	\n" + "add vt7, vt7, vt0\n" + "mov vt7.w, vt0.w\n";
        // project
        code += "m44 vt2, vt7, vc0\n" + "mov op, vt2\n";
        // perspective divide
        code += "div v0, vt2, vt2.w\n";
        return code;
    };
    /**
     * @inheritDoc
     */
    SingleObjectDepthPass.prototype._iGetFragmentCode = function (shaderObject, registerCache, sharedRegisters) {
        var code = "";
        // encode float -> rgba
        code += "mul ft0, fc0, v0.z\n" + "frc ft0, ft0\n" + "mul ft1, ft0.yzww, fc1\n" + "sub ft0, ft0, ft1\n" + "mov oc, ft0\n";
        return code;
    };
    /**
     * Gets the depth maps rendered for this object from all lights.
     * @param renderable The renderable for which to retrieve the depth maps.
     * @param stage3DProxy The Stage3DProxy object currently used for rendering.
     * @return A list of depth map textures for all supported lights.
     */
    SingleObjectDepthPass.prototype._iGetDepthMap = function (renderable) {
        return this._textures[renderable.materialOwner.id];
    };
    /**
     * Retrieves the depth map projection maps for all lights.
     * @param renderable The renderable for which to retrieve the projection maps.
     * @return A list of projection maps for all supported lights.
     */
    SingleObjectDepthPass.prototype._iGetProjection = function (renderable) {
        return this._projections[renderable.materialOwner.id];
    };
    /**
     * @inheritDoc
     */
    SingleObjectDepthPass.prototype._iRender = function (pass, renderable, stage, camera, viewProjection) {
        var matrix;
        var context = stage.context;
        var len /*uint*/;
        var light;
        var lights = this._pLightPicker.allPickedLights;
        var rId = renderable.materialOwner.id;
        if (!this._textures[rId])
            this._textures[rId] = new RenderTexture(this._textureSize, this._textureSize);
        if (!this._projections[rId])
            this._projections[rId] = new Matrix3D();
        len = lights.length;
        // local position = enough
        light = lights[0];
        matrix = light.iGetObjectProjectionMatrix(renderable.sourceEntity, camera, this._projections[rId]);
        context.setRenderTarget(this._textures[rId], true);
        context.clear(1.0, 1.0, 1.0);
        context.setProgramConstantsFromMatrix(ContextGLProgramType.VERTEX, 0, matrix, true);
        context.setProgramConstantsFromArray(ContextGLProgramType.FRAGMENT, 0, this._enc, 2);
        context.activateBuffer(0, renderable.getVertexData(TriangleSubGeometry.POSITION_DATA), renderable.getVertexOffset(TriangleSubGeometry.POSITION_DATA), TriangleSubGeometry.POSITION_FORMAT);
        context.activateBuffer(1, renderable.getVertexData(TriangleSubGeometry.NORMAL_DATA), renderable.getVertexOffset(TriangleSubGeometry.NORMAL_DATA), TriangleSubGeometry.NORMAL_FORMAT);
        context.drawTriangles(context.getIndexBuffer(renderable.getIndexData()), 0, renderable.numTriangles);
    };
    /**
     * @inheritDoc
     */
    SingleObjectDepthPass.prototype._iActivate = function (pass, stage, camera) {
        if (this._projectionTexturesInvalid)
            this.updateProjectionTextures();
        // never scale
        _super.prototype._iActivate.call(this, pass, stage, camera);
        stage.context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, 4, this._polyOffset, 1);
    };
    return SingleObjectDepthPass;
})(MaterialPassBase);
module.exports = SingleObjectDepthPass;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1hdGVyaWFscy9wYXNzZXMvc2luZ2xlb2JqZWN0ZGVwdGhwYXNzLnRzIl0sIm5hbWVzIjpbIlNpbmdsZU9iamVjdERlcHRoUGFzcyIsIlNpbmdsZU9iamVjdERlcHRoUGFzcy5jb25zdHJ1Y3RvciIsIlNpbmdsZU9iamVjdERlcHRoUGFzcy50ZXh0dXJlU2l6ZSIsIlNpbmdsZU9iamVjdERlcHRoUGFzcy5wb2x5T2Zmc2V0IiwiU2luZ2xlT2JqZWN0RGVwdGhQYXNzLmRpc3Bvc2UiLCJTaW5nbGVPYmplY3REZXB0aFBhc3MudXBkYXRlUHJvamVjdGlvblRleHR1cmVzIiwiU2luZ2xlT2JqZWN0RGVwdGhQYXNzLl9pR2V0VmVydGV4Q29kZSIsIlNpbmdsZU9iamVjdERlcHRoUGFzcy5faUdldEZyYWdtZW50Q29kZSIsIlNpbmdsZU9iamVjdERlcHRoUGFzcy5faUdldERlcHRoTWFwIiwiU2luZ2xlT2JqZWN0RGVwdGhQYXNzLl9pR2V0UHJvamVjdGlvbiIsIlNpbmdsZU9iamVjdERlcHRoUGFzcy5faVJlbmRlciIsIlNpbmdsZU9iamVjdERlcHRoUGFzcy5faUFjdGl2YXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSxJQUFPLG1CQUFtQixXQUFjLCtDQUErQyxDQUFDLENBQUM7QUFDekYsSUFBTyxRQUFRLFdBQWlCLG9DQUFvQyxDQUFDLENBQUM7QUFHdEUsSUFBTyxhQUFhLFdBQWUsd0NBQXdDLENBQUMsQ0FBQztBQUs3RSxJQUFPLG9CQUFvQixXQUFjLHNEQUFzRCxDQUFDLENBQUM7QUFNakcsSUFBTyxnQkFBZ0IsV0FBZSxzREFBc0QsQ0FBQyxDQUFDO0FBRTlGLEFBSUE7OztHQURHO0lBQ0cscUJBQXFCO0lBQVNBLFVBQTlCQSxxQkFBcUJBLFVBQXlCQTtJQW1DbkRBOztPQUVHQTtJQUNIQSxTQXRDS0EscUJBQXFCQTtRQXdDekJDLGlCQUFPQSxDQUFDQTtRQXBDREEsaUJBQVlBLEdBQW1CQSxHQUFHQSxDQUFDQTtRQUNuQ0EsZ0JBQVdBLEdBQWlC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Q0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDckhBLENBQUNBO0lBQ0ZYLDRCQUFDQTtBQUFEQSxDQTNMQSxBQTJMQ0EsRUEzTG1DLGdCQUFnQixFQTJMbkQ7QUFFRCxBQUErQixpQkFBdEIscUJBQXFCLENBQUMiLCJmaWxlIjoibWF0ZXJpYWxzL3Bhc3Nlcy9TaW5nbGVPYmplY3REZXB0aFBhc3MuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL3JvYmJhdGVtYW4vV2Vic3Rvcm1Qcm9qZWN0cy9hd2F5anMtcmVuZGVyZXJnbC8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTGlnaHRCYXNlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2NvcmUvYmFzZS9MaWdodEJhc2VcIik7XG5pbXBvcnQgVHJpYW5nbGVTdWJHZW9tZXRyeVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2NvcmUvYmFzZS9UcmlhbmdsZVN1Ykdlb21ldHJ5XCIpO1xuaW1wb3J0IE1hdHJpeDNEXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvY29yZS9nZW9tL01hdHJpeDNEXCIpO1xuaW1wb3J0IENhbWVyYVx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2VudGl0aWVzL0NhbWVyYVwiKTtcbmltcG9ydCBNYXRlcmlhbEJhc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbWF0ZXJpYWxzL01hdGVyaWFsQmFzZVwiKTtcbmltcG9ydCBSZW5kZXJUZXh0dXJlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi90ZXh0dXJlcy9SZW5kZXJUZXh0dXJlXCIpO1xuXG5pbXBvcnQgU3RhZ2VcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9jb3JlL2Jhc2UvU3RhZ2VcIik7XG5pbXBvcnQgTWF0ZXJpYWxQYXNzRGF0YVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvY29yZS9wb29sL01hdGVyaWFsUGFzc0RhdGFcIik7XG5pbXBvcnQgUmVuZGVyYWJsZUJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2NvcmUvcG9vbC9SZW5kZXJhYmxlQmFzZVwiKTtcbmltcG9ydCBDb250ZXh0R0xQcm9ncmFtVHlwZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2NvcmUvc3RhZ2VnbC9Db250ZXh0R0xQcm9ncmFtVHlwZVwiKTtcbmltcG9ydCBJQ29udGV4dFN0YWdlR0xcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2NvcmUvc3RhZ2VnbC9JQ29udGV4dFN0YWdlR0xcIik7XG5pbXBvcnQgTWV0aG9kVk9cdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vTWV0aG9kVk9cIik7XG5pbXBvcnQgU2hhZGVyT2JqZWN0QmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL1NoYWRlck9iamVjdEJhc2VcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJDYWNoZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckNhY2hlXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRGF0YVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckRhdGFcIik7XG5pbXBvcnQgTWF0ZXJpYWxQYXNzQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL3Bhc3Nlcy9NYXRlcmlhbFBhc3NCYXNlXCIpO1xuXG4vKipcbiAqIFRoZSBTaW5nbGVPYmplY3REZXB0aFBhc3MgcHJvdmlkZXMgYSBtYXRlcmlhbCBwYXNzIHRoYXQgcmVuZGVycyBhIHNpbmdsZSBvYmplY3QgdG8gYSBkZXB0aCBtYXAgZnJvbSB0aGUgcG9pbnRcbiAqIG9mIHZpZXcgZnJvbSBhIGxpZ2h0LlxuICovXG5jbGFzcyBTaW5nbGVPYmplY3REZXB0aFBhc3MgZXh0ZW5kcyBNYXRlcmlhbFBhc3NCYXNlXG57XG5cdHByaXZhdGUgX3RleHR1cmVzOk9iamVjdDtcblx0cHJpdmF0ZSBfcHJvamVjdGlvbnM6T2JqZWN0O1xuXHRwcml2YXRlIF90ZXh0dXJlU2l6ZTpudW1iZXIgLyp1aW50Ki8gPSA1MTI7XG5cdHByaXZhdGUgX3BvbHlPZmZzZXQ6QXJyYXk8bnVtYmVyPiA9IEFycmF5PG51bWJlcj4oMTUsIDAsIDAsIDApO1xuXHRwcml2YXRlIF9lbmM6QXJyYXk8bnVtYmVyPjtcblx0cHJpdmF0ZSBfcHJvamVjdGlvblRleHR1cmVzSW52YWxpZDpCb29sZWFuID0gdHJ1ZTtcblxuXHQvKipcblx0ICogVGhlIHNpemUgb2YgdGhlIGRlcHRoIG1hcCB0ZXh0dXJlIHRvIHJlbmRlciB0by5cblx0ICovXG5cdHB1YmxpYyBnZXQgdGV4dHVyZVNpemUoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl90ZXh0dXJlU2l6ZTtcblx0fVxuXG5cdHB1YmxpYyBzZXQgdGV4dHVyZVNpemUodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5fdGV4dHVyZVNpemUgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgYW1vdW50IGJ5IHdoaWNoIHRoZSByZW5kZXJlZCBvYmplY3Qgd2lsbCBiZSBpbmZsYXRlZCwgdG8gcHJldmVudCBkZXB0aCBtYXAgcm91bmRpbmcgZXJyb3JzLlxuXHQgKi9cblx0cHVibGljIGdldCBwb2x5T2Zmc2V0KCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fcG9seU9mZnNldFswXTtcblx0fVxuXG5cdHB1YmxpYyBzZXQgcG9seU9mZnNldCh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl9wb2x5T2Zmc2V0WzBdID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBTaW5nbGVPYmplY3REZXB0aFBhc3Mgb2JqZWN0LlxuXHQgKi9cblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cdFx0c3VwZXIoKTtcblxuXHRcdC8vdGhpcy5fcE51bVVzZWRTdHJlYW1zID0gMjtcblx0XHQvL3RoaXMuX3BOdW1Vc2VkVmVydGV4Q29uc3RhbnRzID0gNztcblx0XHQvL3RoaXMuX2VuYyA9IEFycmF5PG51bWJlcj4oMS4wLCAyNTUuMCwgNjUwMjUuMCwgMTY1ODEzNzUuMCwgMS4wLzI1NS4wLCAxLjAvMjU1LjAsIDEuMC8yNTUuMCwgMC4wKTtcblx0XHQvL1xuXHRcdC8vdGhpcy5fcEFuaW1hdGFibGVBdHRyaWJ1dGVzID0gQXJyYXk8c3RyaW5nPihcInZhMFwiLCBcInZhMVwiKTtcblx0XHQvL3RoaXMuX3BBbmltYXRpb25UYXJnZXRSZWdpc3RlcnMgPSBBcnJheTxzdHJpbmc+KFwidnQwXCIsIFwidnQxXCIpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgZGlzcG9zZSgpXG5cdHtcblx0XHRpZiAodGhpcy5fdGV4dHVyZXMpIHtcblx0XHRcdGZvciAodmFyIGtleSBpbiB0aGlzLl90ZXh0dXJlcykge1xuXHRcdFx0XHR2YXIgdGV4dHVyZTpSZW5kZXJUZXh0dXJlID0gdGhpcy5fdGV4dHVyZXNba2V5XTtcblx0XHRcdFx0dGV4dHVyZS5kaXNwb3NlKCk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl90ZXh0dXJlcyA9IG51bGw7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFVwZGF0ZXMgdGhlIHByb2plY3Rpb24gdGV4dHVyZXMgdXNlZCB0byBjb250YWluIHRoZSBkZXB0aCByZW5kZXJzLlxuXHQgKi9cblx0cHJpdmF0ZSB1cGRhdGVQcm9qZWN0aW9uVGV4dHVyZXMoKVxuXHR7XG5cdFx0aWYgKHRoaXMuX3RleHR1cmVzKSB7XG5cdFx0XHRmb3IgKHZhciBrZXkgaW4gdGhpcy5fdGV4dHVyZXMpIHtcblx0XHRcdFx0dmFyIHRleHR1cmU6UmVuZGVyVGV4dHVyZSA9IHRoaXMuX3RleHR1cmVzW2tleV07XG5cdFx0XHRcdHRleHR1cmUuZGlzcG9zZSgpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuX3RleHR1cmVzID0gbmV3IE9iamVjdCgpO1xuXHRcdHRoaXMuX3Byb2plY3Rpb25zID0gbmV3IE9iamVjdCgpO1xuXHRcdHRoaXMuX3Byb2plY3Rpb25UZXh0dXJlc0ludmFsaWQgPSBmYWxzZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIF9pR2V0VmVydGV4Q29kZSgpOnN0cmluZ1xuXHR7XG5cdFx0dmFyIGNvZGU6c3RyaW5nO1xuXHRcdC8vIG9mZnNldFxuXHRcdGNvZGUgPSBcIm11bCB2dDcsIHZ0MSwgdmM0LnhcdFxcblwiICtcblx0XHRcdFx0XCJhZGQgdnQ3LCB2dDcsIHZ0MFxcblwiICtcblx0XHRcdFx0XCJtb3YgdnQ3LncsIHZ0MC53XFxuXCI7XG5cdFx0Ly8gcHJvamVjdFxuXHRcdGNvZGUgKz0gXCJtNDQgdnQyLCB2dDcsIHZjMFxcblwiICtcblx0XHRcdFx0XCJtb3Ygb3AsIHZ0MlxcblwiO1xuXG5cdFx0Ly8gcGVyc3BlY3RpdmUgZGl2aWRlXG5cdFx0Y29kZSArPSBcImRpdiB2MCwgdnQyLCB2dDIud1xcblwiO1xuXG5cdFx0cmV0dXJuIGNvZGU7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBfaUdldEZyYWdtZW50Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHZhciBjb2RlOnN0cmluZyA9IFwiXCI7XG5cblx0XHQvLyBlbmNvZGUgZmxvYXQgLT4gcmdiYVxuXHRcdGNvZGUgKz0gXCJtdWwgZnQwLCBmYzAsIHYwLnpcXG5cIiArXG5cdFx0XHRcdFwiZnJjIGZ0MCwgZnQwXFxuXCIgK1xuXHRcdFx0XHRcIm11bCBmdDEsIGZ0MC55end3LCBmYzFcXG5cIiArXG5cdFx0XHRcdFwic3ViIGZ0MCwgZnQwLCBmdDFcXG5cIiArXG5cdFx0XHRcdFwibW92IG9jLCBmdDBcXG5cIjtcblxuXHRcdHJldHVybiBjb2RlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgdGhlIGRlcHRoIG1hcHMgcmVuZGVyZWQgZm9yIHRoaXMgb2JqZWN0IGZyb20gYWxsIGxpZ2h0cy5cblx0ICogQHBhcmFtIHJlbmRlcmFibGUgVGhlIHJlbmRlcmFibGUgZm9yIHdoaWNoIHRvIHJldHJpZXZlIHRoZSBkZXB0aCBtYXBzLlxuXHQgKiBAcGFyYW0gc3RhZ2UzRFByb3h5IFRoZSBTdGFnZTNEUHJveHkgb2JqZWN0IGN1cnJlbnRseSB1c2VkIGZvciByZW5kZXJpbmcuXG5cdCAqIEByZXR1cm4gQSBsaXN0IG9mIGRlcHRoIG1hcCB0ZXh0dXJlcyBmb3IgYWxsIHN1cHBvcnRlZCBsaWdodHMuXG5cdCAqL1xuXHRwdWJsaWMgX2lHZXREZXB0aE1hcChyZW5kZXJhYmxlOlJlbmRlcmFibGVCYXNlKTpSZW5kZXJUZXh0dXJlXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fdGV4dHVyZXNbcmVuZGVyYWJsZS5tYXRlcmlhbE93bmVyLmlkXTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIGRlcHRoIG1hcCBwcm9qZWN0aW9uIG1hcHMgZm9yIGFsbCBsaWdodHMuXG5cdCAqIEBwYXJhbSByZW5kZXJhYmxlIFRoZSByZW5kZXJhYmxlIGZvciB3aGljaCB0byByZXRyaWV2ZSB0aGUgcHJvamVjdGlvbiBtYXBzLlxuXHQgKiBAcmV0dXJuIEEgbGlzdCBvZiBwcm9qZWN0aW9uIG1hcHMgZm9yIGFsbCBzdXBwb3J0ZWQgbGlnaHRzLlxuXHQgKi9cblx0cHVibGljIF9pR2V0UHJvamVjdGlvbihyZW5kZXJhYmxlOlJlbmRlcmFibGVCYXNlKTpNYXRyaXgzRFxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3Byb2plY3Rpb25zW3JlbmRlcmFibGUubWF0ZXJpYWxPd25lci5pZF07XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBfaVJlbmRlcihwYXNzOk1hdGVyaWFsUGFzc0RhdGEsIHJlbmRlcmFibGU6UmVuZGVyYWJsZUJhc2UsIHN0YWdlOlN0YWdlLCBjYW1lcmE6Q2FtZXJhLCB2aWV3UHJvamVjdGlvbjpNYXRyaXgzRClcblx0e1xuXHRcdHZhciBtYXRyaXg6TWF0cml4M0Q7XG5cdFx0dmFyIGNvbnRleHQ6SUNvbnRleHRTdGFnZUdMID0gPElDb250ZXh0U3RhZ2VHTD4gc3RhZ2UuY29udGV4dDtcblx0XHR2YXIgbGVuOm51bWJlciAvKnVpbnQqLztcblx0XHR2YXIgbGlnaHQ6TGlnaHRCYXNlO1xuXHRcdHZhciBsaWdodHM6QXJyYXk8TGlnaHRCYXNlPiA9IHRoaXMuX3BMaWdodFBpY2tlci5hbGxQaWNrZWRMaWdodHM7XG5cdFx0dmFyIHJJZDpudW1iZXIgPSByZW5kZXJhYmxlLm1hdGVyaWFsT3duZXIuaWQ7XG5cblx0XHRpZiAoIXRoaXMuX3RleHR1cmVzW3JJZF0pXG5cdFx0XHR0aGlzLl90ZXh0dXJlc1tySWRdID0gbmV3IFJlbmRlclRleHR1cmUodGhpcy5fdGV4dHVyZVNpemUsIHRoaXMuX3RleHR1cmVTaXplKTtcblxuXHRcdGlmICghdGhpcy5fcHJvamVjdGlvbnNbcklkXSlcblx0XHRcdHRoaXMuX3Byb2plY3Rpb25zW3JJZF0gPSBuZXcgTWF0cml4M0QoKTtcblxuXHRcdGxlbiA9IGxpZ2h0cy5sZW5ndGg7XG5cblx0XHQvLyBsb2NhbCBwb3NpdGlvbiA9IGVub3VnaFxuXHRcdGxpZ2h0ID0gbGlnaHRzWzBdO1xuXG5cdFx0bWF0cml4ID0gbGlnaHQuaUdldE9iamVjdFByb2plY3Rpb25NYXRyaXgocmVuZGVyYWJsZS5zb3VyY2VFbnRpdHksIGNhbWVyYSwgdGhpcy5fcHJvamVjdGlvbnNbcklkXSk7XG5cblx0XHRjb250ZXh0LnNldFJlbmRlclRhcmdldCh0aGlzLl90ZXh0dXJlc1tySWRdLCB0cnVlKTtcblx0XHRjb250ZXh0LmNsZWFyKDEuMCwgMS4wLCAxLjApO1xuXHRcdGNvbnRleHQuc2V0UHJvZ3JhbUNvbnN0YW50c0Zyb21NYXRyaXgoQ29udGV4dEdMUHJvZ3JhbVR5cGUuVkVSVEVYLCAwLCBtYXRyaXgsIHRydWUpO1xuXHRcdGNvbnRleHQuc2V0UHJvZ3JhbUNvbnN0YW50c0Zyb21BcnJheShDb250ZXh0R0xQcm9ncmFtVHlwZS5GUkFHTUVOVCwgMCwgdGhpcy5fZW5jLCAyKTtcblxuXHRcdGNvbnRleHQuYWN0aXZhdGVCdWZmZXIoMCwgcmVuZGVyYWJsZS5nZXRWZXJ0ZXhEYXRhKFRyaWFuZ2xlU3ViR2VvbWV0cnkuUE9TSVRJT05fREFUQSksIHJlbmRlcmFibGUuZ2V0VmVydGV4T2Zmc2V0KFRyaWFuZ2xlU3ViR2VvbWV0cnkuUE9TSVRJT05fREFUQSksIFRyaWFuZ2xlU3ViR2VvbWV0cnkuUE9TSVRJT05fRk9STUFUKTtcblx0XHRjb250ZXh0LmFjdGl2YXRlQnVmZmVyKDEsIHJlbmRlcmFibGUuZ2V0VmVydGV4RGF0YShUcmlhbmdsZVN1Ykdlb21ldHJ5Lk5PUk1BTF9EQVRBKSwgcmVuZGVyYWJsZS5nZXRWZXJ0ZXhPZmZzZXQoVHJpYW5nbGVTdWJHZW9tZXRyeS5OT1JNQUxfREFUQSksIFRyaWFuZ2xlU3ViR2VvbWV0cnkuTk9STUFMX0ZPUk1BVCk7XG5cdFx0Y29udGV4dC5kcmF3VHJpYW5nbGVzKGNvbnRleHQuZ2V0SW5kZXhCdWZmZXIocmVuZGVyYWJsZS5nZXRJbmRleERhdGEoKSksIDAsIHJlbmRlcmFibGUubnVtVHJpYW5nbGVzKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIF9pQWN0aXZhdGUocGFzczpNYXRlcmlhbFBhc3NEYXRhLCBzdGFnZTpTdGFnZSwgY2FtZXJhOkNhbWVyYSlcblx0e1xuXHRcdGlmICh0aGlzLl9wcm9qZWN0aW9uVGV4dHVyZXNJbnZhbGlkKVxuXHRcdFx0dGhpcy51cGRhdGVQcm9qZWN0aW9uVGV4dHVyZXMoKTtcblxuXHRcdC8vIG5ldmVyIHNjYWxlXG5cdFx0c3VwZXIuX2lBY3RpdmF0ZShwYXNzLCBzdGFnZSwgY2FtZXJhKTtcblxuXHRcdCg8SUNvbnRleHRTdGFnZUdMPiBzdGFnZS5jb250ZXh0KS5zZXRQcm9ncmFtQ29uc3RhbnRzRnJvbUFycmF5KENvbnRleHRHTFByb2dyYW1UeXBlLlZFUlRFWCwgNCwgdGhpcy5fcG9seU9mZnNldCwgMSk7XG5cdH1cbn1cblxuZXhwb3J0ID0gU2luZ2xlT2JqZWN0RGVwdGhQYXNzOyJdfQ==