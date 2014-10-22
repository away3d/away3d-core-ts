var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var JointPose = require("awayjs-renderergl/lib/animators/data/JointPose");
var SkeletonPose = require("awayjs-renderergl/lib/animators/data/SkeletonPose");
var AnimationStateBase = require("awayjs-renderergl/lib/animators/states/AnimationStateBase");
/**
 *
 */
var SkeletonDirectionalState = (function (_super) {
    __extends(SkeletonDirectionalState, _super);
    function SkeletonDirectionalState(animator, skeletonAnimationNode) {
        _super.call(this, animator, skeletonAnimationNode);
        this._skeletonPose = new SkeletonPose();
        this._skeletonPoseDirty = true;
        this._blendWeight = 0;
        this._direction = 0;
        this._blendDirty = true;
        this._skeletonAnimationNode = skeletonAnimationNode;
        this._forward = animator.getAnimationState(this._skeletonAnimationNode.forward);
        this._backward = animator.getAnimationState(this._skeletonAnimationNode.backward);
        this._left = animator.getAnimationState(this._skeletonAnimationNode.left);
        this._right = animator.getAnimationState(this._skeletonAnimationNode.right);
    }
    Object.defineProperty(SkeletonDirectionalState.prototype, "direction", {
        get: function () {
            return this._direction;
        },
        /**
         * Defines the direction in degrees of the aniamtion between the forwards (0), right(90) backwards (180) and left(270) input nodes,
         * used to produce the skeleton pose output.
         */
        set: function (value) {
            if (this._direction == value)
                return;
            this._direction = value;
            this._blendDirty = true;
            this._skeletonPoseDirty = true;
            this._pPositionDeltaDirty = true;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    SkeletonDirectionalState.prototype.phase = function (value) {
        if (this._blendDirty)
            this.updateBlend();
        this._skeletonPoseDirty = true;
        this._pPositionDeltaDirty = true;
        this._inputA.phase(value);
        this._inputB.phase(value);
    };
    /**
     * @inheritDoc
     */
    SkeletonDirectionalState.prototype._pUdateTime = function (time /*int*/) {
        if (this._blendDirty)
            this.updateBlend();
        this._skeletonPoseDirty = true;
        this._inputA.update(time);
        this._inputB.update(time);
        _super.prototype._pUpdateTime.call(this, time);
    };
    /**
     * Returns the current skeleton pose of the animation in the clip based on the internal playhead position.
     */
    SkeletonDirectionalState.prototype.getSkeletonPose = function (skeleton) {
        if (this._skeletonPoseDirty)
            this.updateSkeletonPose(skeleton);
        return this._skeletonPose;
    };
    /**
     * @inheritDoc
     */
    SkeletonDirectionalState.prototype._pUpdatePositionDelta = function () {
        this._pPositionDeltaDirty = false;
        if (this._blendDirty)
            this.updateBlend();
        var deltA = this._inputA.positionDelta;
        var deltB = this._inputB.positionDelta;
        this.positionDelta.x = deltA.x + this._blendWeight * (deltB.x - deltA.x);
        this.positionDelta.y = deltA.y + this._blendWeight * (deltB.y - deltA.y);
        this.positionDelta.z = deltA.z + this._blendWeight * (deltB.z - deltA.z);
    };
    /**
     * Updates the output skeleton pose of the node based on the direction value between forward, backwards, left and right input nodes.
     *
     * @param skeleton The skeleton used by the animator requesting the ouput pose.
     */
    SkeletonDirectionalState.prototype.updateSkeletonPose = function (skeleton) {
        this._skeletonPoseDirty = false;
        if (this._blendDirty)
            this.updateBlend();
        var endPose;
        var endPoses = this._skeletonPose.jointPoses;
        var poses1 = this._inputA.getSkeletonPose(skeleton).jointPoses;
        var poses2 = this._inputB.getSkeletonPose(skeleton).jointPoses;
        var pose1, pose2;
        var p1, p2;
        var tr;
        var numJoints = skeleton.numJoints;
        // :s
        if (endPoses.length != numJoints)
            endPoses.length = numJoints;
        for (var i = 0; i < numJoints; ++i) {
            endPose = endPoses[i];
            if (endPose == null)
                endPose = endPoses[i] = new JointPose();
            pose1 = poses1[i];
            pose2 = poses2[i];
            p1 = pose1.translation;
            p2 = pose2.translation;
            endPose.orientation.lerp(pose1.orientation, pose2.orientation, this._blendWeight);
            tr = endPose.translation;
            tr.x = p1.x + this._blendWeight * (p2.x - p1.x);
            tr.y = p1.y + this._blendWeight * (p2.y - p1.y);
            tr.z = p1.z + this._blendWeight * (p2.z - p1.z);
        }
    };
    /**
     * Updates the blend value for the animation output based on the direction value between forward, backwards, left and right input nodes.
     *
     * @private
     */
    SkeletonDirectionalState.prototype.updateBlend = function () {
        this._blendDirty = false;
        if (this._direction < 0 || this._direction > 360) {
            this._direction %= 360;
            if (this._direction < 0)
                this._direction += 360;
        }
        if (this._direction < 90) {
            this._inputA = this._forward;
            this._inputB = this._right;
            this._blendWeight = this._direction / 90;
        }
        else if (this._direction < 180) {
            this._inputA = this._right;
            this._inputB = this._backward;
            this._blendWeight = (this._direction - 90) / 90;
        }
        else if (this._direction < 270) {
            this._inputA = this._backward;
            this._inputB = this._left;
            this._blendWeight = (this._direction - 180) / 90;
        }
        else {
            this._inputA = this._left;
            this._inputB = this._forward;
            this._blendWeight = (this._direction - 270) / 90;
        }
    };
    return SkeletonDirectionalState;
})(AnimationStateBase);
module.exports = SkeletonDirectionalState;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuaW1hdG9ycy9zdGF0ZXMvc2tlbGV0b25kaXJlY3Rpb25hbHN0YXRlLnRzIl0sIm5hbWVzIjpbIlNrZWxldG9uRGlyZWN0aW9uYWxTdGF0ZSIsIlNrZWxldG9uRGlyZWN0aW9uYWxTdGF0ZS5jb25zdHJ1Y3RvciIsIlNrZWxldG9uRGlyZWN0aW9uYWxTdGF0ZS5kaXJlY3Rpb24iLCJTa2VsZXRvbkRpcmVjdGlvbmFsU3RhdGUucGhhc2UiLCJTa2VsZXRvbkRpcmVjdGlvbmFsU3RhdGUuX3BVZGF0ZVRpbWUiLCJTa2VsZXRvbkRpcmVjdGlvbmFsU3RhdGUuZ2V0U2tlbGV0b25Qb3NlIiwiU2tlbGV0b25EaXJlY3Rpb25hbFN0YXRlLl9wVXBkYXRlUG9zaXRpb25EZWx0YSIsIlNrZWxldG9uRGlyZWN0aW9uYWxTdGF0ZS51cGRhdGVTa2VsZXRvblBvc2UiLCJTa2VsZXRvbkRpcmVjdGlvbmFsU3RhdGUudXBkYXRlQmxlbmQiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUlBLElBQU8sU0FBUyxXQUFnQixnREFBZ0QsQ0FBQyxDQUFDO0FBRWxGLElBQU8sWUFBWSxXQUFnQixtREFBbUQsQ0FBQyxDQUFDO0FBRXhGLElBQU8sa0JBQWtCLFdBQWMsMkRBQTJELENBQUMsQ0FBQztBQUdwRyxBQUdBOztHQURHO0lBQ0csd0JBQXdCO0lBQVNBLFVBQWpDQSx3QkFBd0JBLFVBQTJCQTtJQXFDeERBLFNBckNLQSx3QkFBd0JBLENBcUNqQkEsUUFBcUJBLEVBQUVBLHFCQUE2Q0E7UUFFL0VDLGtCQUFNQSxRQUFRQSxFQUFFQSxxQkFBcUJBLENBQUNBLENBQUNBO1FBcENoQ0Esa0JBQWFBLEdBQWdCQSxJQUFJQSxZQUFZQSxFQUFFQSxDQUFDQTtRQUNoREEsdUJBQWtCQSxHQUFXQSxJQUFJQSxDQUFDQTtRQUdsQ0EsaUJBQVlBLEdBQVVBLENBQUNBLENBQUNBO1FBQ3hCQSxlQUFVQSxHQUFVQSxDQUFDQSxDQUFDQTtRQUN0QkEsZ0JBQVdBLEdBQVdBLElBQUlBLENBQUNBO1FB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Q0EsQ0FBQ0E7WUFDbEJBLEtBQUtBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2xCQSxFQUFFQSxHQUFHQSxLQUFLQSxDQUFDQSxXQUFXQSxDQUFDQTtZQUN2QkEsRUFBRUEsR0FBR0EsS0FBS0EsQ0FBQ0EsV0FBV0EsQ0FBQ0E7WUFFdkJBLE9BQU9BLENBQUNBLFdBQVdBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLFdBQVdBLEVBQUVBLEtBQUtBLENBQUNBLFdBQVdBLEVBQUVBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLENBQUNBO1lBRWxGQSxFQUFFQSxHQUFHQSxPQUFPQSxDQUFDQSxXQUFXQSxDQUFDQTtZQUN6QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsWUFBWUEsR0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDOUNBLEVBQUVBLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFlBQVlBLEdBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQzlDQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxZQUFZQSxHQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUMvQ0EsQ0FBQ0E7SUFDRkEsQ0FBQ0E7SUFFRFA7Ozs7T0FJR0E7SUFDS0EsOENBQVdBLEdBQW5CQTtRQUVDUSxJQUFJQSxDQUFDQSxXQUFXQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUV6QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsR0FBR0EsQ0FBQ0EsSUFBSUEsSUFBSUEsQ0FBQ0EsVUFBVUEsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDbERBLElBQUlBLENBQUNBLFVBQVVBLElBQUlBLEdBQUdBLENBQUNBO1lBQ3ZCQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFDdkJBLElBQUlBLENBQUNBLFVBQVVBLElBQUlBLEdBQUdBLENBQUNBO1FBQ3pCQSxDQUFDQTtRQUVEQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMxQkEsSUFBSUEsQ0FBQ0EsT0FBT0EsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0E7WUFDN0JBLElBQUlBLENBQUNBLE9BQU9BLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBO1lBQzNCQSxJQUFJQSxDQUFDQSxZQUFZQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxHQUFDQSxFQUFFQSxDQUFDQTtRQUN4Q0EsQ0FBQ0E7UUFBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDbENBLElBQUlBLENBQUNBLE9BQU9BLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBO1lBQzNCQSxJQUFJQSxDQUFDQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQTtZQUM5QkEsSUFBSUEsQ0FBQ0EsWUFBWUEsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsR0FBR0EsRUFBRUEsQ0FBQ0EsR0FBQ0EsRUFBRUEsQ0FBQ0E7UUFDL0NBLENBQUNBO1FBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO1lBQ2xDQSxJQUFJQSxDQUFDQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQTtZQUM5QkEsSUFBSUEsQ0FBQ0EsT0FBT0EsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7WUFDMUJBLElBQUlBLENBQUNBLFlBQVlBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLEdBQUdBLEdBQUdBLENBQUNBLEdBQUNBLEVBQUVBLENBQUNBO1FBQ2hEQSxDQUFDQTtRQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUNQQSxJQUFJQSxDQUFDQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQTtZQUMxQkEsSUFBSUEsQ0FBQ0EsT0FBT0EsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0E7WUFDN0JBLElBQUlBLENBQUNBLFlBQVlBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLEdBQUdBLEdBQUdBLENBQUNBLEdBQUNBLEVBQUVBLENBQUNBO1FBQ2hEQSxDQUFDQTtJQUNGQSxDQUFDQTtJQUNGUiwrQkFBQ0E7QUFBREEsQ0E1TEEsQUE0TENBLEVBNUxzQyxrQkFBa0IsRUE0THhEO0FBRUQsQUFBa0MsaUJBQXpCLHdCQUF3QixDQUFDIiwiZmlsZSI6ImFuaW1hdG9ycy9zdGF0ZXMvU2tlbGV0b25EaXJlY3Rpb25hbFN0YXRlLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9yb2JiYXRlbWFuL1dlYnN0b3JtUHJvamVjdHMvYXdheWpzLXJlbmRlcmVyZ2wvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZlY3RvcjNEXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvY29yZS9nZW9tL1ZlY3RvcjNEXCIpO1xuXG5pbXBvcnQgQW5pbWF0b3JCYXNlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2FuaW1hdG9ycy9BbmltYXRvckJhc2VcIik7XG5cbmltcG9ydCBKb2ludFBvc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvSm9pbnRQb3NlXCIpO1xuaW1wb3J0IFNrZWxldG9uXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvU2tlbGV0b25cIik7XG5pbXBvcnQgU2tlbGV0b25Qb3NlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9kYXRhL1NrZWxldG9uUG9zZVwiKTtcbmltcG9ydCBTa2VsZXRvbkRpcmVjdGlvbmFsTm9kZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvbm9kZXMvU2tlbGV0b25EaXJlY3Rpb25hbE5vZGVcIik7XG5pbXBvcnQgQW5pbWF0aW9uU3RhdGVCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL3N0YXRlcy9BbmltYXRpb25TdGF0ZUJhc2VcIik7XG5pbXBvcnQgSVNrZWxldG9uQW5pbWF0aW9uU3RhdGVcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL3N0YXRlcy9JU2tlbGV0b25BbmltYXRpb25TdGF0ZVwiKTtcblxuLyoqXG4gKlxuICovXG5jbGFzcyBTa2VsZXRvbkRpcmVjdGlvbmFsU3RhdGUgZXh0ZW5kcyBBbmltYXRpb25TdGF0ZUJhc2UgaW1wbGVtZW50cyBJU2tlbGV0b25BbmltYXRpb25TdGF0ZVxue1xuXHRwcml2YXRlIF9za2VsZXRvbkFuaW1hdGlvbk5vZGU6U2tlbGV0b25EaXJlY3Rpb25hbE5vZGU7XG5cdHByaXZhdGUgX3NrZWxldG9uUG9zZTpTa2VsZXRvblBvc2UgPSBuZXcgU2tlbGV0b25Qb3NlKCk7XG5cdHByaXZhdGUgX3NrZWxldG9uUG9zZURpcnR5OmJvb2xlYW4gPSB0cnVlO1xuXHRwcml2YXRlIF9pbnB1dEE6SVNrZWxldG9uQW5pbWF0aW9uU3RhdGU7XG5cdHByaXZhdGUgX2lucHV0QjpJU2tlbGV0b25BbmltYXRpb25TdGF0ZTtcblx0cHJpdmF0ZSBfYmxlbmRXZWlnaHQ6bnVtYmVyID0gMDtcblx0cHJpdmF0ZSBfZGlyZWN0aW9uOm51bWJlciA9IDA7XG5cdHByaXZhdGUgX2JsZW5kRGlydHk6Ym9vbGVhbiA9IHRydWU7XG5cdHByaXZhdGUgX2ZvcndhcmQ6SVNrZWxldG9uQW5pbWF0aW9uU3RhdGU7XG5cdHByaXZhdGUgX2JhY2t3YXJkOklTa2VsZXRvbkFuaW1hdGlvblN0YXRlO1xuXHRwcml2YXRlIF9sZWZ0OklTa2VsZXRvbkFuaW1hdGlvblN0YXRlO1xuXHRwcml2YXRlIF9yaWdodDpJU2tlbGV0b25BbmltYXRpb25TdGF0ZTtcblxuXHQvKipcblx0ICogRGVmaW5lcyB0aGUgZGlyZWN0aW9uIGluIGRlZ3JlZXMgb2YgdGhlIGFuaWFtdGlvbiBiZXR3ZWVuIHRoZSBmb3J3YXJkcyAoMCksIHJpZ2h0KDkwKSBiYWNrd2FyZHMgKDE4MCkgYW5kIGxlZnQoMjcwKSBpbnB1dCBub2Rlcyxcblx0ICogdXNlZCB0byBwcm9kdWNlIHRoZSBza2VsZXRvbiBwb3NlIG91dHB1dC5cblx0ICovXG5cdHB1YmxpYyBzZXQgZGlyZWN0aW9uKHZhbHVlOm51bWJlcilcblx0e1xuXHRcdGlmICh0aGlzLl9kaXJlY3Rpb24gPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl9kaXJlY3Rpb24gPSB2YWx1ZTtcblxuXHRcdHRoaXMuX2JsZW5kRGlydHkgPSB0cnVlO1xuXG5cdFx0dGhpcy5fc2tlbGV0b25Qb3NlRGlydHkgPSB0cnVlO1xuXHRcdHRoaXMuX3BQb3NpdGlvbkRlbHRhRGlydHkgPSB0cnVlO1xuXHR9XG5cblx0cHVibGljIGdldCBkaXJlY3Rpb24oKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9kaXJlY3Rpb247XG5cdH1cblxuXHRjb25zdHJ1Y3RvcihhbmltYXRvcjpBbmltYXRvckJhc2UsIHNrZWxldG9uQW5pbWF0aW9uTm9kZTpTa2VsZXRvbkRpcmVjdGlvbmFsTm9kZSlcblx0e1xuXHRcdHN1cGVyKGFuaW1hdG9yLCBza2VsZXRvbkFuaW1hdGlvbk5vZGUpO1xuXG5cdFx0dGhpcy5fc2tlbGV0b25BbmltYXRpb25Ob2RlID0gc2tlbGV0b25BbmltYXRpb25Ob2RlO1xuXG5cdFx0dGhpcy5fZm9yd2FyZCA9IDxJU2tlbGV0b25BbmltYXRpb25TdGF0ZT4gYW5pbWF0b3IuZ2V0QW5pbWF0aW9uU3RhdGUodGhpcy5fc2tlbGV0b25BbmltYXRpb25Ob2RlLmZvcndhcmQpO1xuXHRcdHRoaXMuX2JhY2t3YXJkID0gPElTa2VsZXRvbkFuaW1hdGlvblN0YXRlPiBhbmltYXRvci5nZXRBbmltYXRpb25TdGF0ZSh0aGlzLl9za2VsZXRvbkFuaW1hdGlvbk5vZGUuYmFja3dhcmQpO1xuXHRcdHRoaXMuX2xlZnQgPSA8SVNrZWxldG9uQW5pbWF0aW9uU3RhdGU+IGFuaW1hdG9yLmdldEFuaW1hdGlvblN0YXRlKHRoaXMuX3NrZWxldG9uQW5pbWF0aW9uTm9kZS5sZWZ0KTtcblx0XHR0aGlzLl9yaWdodCA9IDxJU2tlbGV0b25BbmltYXRpb25TdGF0ZT4gYW5pbWF0b3IuZ2V0QW5pbWF0aW9uU3RhdGUodGhpcy5fc2tlbGV0b25BbmltYXRpb25Ob2RlLnJpZ2h0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIHBoYXNlKHZhbHVlOm51bWJlcilcblx0e1xuXHRcdGlmICh0aGlzLl9ibGVuZERpcnR5KVxuXHRcdFx0dGhpcy51cGRhdGVCbGVuZCgpO1xuXG5cdFx0dGhpcy5fc2tlbGV0b25Qb3NlRGlydHkgPSB0cnVlO1xuXG5cdFx0dGhpcy5fcFBvc2l0aW9uRGVsdGFEaXJ0eSA9IHRydWU7XG5cblx0XHR0aGlzLl9pbnB1dEEucGhhc2UodmFsdWUpO1xuXHRcdHRoaXMuX2lucHV0Qi5waGFzZSh2YWx1ZSk7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBfcFVkYXRlVGltZSh0aW1lOm51bWJlciAvKmludCovKVxuXHR7XG5cdFx0aWYgKHRoaXMuX2JsZW5kRGlydHkpXG5cdFx0XHR0aGlzLnVwZGF0ZUJsZW5kKCk7XG5cblx0XHR0aGlzLl9za2VsZXRvblBvc2VEaXJ0eSA9IHRydWU7XG5cblx0XHR0aGlzLl9pbnB1dEEudXBkYXRlKHRpbWUpO1xuXHRcdHRoaXMuX2lucHV0Qi51cGRhdGUodGltZSk7XG5cblx0XHRzdXBlci5fcFVwZGF0ZVRpbWUodGltZSk7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgY3VycmVudCBza2VsZXRvbiBwb3NlIG9mIHRoZSBhbmltYXRpb24gaW4gdGhlIGNsaXAgYmFzZWQgb24gdGhlIGludGVybmFsIHBsYXloZWFkIHBvc2l0aW9uLlxuXHQgKi9cblx0cHVibGljIGdldFNrZWxldG9uUG9zZShza2VsZXRvbjpTa2VsZXRvbik6U2tlbGV0b25Qb3NlXG5cdHtcblx0XHRpZiAodGhpcy5fc2tlbGV0b25Qb3NlRGlydHkpXG5cdFx0XHR0aGlzLnVwZGF0ZVNrZWxldG9uUG9zZShza2VsZXRvbik7XG5cblx0XHRyZXR1cm4gdGhpcy5fc2tlbGV0b25Qb3NlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgX3BVcGRhdGVQb3NpdGlvbkRlbHRhKClcblx0e1xuXHRcdHRoaXMuX3BQb3NpdGlvbkRlbHRhRGlydHkgPSBmYWxzZTtcblxuXHRcdGlmICh0aGlzLl9ibGVuZERpcnR5KVxuXHRcdFx0dGhpcy51cGRhdGVCbGVuZCgpO1xuXG5cdFx0dmFyIGRlbHRBOlZlY3RvcjNEID0gdGhpcy5faW5wdXRBLnBvc2l0aW9uRGVsdGE7XG5cdFx0dmFyIGRlbHRCOlZlY3RvcjNEID0gdGhpcy5faW5wdXRCLnBvc2l0aW9uRGVsdGE7XG5cblx0XHR0aGlzLnBvc2l0aW9uRGVsdGEueCA9IGRlbHRBLnggKyB0aGlzLl9ibGVuZFdlaWdodCooZGVsdEIueCAtIGRlbHRBLngpO1xuXHRcdHRoaXMucG9zaXRpb25EZWx0YS55ID0gZGVsdEEueSArIHRoaXMuX2JsZW5kV2VpZ2h0KihkZWx0Qi55IC0gZGVsdEEueSk7XG5cdFx0dGhpcy5wb3NpdGlvbkRlbHRhLnogPSBkZWx0QS56ICsgdGhpcy5fYmxlbmRXZWlnaHQqKGRlbHRCLnogLSBkZWx0QS56KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBVcGRhdGVzIHRoZSBvdXRwdXQgc2tlbGV0b24gcG9zZSBvZiB0aGUgbm9kZSBiYXNlZCBvbiB0aGUgZGlyZWN0aW9uIHZhbHVlIGJldHdlZW4gZm9yd2FyZCwgYmFja3dhcmRzLCBsZWZ0IGFuZCByaWdodCBpbnB1dCBub2Rlcy5cblx0ICpcblx0ICogQHBhcmFtIHNrZWxldG9uIFRoZSBza2VsZXRvbiB1c2VkIGJ5IHRoZSBhbmltYXRvciByZXF1ZXN0aW5nIHRoZSBvdXB1dCBwb3NlLlxuXHQgKi9cblx0cHJpdmF0ZSB1cGRhdGVTa2VsZXRvblBvc2Uoc2tlbGV0b246U2tlbGV0b24pXG5cdHtcblx0XHR0aGlzLl9za2VsZXRvblBvc2VEaXJ0eSA9IGZhbHNlO1xuXG5cdFx0aWYgKHRoaXMuX2JsZW5kRGlydHkpXG5cdFx0XHR0aGlzLnVwZGF0ZUJsZW5kKCk7XG5cblx0XHR2YXIgZW5kUG9zZTpKb2ludFBvc2U7XG5cdFx0dmFyIGVuZFBvc2VzOkFycmF5PEpvaW50UG9zZT4gPSB0aGlzLl9za2VsZXRvblBvc2Uuam9pbnRQb3Nlcztcblx0XHR2YXIgcG9zZXMxOkFycmF5PEpvaW50UG9zZT4gPSB0aGlzLl9pbnB1dEEuZ2V0U2tlbGV0b25Qb3NlKHNrZWxldG9uKS5qb2ludFBvc2VzO1xuXHRcdHZhciBwb3NlczI6QXJyYXk8Sm9pbnRQb3NlPiA9IHRoaXMuX2lucHV0Qi5nZXRTa2VsZXRvblBvc2Uoc2tlbGV0b24pLmpvaW50UG9zZXM7XG5cdFx0dmFyIHBvc2UxOkpvaW50UG9zZSwgcG9zZTI6Sm9pbnRQb3NlO1xuXHRcdHZhciBwMTpWZWN0b3IzRCwgcDI6VmVjdG9yM0Q7XG5cdFx0dmFyIHRyOlZlY3RvcjNEO1xuXHRcdHZhciBudW1Kb2ludHM6bnVtYmVyIC8qdWludCovID0gc2tlbGV0b24ubnVtSm9pbnRzO1xuXG5cdFx0Ly8gOnNcblx0XHRpZiAoZW5kUG9zZXMubGVuZ3RoICE9IG51bUpvaW50cylcblx0XHRcdGVuZFBvc2VzLmxlbmd0aCA9IG51bUpvaW50cztcblxuXHRcdGZvciAodmFyIGk6bnVtYmVyIC8qdWludCovID0gMDsgaSA8IG51bUpvaW50czsgKytpKSB7XG5cdFx0XHRlbmRQb3NlID0gZW5kUG9zZXNbaV07XG5cblx0XHRcdGlmIChlbmRQb3NlID09IG51bGwpXG5cdFx0XHRcdGVuZFBvc2UgPSBlbmRQb3Nlc1tpXSA9IG5ldyBKb2ludFBvc2UoKTtcblxuXHRcdFx0cG9zZTEgPSBwb3NlczFbaV07XG5cdFx0XHRwb3NlMiA9IHBvc2VzMltpXTtcblx0XHRcdHAxID0gcG9zZTEudHJhbnNsYXRpb247XG5cdFx0XHRwMiA9IHBvc2UyLnRyYW5zbGF0aW9uO1xuXG5cdFx0XHRlbmRQb3NlLm9yaWVudGF0aW9uLmxlcnAocG9zZTEub3JpZW50YXRpb24sIHBvc2UyLm9yaWVudGF0aW9uLCB0aGlzLl9ibGVuZFdlaWdodCk7XG5cblx0XHRcdHRyID0gZW5kUG9zZS50cmFuc2xhdGlvbjtcblx0XHRcdHRyLnggPSBwMS54ICsgdGhpcy5fYmxlbmRXZWlnaHQqKHAyLnggLSBwMS54KTtcblx0XHRcdHRyLnkgPSBwMS55ICsgdGhpcy5fYmxlbmRXZWlnaHQqKHAyLnkgLSBwMS55KTtcblx0XHRcdHRyLnogPSBwMS56ICsgdGhpcy5fYmxlbmRXZWlnaHQqKHAyLnogLSBwMS56KTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogVXBkYXRlcyB0aGUgYmxlbmQgdmFsdWUgZm9yIHRoZSBhbmltYXRpb24gb3V0cHV0IGJhc2VkIG9uIHRoZSBkaXJlY3Rpb24gdmFsdWUgYmV0d2VlbiBmb3J3YXJkLCBiYWNrd2FyZHMsIGxlZnQgYW5kIHJpZ2h0IGlucHV0IG5vZGVzLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0cHJpdmF0ZSB1cGRhdGVCbGVuZCgpXG5cdHtcblx0XHR0aGlzLl9ibGVuZERpcnR5ID0gZmFsc2U7XG5cblx0XHRpZiAodGhpcy5fZGlyZWN0aW9uIDwgMCB8fCB0aGlzLl9kaXJlY3Rpb24gPiAzNjApIHtcblx0XHRcdHRoaXMuX2RpcmVjdGlvbiAlPSAzNjA7XG5cdFx0XHRpZiAodGhpcy5fZGlyZWN0aW9uIDwgMClcblx0XHRcdFx0dGhpcy5fZGlyZWN0aW9uICs9IDM2MDtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5fZGlyZWN0aW9uIDwgOTApIHtcblx0XHRcdHRoaXMuX2lucHV0QSA9IHRoaXMuX2ZvcndhcmQ7XG5cdFx0XHR0aGlzLl9pbnB1dEIgPSB0aGlzLl9yaWdodDtcblx0XHRcdHRoaXMuX2JsZW5kV2VpZ2h0ID0gdGhpcy5fZGlyZWN0aW9uLzkwO1xuXHRcdH0gZWxzZSBpZiAodGhpcy5fZGlyZWN0aW9uIDwgMTgwKSB7XG5cdFx0XHR0aGlzLl9pbnB1dEEgPSB0aGlzLl9yaWdodDtcblx0XHRcdHRoaXMuX2lucHV0QiA9IHRoaXMuX2JhY2t3YXJkO1xuXHRcdFx0dGhpcy5fYmxlbmRXZWlnaHQgPSAodGhpcy5fZGlyZWN0aW9uIC0gOTApLzkwO1xuXHRcdH0gZWxzZSBpZiAodGhpcy5fZGlyZWN0aW9uIDwgMjcwKSB7XG5cdFx0XHR0aGlzLl9pbnB1dEEgPSB0aGlzLl9iYWNrd2FyZDtcblx0XHRcdHRoaXMuX2lucHV0QiA9IHRoaXMuX2xlZnQ7XG5cdFx0XHR0aGlzLl9ibGVuZFdlaWdodCA9ICh0aGlzLl9kaXJlY3Rpb24gLSAxODApLzkwO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLl9pbnB1dEEgPSB0aGlzLl9sZWZ0O1xuXHRcdFx0dGhpcy5faW5wdXRCID0gdGhpcy5fZm9yd2FyZDtcblx0XHRcdHRoaXMuX2JsZW5kV2VpZ2h0ID0gKHRoaXMuX2RpcmVjdGlvbiAtIDI3MCkvOTA7XG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCA9IFNrZWxldG9uRGlyZWN0aW9uYWxTdGF0ZTsiXX0=