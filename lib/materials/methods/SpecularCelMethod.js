var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SpecularCompositeMethod = require("awayjs-renderergl/lib/materials/methods/SpecularCompositeMethod");
/**
 * SpecularCelMethod provides a shading method to add specular cel (cartoon) shading.
 */
var SpecularCelMethod = (function (_super) {
    __extends(SpecularCelMethod, _super);
    /**
     * Creates a new SpecularCelMethod object.
     * @param specularCutOff The threshold at which the specular highlight should be shown.
     * @param baseMethod An optional specular method on which the cartoon shading is based. If ommitted, SpecularBasicMethod is used.
     */
    function SpecularCelMethod(specularCutOff, baseMethod) {
        var _this = this;
        if (specularCutOff === void 0) { specularCutOff = .5; }
        if (baseMethod === void 0) { baseMethod = null; }
        _super.call(this, null, baseMethod);
        this._smoothness = .1;
        this._specularCutOff = .1;
        this.baseMethod._iModulateMethod = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) { return _this.clampSpecular(shaderObject, methodVO, targetReg, registerCache, sharedRegisters); };
        this._specularCutOff = specularCutOff;
    }
    Object.defineProperty(SpecularCelMethod.prototype, "smoothness", {
        /**
         * The smoothness of the highlight edge.
         */
        get: function () {
            return this._smoothness;
        },
        set: function (value) {
            this._smoothness = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpecularCelMethod.prototype, "specularCutOff", {
        /**
         * The threshold at which the specular highlight should be shown.
         */
        get: function () {
            return this._specularCutOff;
        },
        set: function (value) {
            this._specularCutOff = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    SpecularCelMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        _super.prototype.iActivate.call(this, shaderObject, methodVO, stage);
        var index = methodVO.secondaryFragmentConstantsIndex;
        var data = shaderObject.fragmentConstantData;
        data[index] = this._smoothness;
        data[index + 1] = this._specularCutOff;
    };
    /**
     * @inheritDoc
     */
    SpecularCelMethod.prototype.iCleanCompilationData = function () {
        _super.prototype.iCleanCompilationData.call(this);
        this._dataReg = null;
    };
    /**
     * Snaps the specular shading strength of the wrapped method to zero or one, depending on whether or not it exceeds the specularCutOff
     * @param vo The MethodVO used to compile the current shader.
     * @param t The register containing the specular strength in the "w" component, and either the half-vector or the reflection vector in "xyz".
     * @param regCache The register cache used for the shader compilation.
     * @param sharedRegisters The shared register data for this shader.
     * @return The AGAL fragment code for the method.
     */
    SpecularCelMethod.prototype.clampSpecular = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        return "sub " + targetReg + ".y, " + targetReg + ".w, " + this._dataReg + ".y\n" + "div " + targetReg + ".y, " + targetReg + ".y, " + this._dataReg + ".x\n" + "sat " + targetReg + ".y, " + targetReg + ".y\n" + "sge " + targetReg + ".w, " + targetReg + ".w, " + this._dataReg + ".y\n" + "mul " + targetReg + ".w, " + targetReg + ".w, " + targetReg + ".y\n";
    };
    /**
     * @inheritDoc
     */
    SpecularCelMethod.prototype.iGetFragmentPreLightingCode = function (shaderObject, methodVO, registerCache, sharedRegisters) {
        this._dataReg = registerCache.getFreeFragmentConstant();
        methodVO.secondaryFragmentConstantsIndex = this._dataReg.index * 4;
        return _super.prototype.iGetFragmentPreLightingCode.call(this, shaderObject, methodVO, registerCache, sharedRegisters);
    };
    return SpecularCelMethod;
})(SpecularCompositeMethod);
module.exports = SpecularCelMethod;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1hdGVyaWFscy9tZXRob2RzL3NwZWN1bGFyY2VsbWV0aG9kLnRzIl0sIm5hbWVzIjpbIlNwZWN1bGFyQ2VsTWV0aG9kIiwiU3BlY3VsYXJDZWxNZXRob2QuY29uc3RydWN0b3IiLCJTcGVjdWxhckNlbE1ldGhvZC5zbW9vdGhuZXNzIiwiU3BlY3VsYXJDZWxNZXRob2Quc3BlY3VsYXJDdXRPZmYiLCJTcGVjdWxhckNlbE1ldGhvZC5pQWN0aXZhdGUiLCJTcGVjdWxhckNlbE1ldGhvZC5pQ2xlYW5Db21waWxhdGlvbkRhdGEiLCJTcGVjdWxhckNlbE1ldGhvZC5jbGFtcFNwZWN1bGFyIiwiU3BlY3VsYXJDZWxNZXRob2QuaUdldEZyYWdtZW50UHJlTGlnaHRpbmdDb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFTQSxJQUFPLHVCQUF1QixXQUFhLGlFQUFpRSxDQUFDLENBQUM7QUFFOUcsQUFHQTs7R0FERztJQUNHLGlCQUFpQjtJQUFTQSxVQUExQkEsaUJBQWlCQSxVQUFnQ0E7SUFNdERBOzs7O09BSUdBO0lBQ0hBLFNBWEtBLGlCQUFpQkEsQ0FXVkEsY0FBMEJBLEVBQUVBLFVBQXFDQTtRQVg5RUMsaUJBK0ZDQTtRQXBGWUEsOEJBQTBCQSxHQUExQkEsbUJBQTBCQTtRQUFFQSwwQkFBcUNBLEdBQXJDQSxpQkFBcUNBO1FBRTVFQSxrQkFBTUEsSUFBSUEsRUFBRUEsVUFBVUEsQ0FBQ0EsQ0FBQ0E7UUFWakJBLGdCQUFXQSxHQUFVQSxFQUFFQSxDQUFDQTtRQUN4QkEsb0JBQWVBLEdBQVVBLEVBQUVBLENBQUNBO1FBV25DQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxnQkFBZ0JBLEdBQUdBLFVBQUNBLFlBQTZCQSxFQUFFQSxRQUFpQkEsRUFBRUEsU0FBK0JBLEVBQUVBLGFBQWlDQSxFQUFFQSxlQUFrQ0EsSUFBS0EsT0FBQUEsS0FBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsWUFBWUEsRUFBRUEsUUFBUUEsRUFBRUEsU0FBU0EsRUFBRUEsYUFBYUEsRUFBRUEs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QUFDQSwyQkFBMkJBLFlBQUNBLFlBQVlBLEVBQUVBLFFBQVFBLEVBQUVBLGFBQWFBLEVBQUVBLGVBQWVBLENBQUNBLENBQUNBO0lBQ2xHQSxDQUFDQTtJQUNGUCx3QkFBQ0E7QUFBREEsQ0EvRkEsQUErRkNBLEVBL0YrQix1QkFBdUIsRUErRnREO0FBRUQsQUFBMkIsaUJBQWxCLGlCQUFpQixDQUFDIiwiZmlsZSI6Im1hdGVyaWFscy9tZXRob2RzL1NwZWN1bGFyQ2VsTWV0aG9kLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9yb2JiYXRlbWFuL1dlYnN0b3JtUHJvamVjdHMvYXdheWpzLXJlbmRlcmVyZ2wvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFN0YWdlXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvY29yZS9iYXNlL1N0YWdlXCIpO1xuaW1wb3J0IE1ldGhvZFZPXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL01ldGhvZFZPXCIpO1xuaW1wb3J0IFNoYWRlckxpZ2h0aW5nT2JqZWN0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL1NoYWRlckxpZ2h0aW5nT2JqZWN0XCIpO1xuaW1wb3J0IFNoYWRlck9iamVjdEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJPYmplY3RCYXNlXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyQ2FjaGVcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJDYWNoZVwiKTtcbmltcG9ydCBTaGFkZXJSZWdpc3RlckRhdGFcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJEYXRhXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRWxlbWVudFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJFbGVtZW50XCIpO1xuaW1wb3J0IFNwZWN1bGFyQmFzaWNNZXRob2RcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9TcGVjdWxhckJhc2ljTWV0aG9kXCIpO1xuXG5pbXBvcnQgU3BlY3VsYXJDb21wb3NpdGVNZXRob2RcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvU3BlY3VsYXJDb21wb3NpdGVNZXRob2RcIik7XG5cbi8qKlxuICogU3BlY3VsYXJDZWxNZXRob2QgcHJvdmlkZXMgYSBzaGFkaW5nIG1ldGhvZCB0byBhZGQgc3BlY3VsYXIgY2VsIChjYXJ0b29uKSBzaGFkaW5nLlxuICovXG5jbGFzcyBTcGVjdWxhckNlbE1ldGhvZCBleHRlbmRzIFNwZWN1bGFyQ29tcG9zaXRlTWV0aG9kXG57XG5cdHByaXZhdGUgX2RhdGFSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50O1xuXHRwcml2YXRlIF9zbW9vdGhuZXNzOm51bWJlciA9IC4xO1xuXHRwcml2YXRlIF9zcGVjdWxhckN1dE9mZjpudW1iZXIgPSAuMTtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBTcGVjdWxhckNlbE1ldGhvZCBvYmplY3QuXG5cdCAqIEBwYXJhbSBzcGVjdWxhckN1dE9mZiBUaGUgdGhyZXNob2xkIGF0IHdoaWNoIHRoZSBzcGVjdWxhciBoaWdobGlnaHQgc2hvdWxkIGJlIHNob3duLlxuXHQgKiBAcGFyYW0gYmFzZU1ldGhvZCBBbiBvcHRpb25hbCBzcGVjdWxhciBtZXRob2Qgb24gd2hpY2ggdGhlIGNhcnRvb24gc2hhZGluZyBpcyBiYXNlZC4gSWYgb21taXR0ZWQsIFNwZWN1bGFyQmFzaWNNZXRob2QgaXMgdXNlZC5cblx0ICovXG5cdGNvbnN0cnVjdG9yKHNwZWN1bGFyQ3V0T2ZmOm51bWJlciA9IC41LCBiYXNlTWV0aG9kOlNwZWN1bGFyQmFzaWNNZXRob2QgPSBudWxsKVxuXHR7XG5cdFx0c3VwZXIobnVsbCwgYmFzZU1ldGhvZCk7XG5cblx0XHR0aGlzLmJhc2VNZXRob2QuX2lNb2R1bGF0ZU1ldGhvZCA9IChzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgbWV0aG9kVk86TWV0aG9kVk8sIHRhcmdldFJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSkgPT4gdGhpcy5jbGFtcFNwZWN1bGFyKHNoYWRlck9iamVjdCwgbWV0aG9kVk8sIHRhcmdldFJlZywgcmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzKTtcblxuXHRcdHRoaXMuX3NwZWN1bGFyQ3V0T2ZmID0gc3BlY3VsYXJDdXRPZmY7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIHNtb290aG5lc3Mgb2YgdGhlIGhpZ2hsaWdodCBlZGdlLlxuXHQgKi9cblx0cHVibGljIGdldCBzbW9vdGhuZXNzKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fc21vb3RobmVzcztcblx0fVxuXG5cdHB1YmxpYyBzZXQgc21vb3RobmVzcyh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl9zbW9vdGhuZXNzID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIHRocmVzaG9sZCBhdCB3aGljaCB0aGUgc3BlY3VsYXIgaGlnaGxpZ2h0IHNob3VsZCBiZSBzaG93bi5cblx0ICovXG5cdHB1YmxpYyBnZXQgc3BlY3VsYXJDdXRPZmYoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9zcGVjdWxhckN1dE9mZjtcblx0fVxuXG5cdHB1YmxpYyBzZXQgc3BlY3VsYXJDdXRPZmYodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5fc3BlY3VsYXJDdXRPZmYgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlBY3RpdmF0ZShzaGFkZXJPYmplY3Q6U2hhZGVyTGlnaHRpbmdPYmplY3QsIG1ldGhvZFZPOk1ldGhvZFZPLCBzdGFnZTpTdGFnZSlcblx0e1xuXHRcdHN1cGVyLmlBY3RpdmF0ZShzaGFkZXJPYmplY3QsIG1ldGhvZFZPLCBzdGFnZSk7XG5cblx0XHR2YXIgaW5kZXg6bnVtYmVyIC8qaW50Ki8gPSBtZXRob2RWTy5zZWNvbmRhcnlGcmFnbWVudENvbnN0YW50c0luZGV4O1xuXHRcdHZhciBkYXRhOkFycmF5PG51bWJlcj4gPSBzaGFkZXJPYmplY3QuZnJhZ21lbnRDb25zdGFudERhdGE7XG5cdFx0ZGF0YVtpbmRleF0gPSB0aGlzLl9zbW9vdGhuZXNzO1xuXHRcdGRhdGFbaW5kZXggKyAxXSA9IHRoaXMuX3NwZWN1bGFyQ3V0T2ZmO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUNsZWFuQ29tcGlsYXRpb25EYXRhKClcblx0e1xuXHRcdHN1cGVyLmlDbGVhbkNvbXBpbGF0aW9uRGF0YSgpO1xuXHRcdHRoaXMuX2RhdGFSZWcgPSBudWxsO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNuYXBzIHRoZSBzcGVjdWxhciBzaGFkaW5nIHN0cmVuZ3RoIG9mIHRoZSB3cmFwcGVkIG1ldGhvZCB0byB6ZXJvIG9yIG9uZSwgZGVwZW5kaW5nIG9uIHdoZXRoZXIgb3Igbm90IGl0IGV4Y2VlZHMgdGhlIHNwZWN1bGFyQ3V0T2ZmXG5cdCAqIEBwYXJhbSB2byBUaGUgTWV0aG9kVk8gdXNlZCB0byBjb21waWxlIHRoZSBjdXJyZW50IHNoYWRlci5cblx0ICogQHBhcmFtIHQgVGhlIHJlZ2lzdGVyIGNvbnRhaW5pbmcgdGhlIHNwZWN1bGFyIHN0cmVuZ3RoIGluIHRoZSBcIndcIiBjb21wb25lbnQsIGFuZCBlaXRoZXIgdGhlIGhhbGYtdmVjdG9yIG9yIHRoZSByZWZsZWN0aW9uIHZlY3RvciBpbiBcInh5elwiLlxuXHQgKiBAcGFyYW0gcmVnQ2FjaGUgVGhlIHJlZ2lzdGVyIGNhY2hlIHVzZWQgZm9yIHRoZSBzaGFkZXIgY29tcGlsYXRpb24uXG5cdCAqIEBwYXJhbSBzaGFyZWRSZWdpc3RlcnMgVGhlIHNoYXJlZCByZWdpc3RlciBkYXRhIGZvciB0aGlzIHNoYWRlci5cblx0ICogQHJldHVybiBUaGUgQUdBTCBmcmFnbWVudCBjb2RlIGZvciB0aGUgbWV0aG9kLlxuXHQgKi9cblx0cHJpdmF0ZSBjbGFtcFNwZWN1bGFyKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTywgdGFyZ2V0UmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCwgcmVnaXN0ZXJDYWNoZTpTaGFkZXJSZWdpc3RlckNhY2hlLCBzaGFyZWRSZWdpc3RlcnM6U2hhZGVyUmVnaXN0ZXJEYXRhKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiBcInN1YiBcIiArIHRhcmdldFJlZyArIFwiLnksIFwiICsgdGFyZ2V0UmVnICsgXCIudywgXCIgKyB0aGlzLl9kYXRhUmVnICsgXCIueVxcblwiICsgLy8geCAtIGN1dG9mZlxuXHRcdFx0XCJkaXYgXCIgKyB0YXJnZXRSZWcgKyBcIi55LCBcIiArIHRhcmdldFJlZyArIFwiLnksIFwiICsgdGhpcy5fZGF0YVJlZyArIFwiLnhcXG5cIiArIC8vICh4IC0gY3V0b2ZmKS9lcHNpbG9uXG5cdFx0XHRcInNhdCBcIiArIHRhcmdldFJlZyArIFwiLnksIFwiICsgdGFyZ2V0UmVnICsgXCIueVxcblwiICtcblx0XHRcdFwic2dlIFwiICsgdGFyZ2V0UmVnICsgXCIudywgXCIgKyB0YXJnZXRSZWcgKyBcIi53LCBcIiArIHRoaXMuX2RhdGFSZWcgKyBcIi55XFxuXCIgK1xuXHRcdFx0XCJtdWwgXCIgKyB0YXJnZXRSZWcgKyBcIi53LCBcIiArIHRhcmdldFJlZyArIFwiLncsIFwiICsgdGFyZ2V0UmVnICsgXCIueVxcblwiO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUdldEZyYWdtZW50UHJlTGlnaHRpbmdDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJMaWdodGluZ09iamVjdCwgbWV0aG9kVk86TWV0aG9kVk8sIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHR0aGlzLl9kYXRhUmVnID0gcmVnaXN0ZXJDYWNoZS5nZXRGcmVlRnJhZ21lbnRDb25zdGFudCgpO1xuXHRcdG1ldGhvZFZPLnNlY29uZGFyeUZyYWdtZW50Q29uc3RhbnRzSW5kZXggPSB0aGlzLl9kYXRhUmVnLmluZGV4KjQ7XG5cblx0XHRyZXR1cm4gc3VwZXIuaUdldEZyYWdtZW50UHJlTGlnaHRpbmdDb2RlKHNoYWRlck9iamVjdCwgbWV0aG9kVk8sIHJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVycyk7XG5cdH1cbn1cblxuZXhwb3J0ID0gU3BlY3VsYXJDZWxNZXRob2Q7Il19