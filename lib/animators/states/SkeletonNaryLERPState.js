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
var SkeletonNaryLERPState = (function (_super) {
    __extends(SkeletonNaryLERPState, _super);
    function SkeletonNaryLERPState(animator, skeletonAnimationNode) {
        _super.call(this, animator, skeletonAnimationNode);
        this._skeletonPose = new SkeletonPose();
        this._skeletonPoseDirty = true;
        this._blendWeights = new Array();
        this._inputs = new Array();
        this._skeletonAnimationNode = skeletonAnimationNode;
        var i = this._skeletonAnimationNode.numInputs;
        while (i--)
            this._inputs[i] = animator.getAnimationState(this._skeletonAnimationNode._iInputs[i]);
    }
    /**
     * @inheritDoc
     */
    SkeletonNaryLERPState.prototype.phase = function (value) {
        this._skeletonPoseDirty = true;
        this._pPositionDeltaDirty = true;
        for (var j = 0; j < this._skeletonAnimationNode.numInputs; ++j) {
            if (this._blendWeights[j])
                this._inputs[j].update(value);
        }
    };
    /**
     * @inheritDoc
     */
    SkeletonNaryLERPState.prototype._pUdateTime = function (time /*int*/) {
        for (var j = 0; j < this._skeletonAnimationNode.numInputs; ++j) {
            if (this._blendWeights[j])
                this._inputs[j].update(time);
        }
        _super.prototype._pUpdateTime.call(this, time);
    };
    /**
     * Returns the current skeleton pose of the animation in the clip based on the internal playhead position.
     */
    SkeletonNaryLERPState.prototype.getSkeletonPose = function (skeleton) {
        if (this._skeletonPoseDirty)
            this.updateSkeletonPose(skeleton);
        return this._skeletonPose;
    };
    /**
     * Returns the blend weight of the skeleton aniamtion node that resides at the given input index.
     *
     * @param index The input index for which the skeleton animation node blend weight is requested.
     */
    SkeletonNaryLERPState.prototype.getBlendWeightAt = function (index /*uint*/) {
        return this._blendWeights[index];
    };
    /**
     * Sets the blend weight of the skeleton aniamtion node that resides at the given input index.
     *
     * @param index The input index on which the skeleton animation node blend weight is to be set.
     * @param blendWeight The blend weight value to use for the given skeleton animation node index.
     */
    SkeletonNaryLERPState.prototype.setBlendWeightAt = function (index /*uint*/, blendWeight) {
        this._blendWeights[index] = blendWeight;
        this._pPositionDeltaDirty = true;
        this._skeletonPoseDirty = true;
    };
    /**
     * @inheritDoc
     */
    SkeletonNaryLERPState.prototype._pUpdatePositionDelta = function () {
        this._pPositionDeltaDirty = false;
        var delta;
        var weight;
        this.positionDelta.x = 0;
        this.positionDelta.y = 0;
        this.positionDelta.z = 0;
        for (var j = 0; j < this._skeletonAnimationNode.numInputs; ++j) {
            weight = this._blendWeights[j];
            if (weight) {
                delta = this._inputs[j].positionDelta;
                this.positionDelta.x += weight * delta.x;
                this.positionDelta.y += weight * delta.y;
                this.positionDelta.z += weight * delta.z;
            }
        }
    };
    /**
     * Updates the output skeleton pose of the node based on the blend weight values given to the input nodes.
     *
     * @param skeleton The skeleton used by the animator requesting the ouput pose.
     */
    SkeletonNaryLERPState.prototype.updateSkeletonPose = function (skeleton) {
        this._skeletonPoseDirty = false;
        var weight;
        var endPoses = this._skeletonPose.jointPoses;
        var poses;
        var endPose, pose;
        var endTr, tr;
        var endQuat, q;
        var firstPose;
        var i /*uint*/;
        var w0, x0, y0, z0;
        var w1, x1, y1, z1;
        var numJoints = skeleton.numJoints;
        // :s
        if (endPoses.length != numJoints)
            endPoses.length = numJoints;
        for (var j = 0; j < this._skeletonAnimationNode.numInputs; ++j) {
            weight = this._blendWeights[j];
            if (!weight)
                continue;
            poses = this._inputs[j].getSkeletonPose(skeleton).jointPoses;
            if (!firstPose) {
                firstPose = poses;
                for (i = 0; i < numJoints; ++i) {
                    endPose = endPoses[i];
                    if (endPose == null)
                        endPose = endPoses[i] = new JointPose();
                    pose = poses[i];
                    q = pose.orientation;
                    tr = pose.translation;
                    endQuat = endPose.orientation;
                    endQuat.x = weight * q.x;
                    endQuat.y = weight * q.y;
                    endQuat.z = weight * q.z;
                    endQuat.w = weight * q.w;
                    endTr = endPose.translation;
                    endTr.x = weight * tr.x;
                    endTr.y = weight * tr.y;
                    endTr.z = weight * tr.z;
                }
            }
            else {
                for (i = 0; i < skeleton.numJoints; ++i) {
                    endPose = endPoses[i];
                    pose = poses[i];
                    q = firstPose[i].orientation;
                    x0 = q.x;
                    y0 = q.y;
                    z0 = q.z;
                    w0 = q.w;
                    q = pose.orientation;
                    tr = pose.translation;
                    x1 = q.x;
                    y1 = q.y;
                    z1 = q.z;
                    w1 = q.w;
                    // find shortest direction
                    if (x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1 < 0) {
                        x1 = -x1;
                        y1 = -y1;
                        z1 = -z1;
                        w1 = -w1;
                    }
                    endQuat = endPose.orientation;
                    endQuat.x += weight * x1;
                    endQuat.y += weight * y1;
                    endQuat.z += weight * z1;
                    endQuat.w += weight * w1;
                    endTr = endPose.translation;
                    endTr.x += weight * tr.x;
                    endTr.y += weight * tr.y;
                    endTr.z += weight * tr.z;
                }
            }
        }
        for (i = 0; i < skeleton.numJoints; ++i)
            endPoses[i].orientation.normalize();
    };
    return SkeletonNaryLERPState;
})(AnimationStateBase);
module.exports = SkeletonNaryLERPState;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuaW1hdG9ycy9zdGF0ZXMvc2tlbGV0b25uYXJ5bGVycHN0YXRlLnRzIl0sIm5hbWVzIjpbIlNrZWxldG9uTmFyeUxFUlBTdGF0ZSIsIlNrZWxldG9uTmFyeUxFUlBTdGF0ZS5jb25zdHJ1Y3RvciIsIlNrZWxldG9uTmFyeUxFUlBTdGF0ZS5waGFzZSIsIlNrZWxldG9uTmFyeUxFUlBTdGF0ZS5fcFVkYXRlVGltZSIsIlNrZWxldG9uTmFyeUxFUlBTdGF0ZS5nZXRTa2VsZXRvblBvc2UiLCJTa2VsZXRvbk5hcnlMRVJQU3RhdGUuZ2V0QmxlbmRXZWlnaHRBdCIsIlNrZWxldG9uTmFyeUxFUlBTdGF0ZS5zZXRCbGVuZFdlaWdodEF0IiwiU2tlbGV0b25OYXJ5TEVSUFN0YXRlLl9wVXBkYXRlUG9zaXRpb25EZWx0YSIsIlNrZWxldG9uTmFyeUxFUlBTdGF0ZS51cGRhdGVTa2VsZXRvblBvc2UiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUtBLElBQU8sU0FBUyxXQUFnQixnREFBZ0QsQ0FBQyxDQUFDO0FBRWxGLElBQU8sWUFBWSxXQUFnQixtREFBbUQsQ0FBQyxDQUFDO0FBRXhGLElBQU8sa0JBQWtCLFdBQWMsMkRBQTJELENBQUMsQ0FBQztBQUdwRyxBQUdBOztHQURHO0lBQ0cscUJBQXFCO0lBQVNBLFVBQTlCQSxxQkFBcUJBLFVBQTJCQTtJQVFyREEsU0FSS0EscUJBQXFCQSxDQVFkQSxRQUFxQkEsRUFBRUEscUJBQTBDQTtRQUU1RUMsa0JBQU1BLFFBQVFBLEVBQUVBLHFCQUFxQkEsQ0FBQ0EsQ0FBQ0E7UUFQaENBLGtCQUFhQSxHQUFnQkEsSUFBSUEsWUFBWUEsRUFBRUEsQ0FBQ0E7UUFDaERBLHVCQUFrQkEsR0FBV0EsSUFBSUEsQ0FBQ0E7UUFDbENBLGtCQUFhQSxHQUFpQkEsSUFBSUEsS0FBS0EsRUFBVUEsQ0FBQ0E7UUFDbERBLFlBQU9BLEdBQWtDQSxJQUFJQSxLQUFLQSxFQUEyQkEsQ0FBQ0E7UUFNckZBLElBQUlBLENBQUNBLHNCQUFzQkEsR0FB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Q0EsZUFBZUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsVUFBVUEsQ0FBQ0E7WUFFN0RBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBO2dCQUNoQkEsU0FBU0EsR0FBR0EsS0FBS0EsQ0FBQ0E7Z0JBQ2xCQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxTQUFTQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQTtvQkFDaENBLE9BQU9BLEdBQUdBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUV0QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsSUFBSUEsSUFBSUEsQ0FBQ0E7d0JBQ25CQSxPQUFPQSxHQUFHQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxTQUFTQSxFQUFFQSxDQUFDQTtvQkFFekNBLElBQUlBLEdBQUdBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUNoQkEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7b0JBQ3JCQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQTtvQkFFdEJBLE9BQU9BLEdBQUdBLE9BQU9BLENBQUNBLFdBQVdBLENBQUNBO29CQUU5QkEsT0FBT0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsR0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3ZCQSxPQUFPQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxHQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDdkJBLE9BQU9BLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLEdBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUN2QkEsT0FBT0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsR0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBRXZCQSxLQUFLQSxHQUFHQSxPQUFPQSxDQUFDQSxXQUFXQSxDQUFDQTtvQkFDNUJBLEtBQUtBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLEdBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO29CQUN0QkEsS0FBS0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsR0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3RCQSxLQUFLQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxHQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDdkJBLENBQUNBO1lBQ0ZBLENBQUNBO1lBQUNBLElBQUlBLENBQUNBLENBQUNBO2dCQUNQQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxRQUFRQSxDQUFDQSxTQUFTQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQTtvQkFDekNBLE9BQU9BLEdBQUdBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUN0QkEsSUFBSUEsR0FBR0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBRWhCQSxDQUFDQSxHQUFHQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxXQUFXQSxDQUFDQTtvQkFDN0JBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUNUQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDVEEsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ1RBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUVUQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQTtvQkFDckJBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBO29CQUV0QkEsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ1RBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUNUQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDVEEsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ1RBLEFBQ0FBLDBCQUQwQkE7b0JBQzFCQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxHQUFDQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFDQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFDQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFDQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDdkNBLEVBQUVBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBO3dCQUNUQSxFQUFFQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQTt3QkFDVEEsRUFBRUEsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0E7d0JBQ1RBLEVBQUVBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBO29CQUNWQSxDQUFDQTtvQkFDREEsT0FBT0EsR0FBR0EsT0FBT0EsQ0FBQ0EsV0FBV0EsQ0FBQ0E7b0JBQzlCQSxPQUFPQSxDQUFDQSxDQUFDQSxJQUFJQSxNQUFNQSxHQUFDQSxFQUFFQSxDQUFDQTtvQkFDdkJBLE9BQU9BLENBQUNBLENBQUNBLElBQUlBLE1BQU1BLEdBQUNBLEVBQUVBLENBQUNBO29CQUN2QkEsT0FBT0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsTUFBTUEsR0FBQ0EsRUFBRUEsQ0FBQ0E7b0JBQ3ZCQSxPQUFPQSxDQUFDQSxDQUFDQSxJQUFJQSxNQUFNQSxHQUFDQSxFQUFFQSxDQUFDQTtvQkFFdkJBLEtBQUtBLEdBQUdBLE9BQU9BLENBQUNBLFdBQVdBLENBQUNBO29CQUM1QkEsS0FBS0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsTUFBTUEsR0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3ZCQSxLQUFLQSxDQUFDQSxDQUFDQSxJQUFJQSxNQUFNQSxHQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDdkJBLEtBQUtBLENBQUNBLENBQUNBLElBQUlBLE1BQU1BLEdBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUN4QkEsQ0FBQ0E7WUFDRkEsQ0FBQ0E7UUFDRkEsQ0FBQ0E7UUFFREEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsUUFBUUEsQ0FBQ0EsU0FBU0EsRUFBRUEsRUFBRUEsQ0FBQ0E7WUFDdENBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLFdBQVdBLENBQUNBLFNBQVNBLEVBQUVBLENBQUNBO0lBQ3RDQSxDQUFDQTtJQUNGUiw0QkFBQ0E7QUFBREEsQ0FoTkEsQUFnTkNBLEVBaE5tQyxrQkFBa0IsRUFnTnJEO0FBRUQsQUFBK0IsaUJBQXRCLHFCQUFxQixDQUFDIiwiZmlsZSI6ImFuaW1hdG9ycy9zdGF0ZXMvU2tlbGV0b25OYXJ5TEVSUFN0YXRlLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9yb2JiYXRlbWFuL1dlYnN0b3JtUHJvamVjdHMvYXdheWpzLXJlbmRlcmVyZ2wvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFF1YXRlcm5pb25cdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvY29yZS9nZW9tL1F1YXRlcm5pb25cIik7XG5pbXBvcnQgVmVjdG9yM0RcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9jb3JlL2dlb20vVmVjdG9yM0RcIik7XG5cbmltcG9ydCBBbmltYXRvckJhc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYW5pbWF0b3JzL0FuaW1hdG9yQmFzZVwiKTtcblxuaW1wb3J0IEpvaW50UG9zZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9Kb2ludFBvc2VcIik7XG5pbXBvcnQgU2tlbGV0b25cdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9Ta2VsZXRvblwiKTtcbmltcG9ydCBTa2VsZXRvblBvc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvU2tlbGV0b25Qb3NlXCIpO1xuaW1wb3J0IFNrZWxldG9uTmFyeUxFUlBOb2RlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL25vZGVzL1NrZWxldG9uTmFyeUxFUlBOb2RlXCIpO1xuaW1wb3J0IEFuaW1hdGlvblN0YXRlQmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9zdGF0ZXMvQW5pbWF0aW9uU3RhdGVCYXNlXCIpO1xuaW1wb3J0IElTa2VsZXRvbkFuaW1hdGlvblN0YXRlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9zdGF0ZXMvSVNrZWxldG9uQW5pbWF0aW9uU3RhdGVcIik7XG5cbi8qKlxuICpcbiAqL1xuY2xhc3MgU2tlbGV0b25OYXJ5TEVSUFN0YXRlIGV4dGVuZHMgQW5pbWF0aW9uU3RhdGVCYXNlIGltcGxlbWVudHMgSVNrZWxldG9uQW5pbWF0aW9uU3RhdGVcbntcblx0cHJpdmF0ZSBfc2tlbGV0b25BbmltYXRpb25Ob2RlOlNrZWxldG9uTmFyeUxFUlBOb2RlO1xuXHRwcml2YXRlIF9za2VsZXRvblBvc2U6U2tlbGV0b25Qb3NlID0gbmV3IFNrZWxldG9uUG9zZSgpO1xuXHRwcml2YXRlIF9za2VsZXRvblBvc2VEaXJ0eTpib29sZWFuID0gdHJ1ZTtcblx0cHJpdmF0ZSBfYmxlbmRXZWlnaHRzOkFycmF5PG51bWJlcj4gPSBuZXcgQXJyYXk8bnVtYmVyPigpO1xuXHRwcml2YXRlIF9pbnB1dHM6QXJyYXk8SVNrZWxldG9uQW5pbWF0aW9uU3RhdGU+ID0gbmV3IEFycmF5PElTa2VsZXRvbkFuaW1hdGlvblN0YXRlPigpO1xuXG5cdGNvbnN0cnVjdG9yKGFuaW1hdG9yOkFuaW1hdG9yQmFzZSwgc2tlbGV0b25BbmltYXRpb25Ob2RlOlNrZWxldG9uTmFyeUxFUlBOb2RlKVxuXHR7XG5cdFx0c3VwZXIoYW5pbWF0b3IsIHNrZWxldG9uQW5pbWF0aW9uTm9kZSk7XG5cblx0XHR0aGlzLl9za2VsZXRvbkFuaW1hdGlvbk5vZGUgPSBza2VsZXRvbkFuaW1hdGlvbk5vZGU7XG5cblx0XHR2YXIgaTpudW1iZXIgLyp1aW50Ki8gPSB0aGlzLl9za2VsZXRvbkFuaW1hdGlvbk5vZGUubnVtSW5wdXRzO1xuXG5cdFx0d2hpbGUgKGktLSlcblx0XHRcdHRoaXMuX2lucHV0c1tpXSA9IDxJU2tlbGV0b25BbmltYXRpb25TdGF0ZT4gYW5pbWF0b3IuZ2V0QW5pbWF0aW9uU3RhdGUodGhpcy5fc2tlbGV0b25BbmltYXRpb25Ob2RlLl9pSW5wdXRzW2ldKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIHBoYXNlKHZhbHVlOm51bWJlcilcblx0e1xuXHRcdHRoaXMuX3NrZWxldG9uUG9zZURpcnR5ID0gdHJ1ZTtcblxuXHRcdHRoaXMuX3BQb3NpdGlvbkRlbHRhRGlydHkgPSB0cnVlO1xuXG5cdFx0Zm9yICh2YXIgajpudW1iZXIgLyp1aW50Ki8gPSAwOyBqIDwgdGhpcy5fc2tlbGV0b25BbmltYXRpb25Ob2RlLm51bUlucHV0czsgKytqKSB7XG5cdFx0XHRpZiAodGhpcy5fYmxlbmRXZWlnaHRzW2pdKVxuXHRcdFx0XHR0aGlzLl9pbnB1dHNbal0udXBkYXRlKHZhbHVlKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBfcFVkYXRlVGltZSh0aW1lOm51bWJlciAvKmludCovKVxuXHR7XG5cdFx0Zm9yICh2YXIgajpudW1iZXIgLyp1aW50Ki8gPSAwOyBqIDwgdGhpcy5fc2tlbGV0b25BbmltYXRpb25Ob2RlLm51bUlucHV0czsgKytqKSB7XG5cdFx0XHRpZiAodGhpcy5fYmxlbmRXZWlnaHRzW2pdKVxuXHRcdFx0XHR0aGlzLl9pbnB1dHNbal0udXBkYXRlKHRpbWUpO1xuXHRcdH1cblxuXHRcdHN1cGVyLl9wVXBkYXRlVGltZSh0aW1lKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBjdXJyZW50IHNrZWxldG9uIHBvc2Ugb2YgdGhlIGFuaW1hdGlvbiBpbiB0aGUgY2xpcCBiYXNlZCBvbiB0aGUgaW50ZXJuYWwgcGxheWhlYWQgcG9zaXRpb24uXG5cdCAqL1xuXHRwdWJsaWMgZ2V0U2tlbGV0b25Qb3NlKHNrZWxldG9uOlNrZWxldG9uKTpTa2VsZXRvblBvc2Vcblx0e1xuXHRcdGlmICh0aGlzLl9za2VsZXRvblBvc2VEaXJ0eSlcblx0XHRcdHRoaXMudXBkYXRlU2tlbGV0b25Qb3NlKHNrZWxldG9uKTtcblxuXHRcdHJldHVybiB0aGlzLl9za2VsZXRvblBvc2U7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgYmxlbmQgd2VpZ2h0IG9mIHRoZSBza2VsZXRvbiBhbmlhbXRpb24gbm9kZSB0aGF0IHJlc2lkZXMgYXQgdGhlIGdpdmVuIGlucHV0IGluZGV4LlxuXHQgKlxuXHQgKiBAcGFyYW0gaW5kZXggVGhlIGlucHV0IGluZGV4IGZvciB3aGljaCB0aGUgc2tlbGV0b24gYW5pbWF0aW9uIG5vZGUgYmxlbmQgd2VpZ2h0IGlzIHJlcXVlc3RlZC5cblx0ICovXG5cdHB1YmxpYyBnZXRCbGVuZFdlaWdodEF0KGluZGV4Om51bWJlciAvKnVpbnQqLyk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fYmxlbmRXZWlnaHRzW2luZGV4XTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTZXRzIHRoZSBibGVuZCB3ZWlnaHQgb2YgdGhlIHNrZWxldG9uIGFuaWFtdGlvbiBub2RlIHRoYXQgcmVzaWRlcyBhdCB0aGUgZ2l2ZW4gaW5wdXQgaW5kZXguXG5cdCAqXG5cdCAqIEBwYXJhbSBpbmRleCBUaGUgaW5wdXQgaW5kZXggb24gd2hpY2ggdGhlIHNrZWxldG9uIGFuaW1hdGlvbiBub2RlIGJsZW5kIHdlaWdodCBpcyB0byBiZSBzZXQuXG5cdCAqIEBwYXJhbSBibGVuZFdlaWdodCBUaGUgYmxlbmQgd2VpZ2h0IHZhbHVlIHRvIHVzZSBmb3IgdGhlIGdpdmVuIHNrZWxldG9uIGFuaW1hdGlvbiBub2RlIGluZGV4LlxuXHQgKi9cblx0cHVibGljIHNldEJsZW5kV2VpZ2h0QXQoaW5kZXg6bnVtYmVyIC8qdWludCovLCBibGVuZFdlaWdodDpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl9ibGVuZFdlaWdodHNbaW5kZXhdID0gYmxlbmRXZWlnaHQ7XG5cblx0XHR0aGlzLl9wUG9zaXRpb25EZWx0YURpcnR5ID0gdHJ1ZTtcblx0XHR0aGlzLl9za2VsZXRvblBvc2VEaXJ0eSA9IHRydWU7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBfcFVwZGF0ZVBvc2l0aW9uRGVsdGEoKVxuXHR7XG5cdFx0dGhpcy5fcFBvc2l0aW9uRGVsdGFEaXJ0eSA9IGZhbHNlO1xuXG5cdFx0dmFyIGRlbHRhOlZlY3RvcjNEO1xuXHRcdHZhciB3ZWlnaHQ6bnVtYmVyO1xuXG5cdFx0dGhpcy5wb3NpdGlvbkRlbHRhLnggPSAwO1xuXHRcdHRoaXMucG9zaXRpb25EZWx0YS55ID0gMDtcblx0XHR0aGlzLnBvc2l0aW9uRGVsdGEueiA9IDA7XG5cblx0XHRmb3IgKHZhciBqOm51bWJlciAvKnVpbnQqLyA9IDA7IGogPCB0aGlzLl9za2VsZXRvbkFuaW1hdGlvbk5vZGUubnVtSW5wdXRzOyArK2opIHtcblx0XHRcdHdlaWdodCA9IHRoaXMuX2JsZW5kV2VpZ2h0c1tqXTtcblxuXHRcdFx0aWYgKHdlaWdodCkge1xuXHRcdFx0XHRkZWx0YSA9IHRoaXMuX2lucHV0c1tqXS5wb3NpdGlvbkRlbHRhO1xuXHRcdFx0XHR0aGlzLnBvc2l0aW9uRGVsdGEueCArPSB3ZWlnaHQqZGVsdGEueDtcblx0XHRcdFx0dGhpcy5wb3NpdGlvbkRlbHRhLnkgKz0gd2VpZ2h0KmRlbHRhLnk7XG5cdFx0XHRcdHRoaXMucG9zaXRpb25EZWx0YS56ICs9IHdlaWdodCpkZWx0YS56O1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBVcGRhdGVzIHRoZSBvdXRwdXQgc2tlbGV0b24gcG9zZSBvZiB0aGUgbm9kZSBiYXNlZCBvbiB0aGUgYmxlbmQgd2VpZ2h0IHZhbHVlcyBnaXZlbiB0byB0aGUgaW5wdXQgbm9kZXMuXG5cdCAqXG5cdCAqIEBwYXJhbSBza2VsZXRvbiBUaGUgc2tlbGV0b24gdXNlZCBieSB0aGUgYW5pbWF0b3IgcmVxdWVzdGluZyB0aGUgb3VwdXQgcG9zZS5cblx0ICovXG5cdHByaXZhdGUgdXBkYXRlU2tlbGV0b25Qb3NlKHNrZWxldG9uOlNrZWxldG9uKVxuXHR7XG5cdFx0dGhpcy5fc2tlbGV0b25Qb3NlRGlydHkgPSBmYWxzZTtcblxuXHRcdHZhciB3ZWlnaHQ6bnVtYmVyO1xuXHRcdHZhciBlbmRQb3NlczpBcnJheTxKb2ludFBvc2U+ID0gdGhpcy5fc2tlbGV0b25Qb3NlLmpvaW50UG9zZXM7XG5cdFx0dmFyIHBvc2VzOkFycmF5PEpvaW50UG9zZT47XG5cdFx0dmFyIGVuZFBvc2U6Sm9pbnRQb3NlLCBwb3NlOkpvaW50UG9zZTtcblx0XHR2YXIgZW5kVHI6VmVjdG9yM0QsIHRyOlZlY3RvcjNEO1xuXHRcdHZhciBlbmRRdWF0OlF1YXRlcm5pb24sIHE6UXVhdGVybmlvbjtcblx0XHR2YXIgZmlyc3RQb3NlOkFycmF5PEpvaW50UG9zZT47XG5cdFx0dmFyIGk6bnVtYmVyIC8qdWludCovO1xuXHRcdHZhciB3MDpudW1iZXIsIHgwOm51bWJlciwgeTA6bnVtYmVyLCB6MDpudW1iZXI7XG5cdFx0dmFyIHcxOm51bWJlciwgeDE6bnVtYmVyLCB5MTpudW1iZXIsIHoxOm51bWJlcjtcblx0XHR2YXIgbnVtSm9pbnRzOm51bWJlciAvKnVpbnQqLyA9IHNrZWxldG9uLm51bUpvaW50cztcblxuXHRcdC8vIDpzXG5cdFx0aWYgKGVuZFBvc2VzLmxlbmd0aCAhPSBudW1Kb2ludHMpXG5cdFx0XHRlbmRQb3Nlcy5sZW5ndGggPSBudW1Kb2ludHM7XG5cblx0XHRmb3IgKHZhciBqOm51bWJlciAvKnVpbnQqLyA9IDA7IGogPCB0aGlzLl9za2VsZXRvbkFuaW1hdGlvbk5vZGUubnVtSW5wdXRzOyArK2opIHtcblx0XHRcdHdlaWdodCA9IHRoaXMuX2JsZW5kV2VpZ2h0c1tqXTtcblxuXHRcdFx0aWYgKCF3ZWlnaHQpXG5cdFx0XHRcdGNvbnRpbnVlO1xuXG5cdFx0XHRwb3NlcyA9IHRoaXMuX2lucHV0c1tqXS5nZXRTa2VsZXRvblBvc2Uoc2tlbGV0b24pLmpvaW50UG9zZXM7XG5cblx0XHRcdGlmICghZmlyc3RQb3NlKSB7XG5cdFx0XHRcdGZpcnN0UG9zZSA9IHBvc2VzO1xuXHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgbnVtSm9pbnRzOyArK2kpIHtcblx0XHRcdFx0XHRlbmRQb3NlID0gZW5kUG9zZXNbaV07XG5cblx0XHRcdFx0XHRpZiAoZW5kUG9zZSA9PSBudWxsKVxuXHRcdFx0XHRcdFx0ZW5kUG9zZSA9IGVuZFBvc2VzW2ldID0gbmV3IEpvaW50UG9zZSgpO1xuXG5cdFx0XHRcdFx0cG9zZSA9IHBvc2VzW2ldO1xuXHRcdFx0XHRcdHEgPSBwb3NlLm9yaWVudGF0aW9uO1xuXHRcdFx0XHRcdHRyID0gcG9zZS50cmFuc2xhdGlvbjtcblxuXHRcdFx0XHRcdGVuZFF1YXQgPSBlbmRQb3NlLm9yaWVudGF0aW9uO1xuXG5cdFx0XHRcdFx0ZW5kUXVhdC54ID0gd2VpZ2h0KnEueDtcblx0XHRcdFx0XHRlbmRRdWF0LnkgPSB3ZWlnaHQqcS55O1xuXHRcdFx0XHRcdGVuZFF1YXQueiA9IHdlaWdodCpxLno7XG5cdFx0XHRcdFx0ZW5kUXVhdC53ID0gd2VpZ2h0KnEudztcblxuXHRcdFx0XHRcdGVuZFRyID0gZW5kUG9zZS50cmFuc2xhdGlvbjtcblx0XHRcdFx0XHRlbmRUci54ID0gd2VpZ2h0KnRyLng7XG5cdFx0XHRcdFx0ZW5kVHIueSA9IHdlaWdodCp0ci55O1xuXHRcdFx0XHRcdGVuZFRyLnogPSB3ZWlnaHQqdHIuejtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IHNrZWxldG9uLm51bUpvaW50czsgKytpKSB7XG5cdFx0XHRcdFx0ZW5kUG9zZSA9IGVuZFBvc2VzW2ldO1xuXHRcdFx0XHRcdHBvc2UgPSBwb3Nlc1tpXTtcblxuXHRcdFx0XHRcdHEgPSBmaXJzdFBvc2VbaV0ub3JpZW50YXRpb247XG5cdFx0XHRcdFx0eDAgPSBxLng7XG5cdFx0XHRcdFx0eTAgPSBxLnk7XG5cdFx0XHRcdFx0ejAgPSBxLno7XG5cdFx0XHRcdFx0dzAgPSBxLnc7XG5cblx0XHRcdFx0XHRxID0gcG9zZS5vcmllbnRhdGlvbjtcblx0XHRcdFx0XHR0ciA9IHBvc2UudHJhbnNsYXRpb247XG5cblx0XHRcdFx0XHR4MSA9IHEueDtcblx0XHRcdFx0XHR5MSA9IHEueTtcblx0XHRcdFx0XHR6MSA9IHEuejtcblx0XHRcdFx0XHR3MSA9IHEudztcblx0XHRcdFx0XHQvLyBmaW5kIHNob3J0ZXN0IGRpcmVjdGlvblxuXHRcdFx0XHRcdGlmICh4MCp4MSArIHkwKnkxICsgejAqejEgKyB3MCp3MSA8IDApIHtcblx0XHRcdFx0XHRcdHgxID0gLXgxO1xuXHRcdFx0XHRcdFx0eTEgPSAteTE7XG5cdFx0XHRcdFx0XHR6MSA9IC16MTtcblx0XHRcdFx0XHRcdHcxID0gLXcxO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbmRRdWF0ID0gZW5kUG9zZS5vcmllbnRhdGlvbjtcblx0XHRcdFx0XHRlbmRRdWF0LnggKz0gd2VpZ2h0KngxO1xuXHRcdFx0XHRcdGVuZFF1YXQueSArPSB3ZWlnaHQqeTE7XG5cdFx0XHRcdFx0ZW5kUXVhdC56ICs9IHdlaWdodCp6MTtcblx0XHRcdFx0XHRlbmRRdWF0LncgKz0gd2VpZ2h0KncxO1xuXG5cdFx0XHRcdFx0ZW5kVHIgPSBlbmRQb3NlLnRyYW5zbGF0aW9uO1xuXHRcdFx0XHRcdGVuZFRyLnggKz0gd2VpZ2h0KnRyLng7XG5cdFx0XHRcdFx0ZW5kVHIueSArPSB3ZWlnaHQqdHIueTtcblx0XHRcdFx0XHRlbmRUci56ICs9IHdlaWdodCp0ci56O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Zm9yIChpID0gMDsgaSA8IHNrZWxldG9uLm51bUpvaW50czsgKytpKVxuXHRcdFx0ZW5kUG9zZXNbaV0ub3JpZW50YXRpb24ubm9ybWFsaXplKCk7XG5cdH1cbn1cblxuZXhwb3J0ID0gU2tlbGV0b25OYXJ5TEVSUFN0YXRlOyJdfQ==