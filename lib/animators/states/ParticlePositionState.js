var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ContextGLVertexBufferFormat = require("awayjs-stagegl/lib/core/stagegl/ContextGLVertexBufferFormat");
var ParticlePropertiesMode = require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
var ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
/**
 * ...
 * @author ...
 */
var ParticlePositionState = (function (_super) {
    __extends(ParticlePositionState, _super);
    function ParticlePositionState(animator, particlePositionNode) {
        _super.call(this, animator, particlePositionNode);
        this._particlePositionNode = particlePositionNode;
        this._position = this._particlePositionNode._iPosition;
    }
    Object.defineProperty(ParticlePositionState.prototype, "position", {
        /**
         * Defines the position of the particle when in global mode. Defaults to 0,0,0.
         */
        get: function () {
            return this._position;
        },
        set: function (value) {
            this._position = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    ParticlePositionState.prototype.getPositions = function () {
        return this._pDynamicProperties;
    };
    ParticlePositionState.prototype.setPositions = function (value) {
        this._pDynamicProperties = value;
        this._pDynamicPropertiesDirty = new Object();
    };
    /**
     * @inheritDoc
     */
    ParticlePositionState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
        if (this._particlePositionNode.mode == ParticlePropertiesMode.LOCAL_DYNAMIC && !this._pDynamicPropertiesDirty[animationSubGeometry._iUniqueId])
            this._pUpdateDynamicProperties(animationSubGeometry);
        var index = animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticlePositionState.POSITION_INDEX);
        if (this._particlePositionNode.mode == ParticlePropertiesMode.GLOBAL)
            animationRegisterCache.setVertexConst(index, this._position.x, this._position.y, this._position.z);
        else
            animationSubGeometry.activateVertexBuffer(index, this._particlePositionNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
    };
    /** @private */
    ParticlePositionState.POSITION_INDEX = 0;
    return ParticlePositionState;
})(ParticleStateBase);
module.exports = ParticlePositionState;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuaW1hdG9ycy9zdGF0ZXMvcGFydGljbGVwb3NpdGlvbnN0YXRlLnRzIl0sIm5hbWVzIjpbIlBhcnRpY2xlUG9zaXRpb25TdGF0ZSIsIlBhcnRpY2xlUG9zaXRpb25TdGF0ZS5jb25zdHJ1Y3RvciIsIlBhcnRpY2xlUG9zaXRpb25TdGF0ZS5wb3NpdGlvbiIsIlBhcnRpY2xlUG9zaXRpb25TdGF0ZS5nZXRQb3NpdGlvbnMiLCJQYXJ0aWNsZVBvc2l0aW9uU3RhdGUuc2V0UG9zaXRpb25zIiwiUGFydGljbGVQb3NpdGlvblN0YXRlLnNldFJlbmRlclN0YXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFNQSxJQUFPLDJCQUEyQixXQUFZLDZEQUE2RCxDQUFDLENBQUM7QUFJN0csSUFBTyxzQkFBc0IsV0FBYSw2REFBNkQsQ0FBQyxDQUFDO0FBRXpHLElBQU8saUJBQWlCLFdBQWMsMERBQTBELENBQUMsQ0FBQztBQUVsRyxBQUlBOzs7R0FERztJQUNHLHFCQUFxQjtJQUFTQSxVQUE5QkEscUJBQXFCQSxVQUEwQkE7SUFvQ3BEQSxTQXBDS0EscUJBQXFCQSxDQW9DZEEsUUFBeUJBLEVBQUVBLG9CQUF5Q0E7UUFFL0VDLGtCQUFNQSxRQUFRQSxFQUFFQSxvQkFBb0JBLENBQUNBLENBQUNBO1FBRXRDQSxJQUFJQSxDQUFDQSxxQkFBcUJBLEdBQUdBLG9CQUFvQkEsQ0FBQ0E7UUFDbERBLElBQUlBLENBQUNBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBLHFCQUFxQkEsQ0FBQ0EsVUFBVUEsQ0FBQ0E7SUFDeERBLENBQUNBO0lBL0JERCxzQkFBV0EsMkNBQVFBO1FBSG5CQTs7V0FFR0E7YUFDSEE7WUFFQ0UsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0E7UUFDdkJBLENBQUNBO2FBRURGLFVBQW9CQSxLQUFjQTtZQUVqQ0UsSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDeEJBLENBQUNBOzs7T0FMQUY7SUFPREE7O09BRUdBO0lBQ0lBLDRDQUFZQSxHQUFuQkE7UUFFQ0csTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsbUJBQW1CQSxDQUFDQTtJQUNqQ0EsQ0FBQ0E7SUFFTUgsNENBQVlBLEdBQW5CQSxVQUFvQkEsS0FBcUJBO1FBRXhDSSxJQUFJQSxDQUFDQSxtQkFBbUJBLEdBQUdBLEtBQUtBLENBQUNBO1FBRWpDQSxJQUFJQSxDQUFDQSx3QkFBd0JBLEdBQUdBLElBQUlBLE1BQU1BLEVBQUVBLENBQUNBO0lBQzlDQSxDQUFDQTtJQVVESjs7T0FFR0E7SUFDSUEsOENBQWNBLEdBQXJCQSxVQUFzQkEsS0FBV0EsRUFBRUEsVUFBeUJBLEVBQUVBLG9CQUF5Q0EsRUFBRUEsc0JBQTZDQSxFQUFFQSxNQUFhQTtRQUVwS0ssRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EscUJBQXFCQSxDQUFDQSxJQUFJQSxJQUFJQSxzQkFBc0JBLENBQUNBLGFBQWFBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLHdCQUF3QkEsQ0FBQ0Esb0JBQW9CQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQTtZQUM5SUEsSUFBSUEsQ0FBQ0EseUJBQXlCQSxDQUFDQSxvQkFBb0JBLENBQUNBLENBQUNBO1FBRXREQSxJQUFJQSxLQUFLQSxHQUFrQkEsc0JBQXNCQSxDQUFDQSxnQkFBZ0JBLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLEVBQUVBLHFCQUFxQkEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsQ0FBQ0E7UUFFL0hBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLHFCQUFxQkEsQ0FBQ0EsSUFBSUEsSUFBSUEsc0JBQXNCQSxDQUFDQSxNQUFNQSxDQUFDQTtZQUNwRUEsc0JBQXNCQSxDQUFDQSxjQUFjQSxDQUFDQSxLQUFLQSxFQUFFQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxFQUFFQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxFQUFFQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUNwR0EsSUFBSUE7WUFDSEEsb0JBQW9CQSxDQUFDQSxvQkFBb0JBLENBQUNBLEtBQUtBLEVBQUVBLElBQUlBLENBQUNBLHFCQUFxQkEsQ0FBQ0EsWUFBWUEsRUFBRUEsS0FBS0EsRUFBRUEsMkJBQTJCQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtJQUN4SUEsQ0FBQ0E7SUF4RERMLGVBQWVBO0lBQ0RBLG9DQUFjQSxHQUFtQkEsQ0FBQ0EsQ0FBQ0E7SUF3RGxEQSw0QkFBQ0E7QUFBREEsQ0EzREEsQUEyRENBLEVBM0RtQyxpQkFBaUIsRUEyRHBEO0FBRUQsQUFBK0IsaUJBQXRCLHFCQUFxQixDQUFDIiwiZmlsZSI6ImFuaW1hdG9ycy9zdGF0ZXMvUGFydGljbGVQb3NpdGlvblN0YXRlLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9yb2JiYXRlbWFuL1dlYnN0b3JtUHJvamVjdHMvYXdheWpzLXJlbmRlcmVyZ2wvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZlY3RvcjNEXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvY29yZS9nZW9tL1ZlY3RvcjNEXCIpO1xuaW1wb3J0IENhbWVyYVx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2VudGl0aWVzL0NhbWVyYVwiKTtcblxuaW1wb3J0IEFuaW1hdGlvblJlZ2lzdGVyQ2FjaGVcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYW5pbWF0b3JzL2RhdGEvQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZVwiKTtcbmltcG9ydCBTdGFnZVx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2NvcmUvYmFzZS9TdGFnZVwiKTtcbmltcG9ydCBSZW5kZXJhYmxlQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvY29yZS9wb29sL1JlbmRlcmFibGVCYXNlXCIpO1xuaW1wb3J0IENvbnRleHRHTFZlcnRleEJ1ZmZlckZvcm1hdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvY29yZS9zdGFnZWdsL0NvbnRleHRHTFZlcnRleEJ1ZmZlckZvcm1hdFwiKTtcblxuaW1wb3J0IFBhcnRpY2xlQW5pbWF0b3JcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9QYXJ0aWNsZUFuaW1hdG9yXCIpO1xuaW1wb3J0IEFuaW1hdGlvblN1Ykdlb21ldHJ5XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvQW5pbWF0aW9uU3ViR2VvbWV0cnlcIik7XG5pbXBvcnQgUGFydGljbGVQcm9wZXJ0aWVzTW9kZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9QYXJ0aWNsZVByb3BlcnRpZXNNb2RlXCIpO1xuaW1wb3J0IFBhcnRpY2xlUG9zaXRpb25Ob2RlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL25vZGVzL1BhcnRpY2xlUG9zaXRpb25Ob2RlXCIpO1xuaW1wb3J0IFBhcnRpY2xlU3RhdGVCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL3N0YXRlcy9QYXJ0aWNsZVN0YXRlQmFzZVwiKTtcblxuLyoqXG4gKiAuLi5cbiAqIEBhdXRob3IgLi4uXG4gKi9cbmNsYXNzIFBhcnRpY2xlUG9zaXRpb25TdGF0ZSBleHRlbmRzIFBhcnRpY2xlU3RhdGVCYXNlXG57XG5cdC8qKiBAcHJpdmF0ZSAqL1xuXHRwdWJsaWMgc3RhdGljIFBPU0lUSU9OX0lOREVYOm51bWJlciAvKnVpbnQqLyA9IDA7XG5cblx0cHJpdmF0ZSBfcGFydGljbGVQb3NpdGlvbk5vZGU6UGFydGljbGVQb3NpdGlvbk5vZGU7XG5cdHByaXZhdGUgX3Bvc2l0aW9uOlZlY3RvcjNEO1xuXG5cdC8qKlxuXHQgKiBEZWZpbmVzIHRoZSBwb3NpdGlvbiBvZiB0aGUgcGFydGljbGUgd2hlbiBpbiBnbG9iYWwgbW9kZS4gRGVmYXVsdHMgdG8gMCwwLDAuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHBvc2l0aW9uKCk6VmVjdG9yM0Rcblx0e1xuXHRcdHJldHVybiB0aGlzLl9wb3NpdGlvbjtcblx0fVxuXG5cdHB1YmxpYyBzZXQgcG9zaXRpb24odmFsdWU6VmVjdG9yM0QpXG5cdHtcblx0XHR0aGlzLl9wb3NpdGlvbiA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRwdWJsaWMgZ2V0UG9zaXRpb25zKCk6QXJyYXk8VmVjdG9yM0Q+XG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fcER5bmFtaWNQcm9wZXJ0aWVzO1xuXHR9XG5cblx0cHVibGljIHNldFBvc2l0aW9ucyh2YWx1ZTpBcnJheTxWZWN0b3IzRD4pXG5cdHtcblx0XHR0aGlzLl9wRHluYW1pY1Byb3BlcnRpZXMgPSB2YWx1ZTtcblxuXHRcdHRoaXMuX3BEeW5hbWljUHJvcGVydGllc0RpcnR5ID0gbmV3IE9iamVjdCgpO1xuXHR9XG5cblx0Y29uc3RydWN0b3IoYW5pbWF0b3I6UGFydGljbGVBbmltYXRvciwgcGFydGljbGVQb3NpdGlvbk5vZGU6UGFydGljbGVQb3NpdGlvbk5vZGUpXG5cdHtcblx0XHRzdXBlcihhbmltYXRvciwgcGFydGljbGVQb3NpdGlvbk5vZGUpO1xuXG5cdFx0dGhpcy5fcGFydGljbGVQb3NpdGlvbk5vZGUgPSBwYXJ0aWNsZVBvc2l0aW9uTm9kZTtcblx0XHR0aGlzLl9wb3NpdGlvbiA9IHRoaXMuX3BhcnRpY2xlUG9zaXRpb25Ob2RlLl9pUG9zaXRpb247XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBzZXRSZW5kZXJTdGF0ZShzdGFnZTpTdGFnZSwgcmVuZGVyYWJsZTpSZW5kZXJhYmxlQmFzZSwgYW5pbWF0aW9uU3ViR2VvbWV0cnk6QW5pbWF0aW9uU3ViR2VvbWV0cnksIGFuaW1hdGlvblJlZ2lzdGVyQ2FjaGU6QW5pbWF0aW9uUmVnaXN0ZXJDYWNoZSwgY2FtZXJhOkNhbWVyYSlcblx0e1xuXHRcdGlmICh0aGlzLl9wYXJ0aWNsZVBvc2l0aW9uTm9kZS5tb2RlID09IFBhcnRpY2xlUHJvcGVydGllc01vZGUuTE9DQUxfRFlOQU1JQyAmJiAhdGhpcy5fcER5bmFtaWNQcm9wZXJ0aWVzRGlydHlbYW5pbWF0aW9uU3ViR2VvbWV0cnkuX2lVbmlxdWVJZF0pXG5cdFx0XHR0aGlzLl9wVXBkYXRlRHluYW1pY1Byb3BlcnRpZXMoYW5pbWF0aW9uU3ViR2VvbWV0cnkpO1xuXG5cdFx0dmFyIGluZGV4Om51bWJlciAvKmludCovID0gYW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5nZXRSZWdpc3RlckluZGV4KHRoaXMuX3BBbmltYXRpb25Ob2RlLCBQYXJ0aWNsZVBvc2l0aW9uU3RhdGUuUE9TSVRJT05fSU5ERVgpO1xuXG5cdFx0aWYgKHRoaXMuX3BhcnRpY2xlUG9zaXRpb25Ob2RlLm1vZGUgPT0gUGFydGljbGVQcm9wZXJ0aWVzTW9kZS5HTE9CQUwpXG5cdFx0XHRhbmltYXRpb25SZWdpc3RlckNhY2hlLnNldFZlcnRleENvbnN0KGluZGV4LCB0aGlzLl9wb3NpdGlvbi54LCB0aGlzLl9wb3NpdGlvbi55LCB0aGlzLl9wb3NpdGlvbi56KTtcblx0XHRlbHNlXG5cdFx0XHRhbmltYXRpb25TdWJHZW9tZXRyeS5hY3RpdmF0ZVZlcnRleEJ1ZmZlcihpbmRleCwgdGhpcy5fcGFydGljbGVQb3NpdGlvbk5vZGUuX2lEYXRhT2Zmc2V0LCBzdGFnZSwgQ29udGV4dEdMVmVydGV4QnVmZmVyRm9ybWF0LkZMT0FUXzMpO1xuXHR9XG59XG5cbmV4cG9ydCA9IFBhcnRpY2xlUG9zaXRpb25TdGF0ZTsiXX0=