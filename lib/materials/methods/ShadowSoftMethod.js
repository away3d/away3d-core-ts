var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PoissonLookup = require("awayjs-core/lib/core/geom/PoissonLookup");
var ShadowMethodBase = require("awayjs-stagegl/lib/materials/methods/ShadowMethodBase");
/**
 * ShadowSoftMethod provides a soft shadowing technique by randomly distributing sample points.
 */
var ShadowSoftMethod = (function (_super) {
    __extends(ShadowSoftMethod, _super);
    /**
     * Creates a new DiffuseBasicMethod object.
     *
     * @param castingLight The light casting the shadows
     * @param numSamples The amount of samples to take for dithering. Minimum 1, maximum 32.
     */
    function ShadowSoftMethod(castingLight, numSamples, range) {
        if (numSamples === void 0) { numSamples = 5; }
        if (range === void 0) { range = 1; }
        _super.call(this, castingLight);
        this._range = 1;
        this.numSamples = numSamples;
        this.range = range;
    }
    Object.defineProperty(ShadowSoftMethod.prototype, "numSamples", {
        /**
         * The amount of samples to take for dithering. Minimum 1, maximum 32. The actual maximum may depend on the
         * complexity of the shader.
         */
        get: function () {
            return this._numSamples;
        },
        set: function (value /*int*/) {
            this._numSamples = value;
            if (this._numSamples < 1)
                this._numSamples = 1;
            else if (this._numSamples > 32)
                this._numSamples = 32;
            this._offsets = PoissonLookup.getDistribution(this._numSamples);
            this.iInvalidateShaderProgram();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShadowSoftMethod.prototype, "range", {
        /**
         * The range in the shadow map in which to distribute the samples.
         */
        get: function () {
            return this._range;
        },
        set: function (value) {
            this._range = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    ShadowSoftMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
        _super.prototype.iInitConstants.call(this, shaderObject, methodVO);
        shaderObject.fragmentConstantData[methodVO.fragmentConstantsIndex + 8] = 1 / this._numSamples;
        shaderObject.fragmentConstantData[methodVO.fragmentConstantsIndex + 9] = 0;
    };
    /**
     * @inheritDoc
     */
    ShadowSoftMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        _super.prototype.iActivate.call(this, shaderObject, methodVO, stage);
        var texRange = .5 * this._range / this._pCastingLight.shadowMapper.depthMapSize;
        var data = shaderObject.fragmentConstantData;
        var index = methodVO.fragmentConstantsIndex + 10;
        var len = this._numSamples << 1;
        for (var i = 0; i < len; ++i)
            data[index + i] = this._offsets[i] * texRange;
    };
    /**
     * @inheritDoc
     */
    ShadowSoftMethod.prototype._pGetPlanarFragmentCode = function (methodVO, targetReg, regCache, sharedRegisters) {
        // todo: move some things to super
        var depthMapRegister = regCache.getFreeTextureReg();
        var decReg = regCache.getFreeFragmentConstant();
        var dataReg = regCache.getFreeFragmentConstant();
        var customDataReg = regCache.getFreeFragmentConstant();
        methodVO.fragmentConstantsIndex = decReg.index * 4;
        methodVO.texturesIndex = depthMapRegister.index;
        return this.getSampleCode(regCache, depthMapRegister, decReg, targetReg, customDataReg);
    };
    /**
     * Adds the code for another tap to the shader code.
     * @param uv The uv register for the tap.
     * @param texture The texture register containing the depth map.
     * @param decode The register containing the depth map decoding data.
     * @param target The target register to add the tap comparison result.
     * @param regCache The register cache managing the registers.
     * @return
     */
    ShadowSoftMethod.prototype.addSample = function (uv, texture, decode, target, regCache) {
        var temp = regCache.getFreeFragmentVectorTemp();
        return "tex " + temp + ", " + uv + ", " + texture + " <2d,nearest,clamp>\n" + "dp4 " + temp + ".z, " + temp + ", " + decode + "\n" + "slt " + uv + ".w, " + this._pDepthMapCoordReg + ".z, " + temp + ".z\n" + "add " + target + ".w, " + target + ".w, " + uv + ".w\n";
    };
    /**
     * @inheritDoc
     */
    ShadowSoftMethod.prototype.iActivateForCascade = function (shaderObject, methodVO, stage) {
        _super.prototype.iActivate.call(this, shaderObject, methodVO, stage);
        var texRange = this._range / this._pCastingLight.shadowMapper.depthMapSize;
        var data = shaderObject.fragmentConstantData;
        var index = methodVO.secondaryFragmentConstantsIndex;
        var len = this._numSamples << 1;
        data[index] = 1 / this._numSamples;
        data[index + 1] = 0;
        index += 2;
        for (var i = 0; i < len; ++i)
            data[index + i] = this._offsets[i] * texRange;
        if (len % 4 == 0) {
            data[index + len] = 0;
            data[index + len + 1] = 0;
        }
    };
    /**
     * @inheritDoc
     */
    ShadowSoftMethod.prototype._iGetCascadeFragmentCode = function (shaderObject, methodVO, decodeRegister, depthTexture, depthProjection, targetRegister, registerCache, sharedRegisters) {
        this._pDepthMapCoordReg = depthProjection;
        var dataReg = registerCache.getFreeFragmentConstant();
        methodVO.secondaryFragmentConstantsIndex = dataReg.index * 4;
        return this.getSampleCode(registerCache, depthTexture, decodeRegister, targetRegister, dataReg);
    };
    /**
     * Get the actual shader code for shadow mapping
     * @param regCache The register cache managing the registers.
     * @param depthTexture The texture register containing the depth map.
     * @param decodeRegister The register containing the depth map decoding data.
     * @param targetReg The target register to add the shadow coverage.
     * @param dataReg The register containing additional data.
     */
    ShadowSoftMethod.prototype.getSampleCode = function (regCache, depthTexture, decodeRegister, targetRegister, dataReg) {
        var uvReg;
        var code;
        var offsets = new Array(dataReg + ".zw");
        uvReg = regCache.getFreeFragmentVectorTemp();
        regCache.addFragmentTempUsages(uvReg, 1);
        var temp = regCache.getFreeFragmentVectorTemp();
        var numRegs = this._numSamples >> 1;
        for (var i = 0; i < numRegs; ++i) {
            var reg = regCache.getFreeFragmentConstant();
            offsets.push(reg + ".xy");
            offsets.push(reg + ".zw");
        }
        for (i = 0; i < this._numSamples; ++i) {
            if (i == 0) {
                code = "add " + uvReg + ", " + this._pDepthMapCoordReg + ", " + dataReg + ".zwyy\n" + "tex " + temp + ", " + uvReg + ", " + depthTexture + " <2d,nearest,clamp>\n" + "dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" + "slt " + targetRegister + ".w, " + this._pDepthMapCoordReg + ".z, " + temp + ".z\n"; // 0 if in shadow;
            }
            else {
                code += "add " + uvReg + ".xy, " + this._pDepthMapCoordReg + ".xy, " + offsets[i] + "\n" + this.addSample(uvReg, depthTexture, decodeRegister, targetRegister, regCache);
            }
        }
        regCache.removeFragmentTempUsage(uvReg);
        code += "mul " + targetRegister + ".w, " + targetRegister + ".w, " + dataReg + ".x\n"; // average
        return code;
    };
    return ShadowSoftMethod;
})(ShadowMethodBase);
module.exports = ShadowSoftMethod;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1hdGVyaWFscy9tZXRob2RzL3NoYWRvd3NvZnRtZXRob2QudHMiXSwibmFtZXMiOlsiU2hhZG93U29mdE1ldGhvZCIsIlNoYWRvd1NvZnRNZXRob2QuY29uc3RydWN0b3IiLCJTaGFkb3dTb2Z0TWV0aG9kLm51bVNhbXBsZXMiLCJTaGFkb3dTb2Z0TWV0aG9kLnJhbmdlIiwiU2hhZG93U29mdE1ldGhvZC5pSW5pdENvbnN0YW50cyIsIlNoYWRvd1NvZnRNZXRob2QuaUFjdGl2YXRlIiwiU2hhZG93U29mdE1ldGhvZC5fcEdldFBsYW5hckZyYWdtZW50Q29kZSIsIlNoYWRvd1NvZnRNZXRob2QuYWRkU2FtcGxlIiwiU2hhZG93U29mdE1ldGhvZC5pQWN0aXZhdGVGb3JDYXNjYWRlIiwiU2hhZG93U29mdE1ldGhvZC5faUdldENhc2NhZGVGcmFnbWVudENvZGUiLCJTaGFkb3dTb2Z0TWV0aG9kLmdldFNhbXBsZUNvZGUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQU8sYUFBYSxXQUFlLHlDQUF5QyxDQUFDLENBQUM7QUFTOUUsSUFBTyxnQkFBZ0IsV0FBZSx1REFBdUQsQ0FBQyxDQUFDO0FBRS9GLEFBR0E7O0dBREc7SUFDRyxnQkFBZ0I7SUFBU0EsVUFBekJBLGdCQUFnQkEsVUFBeUJBO0lBTTlDQTs7Ozs7T0FLR0E7SUFDSEEsU0FaS0EsZ0JBQWdCQSxDQVlUQSxZQUE2QkEsRUFBRUEsVUFBNkJBLEVBQUVBLEtBQWdCQTtRQUEvQ0MsMEJBQTZCQSxHQUE3QkEsY0FBNkJBO1FBQUVBLHFCQUFnQkEsR0FBaEJBLFNBQWdCQTtRQUV6RkEsa0JBQU1BLFlBQVlBLENBQUNBLENBQUNBO1FBWmJBLFdBQU1BLEdBQVVBLENBQUNBLENBQUNBO1FBY3pCQSxJQUFJQSxDQUFDQSxVQUFVQSxHQUFHQSxVQUFVQSxDQUFDQTtRQUM3QkEsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0E7SUFDcEJBLENBQUNBO0lBTURELHNCQUFXQSx3Q0FBVUE7UUFK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QUFNQSxHQUFHQSxJQUFJQSxHQUFHQSxNQUFNQSxHQUFHQSxJQUFJQSxHQUFHQSxJQUFJQSxHQUFHQSxjQUFjQSxHQUFHQSxJQUFJQSxHQUM1REEsTUFBTUEsR0FBR0EsY0FBY0EsR0FBR0EsTUFBTUEsR0FBR0EsSUFBSUEsQ0FBQ0Esa0JBQWtCQSxHQUFHQSxNQUFNQSxHQUFHQSxJQUFJQSxHQUFHQSxNQUFNQSxFQUFFQSxrQkFBa0JBO1lBQ3pHQSxDQUFDQSxHQURxRkE7WUFDcEZBLElBQUlBLENBQUNBLENBQUNBO2dCQUNQQSxJQUFJQSxJQUFJQSxNQUFNQSxHQUFHQSxLQUFLQSxHQUFHQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQSxrQkFBa0JBLEdBQUdBLE9BQU9BLEdBQUdBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLEdBQ3ZGQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxFQUFFQSxZQUFZQSxFQUFFQSxjQUFjQSxFQUFFQSxjQUFjQSxFQUFFQSxRQUFRQSxDQUFDQSxDQUFDQTtZQUNoRkEsQ0FBQ0E7UUFDRkEsQ0FBQ0E7UUFFREEsUUFBUUEsQ0FBQ0EsdUJBQXVCQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUV4Q0EsSUFBSUEsSUFBSUEsTUFBTUEsR0FBR0EsY0FBY0EsR0FBR0EsTUFBTUEsR0FBR0EsY0FBY0EsR0FBR0EsTUFBTUEsR0FBR0EsT0FBT0EsR0FBR0EsTUFBTUEsRUFBRUEsVUFBVUE7UUFFakdBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO0lBQ2JBLENBQUNBO0lBQ0ZWLHVCQUFDQTtBQUFEQSxDQXRNQSxBQXNNQ0EsRUF0TThCLGdCQUFnQixFQXNNOUM7QUFFRCxBQUEwQixpQkFBakIsZ0JBQWdCLENBQUMiLCJmaWxlIjoibWF0ZXJpYWxzL21ldGhvZHMvU2hhZG93U29mdE1ldGhvZC5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvcm9iYmF0ZW1hbi9XZWJzdG9ybVByb2plY3RzL2F3YXlqcy1yZW5kZXJlcmdsLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQb2lzc29uTG9va3VwXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9jb3JlL2dlb20vUG9pc3Nvbkxvb2t1cFwiKTtcbmltcG9ydCBEaXJlY3Rpb25hbExpZ2h0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9lbnRpdGllcy9EaXJlY3Rpb25hbExpZ2h0XCIpO1xuXG5pbXBvcnQgU3RhZ2VcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9jb3JlL2Jhc2UvU3RhZ2VcIik7XG5pbXBvcnQgTWV0aG9kVk9cdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vTWV0aG9kVk9cIik7XG5pbXBvcnQgU2hhZGVyT2JqZWN0QmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL1NoYWRlck9iamVjdEJhc2VcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJDYWNoZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckNhY2hlXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRGF0YVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckRhdGFcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJFbGVtZW50XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckVsZW1lbnRcIik7XG5pbXBvcnQgU2hhZG93TWV0aG9kQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvU2hhZG93TWV0aG9kQmFzZVwiKTtcblxuLyoqXG4gKiBTaGFkb3dTb2Z0TWV0aG9kIHByb3ZpZGVzIGEgc29mdCBzaGFkb3dpbmcgdGVjaG5pcXVlIGJ5IHJhbmRvbWx5IGRpc3RyaWJ1dGluZyBzYW1wbGUgcG9pbnRzLlxuICovXG5jbGFzcyBTaGFkb3dTb2Z0TWV0aG9kIGV4dGVuZHMgU2hhZG93TWV0aG9kQmFzZVxue1xuXHRwcml2YXRlIF9yYW5nZTpudW1iZXIgPSAxO1xuXHRwcml2YXRlIF9udW1TYW1wbGVzOm51bWJlciAvKmludCovO1xuXHRwcml2YXRlIF9vZmZzZXRzOkFycmF5PG51bWJlcj47XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgRGlmZnVzZUJhc2ljTWV0aG9kIG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIGNhc3RpbmdMaWdodCBUaGUgbGlnaHQgY2FzdGluZyB0aGUgc2hhZG93c1xuXHQgKiBAcGFyYW0gbnVtU2FtcGxlcyBUaGUgYW1vdW50IG9mIHNhbXBsZXMgdG8gdGFrZSBmb3IgZGl0aGVyaW5nLiBNaW5pbXVtIDEsIG1heGltdW0gMzIuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcihjYXN0aW5nTGlnaHQ6RGlyZWN0aW9uYWxMaWdodCwgbnVtU2FtcGxlczpudW1iZXIgLyppbnQqLyA9IDUsIHJhbmdlOm51bWJlciA9IDEpXG5cdHtcblx0XHRzdXBlcihjYXN0aW5nTGlnaHQpO1xuXG5cdFx0dGhpcy5udW1TYW1wbGVzID0gbnVtU2FtcGxlcztcblx0XHR0aGlzLnJhbmdlID0gcmFuZ2U7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIGFtb3VudCBvZiBzYW1wbGVzIHRvIHRha2UgZm9yIGRpdGhlcmluZy4gTWluaW11bSAxLCBtYXhpbXVtIDMyLiBUaGUgYWN0dWFsIG1heGltdW0gbWF5IGRlcGVuZCBvbiB0aGVcblx0ICogY29tcGxleGl0eSBvZiB0aGUgc2hhZGVyLlxuXHQgKi9cblx0cHVibGljIGdldCBudW1TYW1wbGVzKCk6bnVtYmVyIC8qaW50Ki9cblx0e1xuXHRcdHJldHVybiB0aGlzLl9udW1TYW1wbGVzO1xuXHR9XG5cblx0cHVibGljIHNldCBudW1TYW1wbGVzKHZhbHVlOm51bWJlciAvKmludCovKVxuXHR7XG5cdFx0dGhpcy5fbnVtU2FtcGxlcyA9IHZhbHVlO1xuXHRcdFxuXHRcdGlmICh0aGlzLl9udW1TYW1wbGVzIDwgMSlcblx0XHRcdHRoaXMuX251bVNhbXBsZXMgPSAxO1xuXHRcdGVsc2UgaWYgKHRoaXMuX251bVNhbXBsZXMgPiAzMilcblx0XHRcdHRoaXMuX251bVNhbXBsZXMgPSAzMjtcblxuXHRcdHRoaXMuX29mZnNldHMgPSBQb2lzc29uTG9va3VwLmdldERpc3RyaWJ1dGlvbih0aGlzLl9udW1TYW1wbGVzKTtcblx0XHRcblx0XHR0aGlzLmlJbnZhbGlkYXRlU2hhZGVyUHJvZ3JhbSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSByYW5nZSBpbiB0aGUgc2hhZG93IG1hcCBpbiB3aGljaCB0byBkaXN0cmlidXRlIHRoZSBzYW1wbGVzLlxuXHQgKi9cblx0cHVibGljIGdldCByYW5nZSgpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3JhbmdlO1xuXHR9XG5cblx0cHVibGljIHNldCByYW5nZSh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl9yYW5nZSA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUluaXRDb25zdGFudHMoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIG1ldGhvZFZPOk1ldGhvZFZPKVxuXHR7XG5cdFx0c3VwZXIuaUluaXRDb25zdGFudHMoc2hhZGVyT2JqZWN0LCBtZXRob2RWTyk7XG5cblx0XHRzaGFkZXJPYmplY3QuZnJhZ21lbnRDb25zdGFudERhdGFbbWV0aG9kVk8uZnJhZ21lbnRDb25zdGFudHNJbmRleCArIDhdID0gMS90aGlzLl9udW1TYW1wbGVzO1xuXHRcdHNoYWRlck9iamVjdC5mcmFnbWVudENvbnN0YW50RGF0YVttZXRob2RWTy5mcmFnbWVudENvbnN0YW50c0luZGV4ICsgOV0gPSAwO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUFjdGl2YXRlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTywgc3RhZ2U6U3RhZ2UpXG5cdHtcblx0XHRzdXBlci5pQWN0aXZhdGUoc2hhZGVyT2JqZWN0LCBtZXRob2RWTywgc3RhZ2UpO1xuXG5cdFx0dmFyIHRleFJhbmdlOm51bWJlciA9IC41KnRoaXMuX3JhbmdlL3RoaXMuX3BDYXN0aW5nTGlnaHQuc2hhZG93TWFwcGVyLmRlcHRoTWFwU2l6ZTtcblx0XHR2YXIgZGF0YTpBcnJheTxudW1iZXI+ID0gc2hhZGVyT2JqZWN0LmZyYWdtZW50Q29uc3RhbnREYXRhO1xuXHRcdHZhciBpbmRleDpudW1iZXIgLyp1aW50Ki8gPSBtZXRob2RWTy5mcmFnbWVudENvbnN0YW50c0luZGV4ICsgMTA7XG5cdFx0dmFyIGxlbjpudW1iZXIgLyp1aW50Ki8gPSB0aGlzLl9udW1TYW1wbGVzIDw8IDE7XG5cblx0XHRmb3IgKHZhciBpOm51bWJlciAvKmludCovID0gMDsgaSA8IGxlbjsgKytpKVxuXHRcdFx0ZGF0YVtpbmRleCArIGldID0gdGhpcy5fb2Zmc2V0c1tpXSp0ZXhSYW5nZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIF9wR2V0UGxhbmFyRnJhZ21lbnRDb2RlKG1ldGhvZFZPOk1ldGhvZFZPLCB0YXJnZXRSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCByZWdDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdC8vIHRvZG86IG1vdmUgc29tZSB0aGluZ3MgdG8gc3VwZXJcblx0XHR2YXIgZGVwdGhNYXBSZWdpc3RlcjpTaGFkZXJSZWdpc3RlckVsZW1lbnQgPSByZWdDYWNoZS5nZXRGcmVlVGV4dHVyZVJlZygpO1xuXHRcdHZhciBkZWNSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50ID0gcmVnQ2FjaGUuZ2V0RnJlZUZyYWdtZW50Q29uc3RhbnQoKTtcblx0XHR2YXIgZGF0YVJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQgPSByZWdDYWNoZS5nZXRGcmVlRnJhZ21lbnRDb25zdGFudCgpO1xuXHRcdHZhciBjdXN0b21EYXRhUmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCA9IHJlZ0NhY2hlLmdldEZyZWVGcmFnbWVudENvbnN0YW50KCk7XG5cblx0XHRtZXRob2RWTy5mcmFnbWVudENvbnN0YW50c0luZGV4ID0gZGVjUmVnLmluZGV4KjQ7XG5cdFx0bWV0aG9kVk8udGV4dHVyZXNJbmRleCA9IGRlcHRoTWFwUmVnaXN0ZXIuaW5kZXg7XG5cblx0XHRyZXR1cm4gdGhpcy5nZXRTYW1wbGVDb2RlKHJlZ0NhY2hlLCBkZXB0aE1hcFJlZ2lzdGVyLCBkZWNSZWcsIHRhcmdldFJlZywgY3VzdG9tRGF0YVJlZyk7XG5cdH1cblxuXHQvKipcblx0ICogQWRkcyB0aGUgY29kZSBmb3IgYW5vdGhlciB0YXAgdG8gdGhlIHNoYWRlciBjb2RlLlxuXHQgKiBAcGFyYW0gdXYgVGhlIHV2IHJlZ2lzdGVyIGZvciB0aGUgdGFwLlxuXHQgKiBAcGFyYW0gdGV4dHVyZSBUaGUgdGV4dHVyZSByZWdpc3RlciBjb250YWluaW5nIHRoZSBkZXB0aCBtYXAuXG5cdCAqIEBwYXJhbSBkZWNvZGUgVGhlIHJlZ2lzdGVyIGNvbnRhaW5pbmcgdGhlIGRlcHRoIG1hcCBkZWNvZGluZyBkYXRhLlxuXHQgKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgcmVnaXN0ZXIgdG8gYWRkIHRoZSB0YXAgY29tcGFyaXNvbiByZXN1bHQuXG5cdCAqIEBwYXJhbSByZWdDYWNoZSBUaGUgcmVnaXN0ZXIgY2FjaGUgbWFuYWdpbmcgdGhlIHJlZ2lzdGVycy5cblx0ICogQHJldHVyblxuXHQgKi9cblx0cHJpdmF0ZSBhZGRTYW1wbGUodXY6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCB0ZXh0dXJlOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgZGVjb2RlOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgdGFyZ2V0OlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgcmVnQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSk6c3RyaW5nXG5cdHtcblx0XHR2YXIgdGVtcDpTaGFkZXJSZWdpc3RlckVsZW1lbnQgPSByZWdDYWNoZS5nZXRGcmVlRnJhZ21lbnRWZWN0b3JUZW1wKCk7XG5cdFx0cmV0dXJuIFwidGV4IFwiICsgdGVtcCArIFwiLCBcIiArIHV2ICsgXCIsIFwiICsgdGV4dHVyZSArIFwiIDwyZCxuZWFyZXN0LGNsYW1wPlxcblwiICtcblx0XHRcdFwiZHA0IFwiICsgdGVtcCArIFwiLnosIFwiICsgdGVtcCArIFwiLCBcIiArIGRlY29kZSArIFwiXFxuXCIgK1xuXHRcdFx0XCJzbHQgXCIgKyB1diArIFwiLncsIFwiICsgdGhpcy5fcERlcHRoTWFwQ29vcmRSZWcgKyBcIi56LCBcIiArIHRlbXAgKyBcIi56XFxuXCIgKyAvLyAwIGlmIGluIHNoYWRvd1xuXHRcdFx0XCJhZGQgXCIgKyB0YXJnZXQgKyBcIi53LCBcIiArIHRhcmdldCArIFwiLncsIFwiICsgdXYgKyBcIi53XFxuXCI7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBpQWN0aXZhdGVGb3JDYXNjYWRlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTywgc3RhZ2U6U3RhZ2UpXG5cdHtcblx0XHRzdXBlci5pQWN0aXZhdGUoc2hhZGVyT2JqZWN0LCBtZXRob2RWTywgc3RhZ2UpO1xuXG5cdFx0dmFyIHRleFJhbmdlOm51bWJlciA9IHRoaXMuX3JhbmdlL3RoaXMuX3BDYXN0aW5nTGlnaHQuc2hhZG93TWFwcGVyLmRlcHRoTWFwU2l6ZTtcblx0XHR2YXIgZGF0YTpBcnJheTxudW1iZXI+ID0gc2hhZGVyT2JqZWN0LmZyYWdtZW50Q29uc3RhbnREYXRhO1xuXHRcdHZhciBpbmRleDpudW1iZXIgLyp1aW50Ki8gPSBtZXRob2RWTy5zZWNvbmRhcnlGcmFnbWVudENvbnN0YW50c0luZGV4O1xuXHRcdHZhciBsZW46bnVtYmVyIC8qdWludCovID0gdGhpcy5fbnVtU2FtcGxlcyA8PCAxO1xuXHRcdGRhdGFbaW5kZXhdID0gMS90aGlzLl9udW1TYW1wbGVzO1xuXHRcdGRhdGFbaW5kZXggKyAxXSA9IDA7XG5cdFx0aW5kZXggKz0gMjtcblxuXHRcdGZvciAodmFyIGk6bnVtYmVyIC8qaW50Ki8gPSAwOyBpIDwgbGVuOyArK2kpXG5cdFx0XHRkYXRhW2luZGV4ICsgaV0gPSB0aGlzLl9vZmZzZXRzW2ldKnRleFJhbmdlO1xuXG5cdFx0aWYgKGxlbiU0ID09IDApIHtcblx0XHRcdGRhdGFbaW5kZXggKyBsZW5dID0gMDtcblx0XHRcdGRhdGFbaW5kZXggKyBsZW4gKyAxXSA9IDA7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgX2lHZXRDYXNjYWRlRnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTywgZGVjb2RlUmVnaXN0ZXI6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCBkZXB0aFRleHR1cmU6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCBkZXB0aFByb2plY3Rpb246U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCB0YXJnZXRSZWdpc3RlcjpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHR0aGlzLl9wRGVwdGhNYXBDb29yZFJlZyA9IGRlcHRoUHJvamVjdGlvbjtcblxuXHRcdHZhciBkYXRhUmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCA9IHJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZUZyYWdtZW50Q29uc3RhbnQoKTtcblx0XHRtZXRob2RWTy5zZWNvbmRhcnlGcmFnbWVudENvbnN0YW50c0luZGV4ID0gZGF0YVJlZy5pbmRleCo0O1xuXG5cdFx0cmV0dXJuIHRoaXMuZ2V0U2FtcGxlQ29kZShyZWdpc3RlckNhY2hlLCBkZXB0aFRleHR1cmUsIGRlY29kZVJlZ2lzdGVyLCB0YXJnZXRSZWdpc3RlciwgZGF0YVJlZyk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0IHRoZSBhY3R1YWwgc2hhZGVyIGNvZGUgZm9yIHNoYWRvdyBtYXBwaW5nXG5cdCAqIEBwYXJhbSByZWdDYWNoZSBUaGUgcmVnaXN0ZXIgY2FjaGUgbWFuYWdpbmcgdGhlIHJlZ2lzdGVycy5cblx0ICogQHBhcmFtIGRlcHRoVGV4dHVyZSBUaGUgdGV4dHVyZSByZWdpc3RlciBjb250YWluaW5nIHRoZSBkZXB0aCBtYXAuXG5cdCAqIEBwYXJhbSBkZWNvZGVSZWdpc3RlciBUaGUgcmVnaXN0ZXIgY29udGFpbmluZyB0aGUgZGVwdGggbWFwIGRlY29kaW5nIGRhdGEuXG5cdCAqIEBwYXJhbSB0YXJnZXRSZWcgVGhlIHRhcmdldCByZWdpc3RlciB0byBhZGQgdGhlIHNoYWRvdyBjb3ZlcmFnZS5cblx0ICogQHBhcmFtIGRhdGFSZWcgVGhlIHJlZ2lzdGVyIGNvbnRhaW5pbmcgYWRkaXRpb25hbCBkYXRhLlxuXHQgKi9cblx0cHJpdmF0ZSBnZXRTYW1wbGVDb2RlKHJlZ0NhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIGRlcHRoVGV4dHVyZTpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIGRlY29kZVJlZ2lzdGVyOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgdGFyZ2V0UmVnaXN0ZXI6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCBkYXRhUmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCk6c3RyaW5nXG5cdHtcblx0XHR2YXIgdXZSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50O1xuXHRcdHZhciBjb2RlOnN0cmluZztcblx0XHR2YXIgb2Zmc2V0czpBcnJheTxzdHJpbmc+ID0gbmV3IEFycmF5PHN0cmluZz4oZGF0YVJlZyArIFwiLnp3XCIpO1xuXHRcdHV2UmVnID0gcmVnQ2FjaGUuZ2V0RnJlZUZyYWdtZW50VmVjdG9yVGVtcCgpO1xuXHRcdHJlZ0NhY2hlLmFkZEZyYWdtZW50VGVtcFVzYWdlcyh1dlJlZywgMSk7XG5cblx0XHR2YXIgdGVtcDpTaGFkZXJSZWdpc3RlckVsZW1lbnQgPSByZWdDYWNoZS5nZXRGcmVlRnJhZ21lbnRWZWN0b3JUZW1wKCk7XG5cblx0XHR2YXIgbnVtUmVnczpudW1iZXIgLyppbnQqLyA9IHRoaXMuX251bVNhbXBsZXMgPj4gMTtcblx0XHRmb3IgKHZhciBpOm51bWJlciAvKmludCovID0gMDsgaSA8IG51bVJlZ3M7ICsraSkge1xuXHRcdFx0dmFyIHJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQgPSByZWdDYWNoZS5nZXRGcmVlRnJhZ21lbnRDb25zdGFudCgpO1xuXHRcdFx0b2Zmc2V0cy5wdXNoKHJlZyArIFwiLnh5XCIpO1xuXHRcdFx0b2Zmc2V0cy5wdXNoKHJlZyArIFwiLnp3XCIpO1xuXHRcdH1cblxuXHRcdGZvciAoaSA9IDA7IGkgPCB0aGlzLl9udW1TYW1wbGVzOyArK2kpIHtcblx0XHRcdGlmIChpID09IDApIHtcblx0XHRcdFx0Y29kZSA9IFwiYWRkIFwiICsgdXZSZWcgKyBcIiwgXCIgKyB0aGlzLl9wRGVwdGhNYXBDb29yZFJlZyArIFwiLCBcIiArIGRhdGFSZWcgKyBcIi56d3l5XFxuXCIgK1xuXHRcdFx0XHRcdFwidGV4IFwiICsgdGVtcCArIFwiLCBcIiArIHV2UmVnICsgXCIsIFwiICsgZGVwdGhUZXh0dXJlICsgXCIgPDJkLG5lYXJlc3QsY2xhbXA+XFxuXCIgK1xuXHRcdFx0XHRcdFwiZHA0IFwiICsgdGVtcCArIFwiLnosIFwiICsgdGVtcCArIFwiLCBcIiArIGRlY29kZVJlZ2lzdGVyICsgXCJcXG5cIiArXG5cdFx0XHRcdFx0XCJzbHQgXCIgKyB0YXJnZXRSZWdpc3RlciArIFwiLncsIFwiICsgdGhpcy5fcERlcHRoTWFwQ29vcmRSZWcgKyBcIi56LCBcIiArIHRlbXAgKyBcIi56XFxuXCI7IC8vIDAgaWYgaW4gc2hhZG93O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29kZSArPSBcImFkZCBcIiArIHV2UmVnICsgXCIueHksIFwiICsgdGhpcy5fcERlcHRoTWFwQ29vcmRSZWcgKyBcIi54eSwgXCIgKyBvZmZzZXRzW2ldICsgXCJcXG5cIiArXG5cdFx0XHRcdFx0dGhpcy5hZGRTYW1wbGUodXZSZWcsIGRlcHRoVGV4dHVyZSwgZGVjb2RlUmVnaXN0ZXIsIHRhcmdldFJlZ2lzdGVyLCByZWdDYWNoZSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmVnQ2FjaGUucmVtb3ZlRnJhZ21lbnRUZW1wVXNhZ2UodXZSZWcpO1xuXG5cdFx0Y29kZSArPSBcIm11bCBcIiArIHRhcmdldFJlZ2lzdGVyICsgXCIudywgXCIgKyB0YXJnZXRSZWdpc3RlciArIFwiLncsIFwiICsgZGF0YVJlZyArIFwiLnhcXG5cIjsgLy8gYXZlcmFnZVxuXG5cdFx0cmV0dXJuIGNvZGU7XG5cdH1cbn1cblxuZXhwb3J0ID0gU2hhZG93U29mdE1ldGhvZDsiXX0=