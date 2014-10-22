var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AnimationStateBase = require("awayjs-renderergl/lib/animators/states/AnimationStateBase");
var AnimationStateEvent = require("awayjs-renderergl/lib/events/AnimationStateEvent");
/**
 *
 */
var AnimationClipState = (function (_super) {
    __extends(AnimationClipState, _super);
    function AnimationClipState(animator, animationClipNode) {
        _super.call(this, animator, animationClipNode);
        this._pFramesDirty = true;
        this._animationClipNode = animationClipNode;
    }
    Object.defineProperty(AnimationClipState.prototype, "blendWeight", {
        /**
         * Returns a fractional value between 0 and 1 representing the blending ratio of the current playhead position
         * between the current frame (0) and next frame (1) of the animation.
         *
         * @see #currentFrame
         * @see #nextFrame
         */
        get: function () {
            if (this._pFramesDirty)
                this._pUpdateFrames();
            return this._pBlendWeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationClipState.prototype, "currentFrame", {
        /**
         * Returns the current frame of animation in the clip based on the internal playhead position.
         */
        get: function () {
            if (this._pFramesDirty)
                this._pUpdateFrames();
            return this._pCurrentFrame;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationClipState.prototype, "nextFrame", {
        /**
         * Returns the next frame of animation in the clip based on the internal playhead position.
         */
        get: function () {
            if (this._pFramesDirty)
                this._pUpdateFrames();
            return this._pNextFrame;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    AnimationClipState.prototype.update = function (time /*int*/) {
        if (!this._animationClipNode.looping) {
            if (time > this._pStartTime + this._animationClipNode.totalDuration)
                time = this._pStartTime + this._animationClipNode.totalDuration;
            else if (time < this._pStartTime)
                time = this._pStartTime;
        }
        if (this._pTime == time - this._pStartTime)
            return;
        this._pUpdateTime(time);
    };
    /**
     * @inheritDoc
     */
    AnimationClipState.prototype.phase = function (value) {
        var time = value * this._animationClipNode.totalDuration + this._pStartTime;
        if (this._pTime == time - this._pStartTime)
            return;
        this._pUpdateTime(time);
    };
    /**
     * @inheritDoc
     */
    AnimationClipState.prototype._pUpdateTime = function (time /*int*/) {
        this._pFramesDirty = true;
        this._pTimeDir = (time - this._pStartTime > this._pTime) ? 1 : -1;
        _super.prototype._pUpdateTime.call(this, time);
    };
    /**
     * Updates the nodes internal playhead to determine the current and next animation frame, and the blendWeight between the two.
     *
     * @see #currentFrame
     * @see #nextFrame
     * @see #blendWeight
     */
    AnimationClipState.prototype._pUpdateFrames = function () {
        this._pFramesDirty = false;
        var looping = this._animationClipNode.looping;
        var totalDuration = this._animationClipNode.totalDuration;
        var lastFrame = this._animationClipNode.lastFrame;
        var time = this._pTime;
        //trace("time", time, totalDuration)
        if (looping && (time >= totalDuration || time < 0)) {
            time %= totalDuration;
            if (time < 0)
                time += totalDuration;
        }
        if (!looping && time >= totalDuration) {
            this.notifyPlaybackComplete();
            this._pCurrentFrame = lastFrame;
            this._pNextFrame = lastFrame;
            this._pBlendWeight = 0;
        }
        else if (!looping && time <= 0) {
            this._pCurrentFrame = 0;
            this._pNextFrame = 0;
            this._pBlendWeight = 0;
        }
        else if (this._animationClipNode.fixedFrameRate) {
            var t = time / totalDuration * lastFrame;
            this._pCurrentFrame = Math.floor(t);
            this._pBlendWeight = t - this._pCurrentFrame;
            this._pNextFrame = this._pCurrentFrame + 1;
        }
        else {
            this._pCurrentFrame = 0;
            this._pNextFrame = 0;
            var dur = 0, frameTime /*uint*/;
            var durations = this._animationClipNode.durations;
            do {
                frameTime = dur;
                dur += durations[this._pNextFrame];
                this._pCurrentFrame = this._pNextFrame++;
            } while (time > dur);
            if (this._pCurrentFrame == lastFrame) {
                this._pCurrentFrame = 0;
                this._pNextFrame = 1;
            }
            this._pBlendWeight = (time - frameTime) / durations[this._pCurrentFrame];
        }
    };
    AnimationClipState.prototype.notifyPlaybackComplete = function () {
        if (this._animationStatePlaybackComplete == null)
            this._animationStatePlaybackComplete = new AnimationStateEvent(AnimationStateEvent.PLAYBACK_COMPLETE, this._pAnimator, this, this._animationClipNode);
        this._animationClipNode.dispatchEvent(this._animationStatePlaybackComplete);
    };
    return AnimationClipState;
})(AnimationStateBase);
module.exports = AnimationClipState;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuaW1hdG9ycy9zdGF0ZXMvYW5pbWF0aW9uY2xpcHN0YXRlLnRzIl0sIm5hbWVzIjpbIkFuaW1hdGlvbkNsaXBTdGF0ZSIsIkFuaW1hdGlvbkNsaXBTdGF0ZS5jb25zdHJ1Y3RvciIsIkFuaW1hdGlvbkNsaXBTdGF0ZS5ibGVuZFdlaWdodCIsIkFuaW1hdGlvbkNsaXBTdGF0ZS5jdXJyZW50RnJhbWUiLCJBbmltYXRpb25DbGlwU3RhdGUubmV4dEZyYW1lIiwiQW5pbWF0aW9uQ2xpcFN0YXRlLnVwZGF0ZSIsIkFuaW1hdGlvbkNsaXBTdGF0ZS5waGFzZSIsIkFuaW1hdGlvbkNsaXBTdGF0ZS5fcFVwZGF0ZVRpbWUiLCJBbmltYXRpb25DbGlwU3RhdGUuX3BVcGRhdGVGcmFtZXMiLCJBbmltYXRpb25DbGlwU3RhdGUubm90aWZ5UGxheWJhY2tDb21wbGV0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBR0EsSUFBTyxrQkFBa0IsV0FBYywyREFBMkQsQ0FBQyxDQUFDO0FBQ3BHLElBQU8sbUJBQW1CLFdBQWMsa0RBQWtELENBQUMsQ0FBQztBQUU1RixBQUdBOztHQURHO0lBQ0csa0JBQWtCO0lBQVNBLFVBQTNCQSxrQkFBa0JBLFVBQTJCQTtJQWlEbERBLFNBakRLQSxrQkFBa0JBLENBaURYQSxRQUFxQkEsRUFBRUEsaUJBQXVDQTtRQUV6RUMsa0JBQU1BLFFBQVFBLEVBQUVBLGlCQUFpQkEsQ0FBQ0EsQ0FBQ0E7UUF6QzdCQSxrQkFBYUEsR0FBV0EsSUFBSUEsQ0FBQ0E7UUEyQ25DQSxJQUFJQSxDQUFDQSxrQkFBa0JBLEdBQUdBLGlCQUFpQkEsQ0FBQ0E7SUFDN0NBLENBQUNBO0lBbkNERCxzQkFBV0EsMkNBQVdBO1FBUHRCQTs7Ozs7O1dBTUdBO2FBQ0hBO1lBRUNFLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBO2dCQUN0QkEsSUFBSUEsQ0FBQ0EsY0FBY0EsRUFBRUEsQ0FBQ0E7WUFFdkJBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBO1FBQzNCQSxDQUFDQTs7O09BQUFGO0lBS0RBLHNCQUFXQSw0Q0FBWUE7UUFIdkJBOztXQUVHQTthQUNIQTtZQUVDRyxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQTtnQkFDdEJBLElBQUlBLENBQUNBLGNBQWNBLEVBQUVBLENBQUNBO1lBRXZCQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQTtRQUM1QkEsQ0FBQ0E7OztPQUFBSDtJQUtEQSxzQkFBV0EseUNBQVNBO1FBSHBCQTs7V0FFR0E7YUFDSEE7WUFFQ0ksRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0E7Z0JBQ3RCQSxJQUFJQSxDQUFDQSxjQUFjQSxFQUFFQSxDQUFDQTtZQUV2QkEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7UUFDekJBLENBQUNBOzs7T0FBQUo7SUFTREE7O09BRUdBO0lBQ0lBLG1DQUFNQSxHQUFiQSxVQUFjQSxJQUFJQSxDQUFRQSxPQUFEQSxBQUFRQTtRQUVoQ0ssRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0Esa0JBQWtCQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN0Q0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsR0FBR0EsSUFBSUEsQ0FBQ0Esa0JBQWtCQSxDQUFDQSxhQUFhQSxDQUFDQTtnQkFDbkVBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLEdBQUdBLElBQUlBLENBQUNBLGtCQUFrQkEsQ0FBQ0EsYUFBYUEsQ0FBQ0E7WUFBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7Z0JBQ2xHQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQTtRQUMxQkEsQ0FBQ0E7UUFFREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7WUFDMUNBLE1BQU1BLENBQUNBO1FBRVJBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO0lBQ3pCQSxDQUFDQTtJQUVETDs7T0FFR0E7SUFDSUEsa0NBQUtBLEdBQVpBLFVBQWFBLEtBQVlBO1FBRXhCTSxJQUFJQSxJQUFJQSxHQUFrQkEsS0FBS0EsR0FBQ0EsSUFBSUEsQ0FBQ0Esa0JBQWtCQSxDQUFDQSxhQUFhQSxHQUFHQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQTtRQUV6RkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7WUFDMUNBLE1BQU1BLENBQUNBO1FBRVJBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO0lBQ3pCQSxDQUFDQTtJQUVETjs7T0FFR0E7SUFDSUEseUNBQVlBLEdBQW5CQSxVQUFvQkEsSUFBSUEsQ0FBUUEsT0FBREEsQUFBUUE7UUFFdENPLElBQUlBLENBQUNBLGFBQWFBLEdBQUdBLElBQUlBLENBQUNBO1FBRTFCQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxDQUFDQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxXQUFXQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxHQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUVqRUEsZ0JBQUtBLENBQUNBLFlBQVlBLFlBQUNBLElBQUlBLENBQUNBLENBQUNBO0lBQzFCQSxDQUFDQTtJQUVEUDs7Ozs7O09BTUdBO0lBQ0lBLDJDQUFjQSxHQUFyQkE7UUFFQ1EsSUFBSUEsQ0FBQ0EsYUFBYUEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFFM0JBLElBQUlBLE9BQU9BLEdBQVdBLElBQUlBLENBQUNBLGtCQUFrQkEsQ0FBQ0EsT0FBT0EsQ0FBQ0E7UUFDdERBLElBQUlBLGFBQWFBLEdBQW1CQSxJQUFJQSxDQUFDQSxrQkFBa0JBLENBQUNBLGFBQWFBLENBQUNBO1FBQzFFQSxJQUFJQSxTQUFTQSxHQUFtQkEsSUFBSUEsQ0FBQ0Esa0JBQWtCQSxDQUFDQSxTQUFTQSxDQUFDQTtRQUNsRUEsSUFBSUEsSUFBSUEsR0FBa0JBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBO1FBRXRDQSxBQUNBQSxvQ0FEb0NBO1FBQ3BDQSxFQUFFQSxDQUFDQSxDQUFDQSxPQUFPQSxJQUFJQSxDQUFDQSxJQUFJQSxJQUFJQSxhQUFhQSxJQUFJQSxJQUFJQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNwREEsSUFBSUEsSUFBSUEsYUFBYUEsQ0FBQ0E7WUFDdEJBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLEdBQUdBLENBQUNBLENBQUNBO2dCQUNaQSxJQUFJQSxJQUFJQSxhQUFhQSxDQUFDQTtRQUN4QkEsQ0FBQ0E7UUFFREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsT0FBT0EsSUFBSUEsSUFBSUEsSUFBSUEsYUFBYUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDdkNBLElBQUlBLENBQUNBLHNCQUFzQkEsRUFBRUEsQ0FBQ0E7WUFDOUJBLElBQUlBLENBQUNBLGNBQWNBLEdBQUdBLFNBQVNBLENBQUNBO1lBQ2hDQSxJQUFJQSxDQUFDQSxXQUFXQSxHQUFHQSxTQUFTQSxDQUFDQTtZQUM3QkEsSUFBSUEsQ0FBQ0EsYUFBYUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDeEJBLENBQUNBO1FBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLE9BQU9BLElBQUlBLElBQUlBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2xDQSxJQUFJQSxDQUFDQSxjQUFjQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUN4QkEsSUFBSUEsQ0FBQ0EsV0FBV0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDckJBLElBQUlBLENBQUNBLGFBQWFBLEdBQUdBLENBQUNBLENBQUNBO1FBQ3hCQSxDQUFDQTtRQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxrQkFBa0JBLENBQUNBLGNBQWNBLENBQUNBLENBQUNBLENBQUNBO1lBQ25EQSxJQUFJQSxDQUFDQSxHQUFVQSxJQUFJQSxHQUFDQSxhQUFhQSxHQUFDQSxTQUFTQSxDQUFDQTtZQUM1Q0EsSUFBSUEsQ0FBQ0EsY0FBY0EsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDcENBLElBQUlBLENBQUNBLGFBQWFBLEdBQUdBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBO1lBQzdDQSxJQUFJQSxDQUFDQSxXQUFXQSxHQUFHQSxJQUFJQSxDQUFDQSxjQUFjQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUM1Q0EsQ0FBQ0E7UUFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDUEEsSUFBSUEsQ0FBQ0EsY0FBY0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDeEJBLElBQUlBLENBQUNBLFdBQVdBLEdBQUdBLENBQUNBLENBQUNBO1lBRXJCQSxJQUFJQSxHQUFHQSxHQUFtQkEsQ0FBQ0EsRUFBRUEsU0FBU0EsQ0FBUUEsUUFBREEsQUFBU0EsQ0FBQ0E7WUFDdkRBLElBQUlBLFNBQVNBLEdBQTBCQSxJQUFJQSxDQUFDQSxrQkFBa0JBLENBQUNBLFNBQVNBLENBQUNBO1lBRXpFQSxHQUFHQSxDQUFDQTtnQkFDSEEsU0FBU0EsR0FBR0EsR0FBR0EsQ0FBQ0E7Z0JBQ2hCQSxHQUFHQSxJQUFJQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQTtnQkFDbkNBLElBQUlBLENBQUNBLGNBQWNBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLEVBQUVBLENBQUNBO1lBQzFDQSxDQUFDQSxRQUFRQSxJQUFJQSxHQUFHQSxHQUFHQSxFQUFFQTtZQUVyQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsY0FBY0EsSUFBSUEsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3RDQSxJQUFJQSxDQUFDQSxjQUFjQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFDeEJBLElBQUlBLENBQUNBLFdBQVdBLEdBQUdBLENBQUNBLENBQUNBO1lBQ3RCQSxDQUFDQTtZQUVEQSxJQUFJQSxDQUFDQSxhQUFhQSxHQUFHQSxDQUFDQSxJQUFJQSxHQUFHQSxTQUFTQSxDQUFDQSxHQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxDQUFDQTtRQUN4RUEsQ0FBQ0E7SUFDRkEsQ0FBQ0E7SUFFT1IsbURBQXNCQSxHQUE5QkE7UUFFQ1MsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsK0JBQStCQSxJQUFJQSxJQUFJQSxDQUFDQTtZQUNoREEsSUFBSUEsQ0FBQ0EsK0JBQStCQSxHQUFHQSxJQUFJQSxtQkFBbUJBLENBQUNBLG1CQUFtQkEsQ0FBQ0EsaUJBQWlCQSxFQUFFQSxJQUFJQSxDQUFDQSxVQUFVQSxFQUFFQSxJQUFJQSxFQUFFQSxJQUFJQSxDQUFDQSxrQkFBa0JBLENBQUNBLENBQUNBO1FBRXZKQSxJQUFJQSxDQUFDQSxrQkFBa0JBLENBQUNBLGFBQWFBLENBQUNBLElBQUlBLENBQUNBLCtCQUErQkEsQ0FBQ0EsQ0FBQ0E7SUFDN0VBLENBQUNBO0lBQ0ZULHlCQUFDQTtBQUFEQSxDQXBLQSxBQW9LQ0EsRUFwS2dDLGtCQUFrQixFQW9LbEQ7QUFFRCxBQUE0QixpQkFBbkIsa0JBQWtCLENBQUMiLCJmaWxlIjoiYW5pbWF0b3JzL3N0YXRlcy9BbmltYXRpb25DbGlwU3RhdGUuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL3JvYmJhdGVtYW4vV2Vic3Rvcm1Qcm9qZWN0cy9hd2F5anMtcmVuZGVyZXJnbC8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQW5pbWF0b3JCYXNlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2FuaW1hdG9ycy9BbmltYXRvckJhc2VcIik7XG5cbmltcG9ydCBBbmltYXRpb25DbGlwTm9kZUJhc2VcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL25vZGVzL0FuaW1hdGlvbkNsaXBOb2RlQmFzZVwiKTtcbmltcG9ydCBBbmltYXRpb25TdGF0ZUJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvc3RhdGVzL0FuaW1hdGlvblN0YXRlQmFzZVwiKTtcbmltcG9ydCBBbmltYXRpb25TdGF0ZUV2ZW50XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvZXZlbnRzL0FuaW1hdGlvblN0YXRlRXZlbnRcIik7XG5cbi8qKlxuICpcbiAqL1xuY2xhc3MgQW5pbWF0aW9uQ2xpcFN0YXRlIGV4dGVuZHMgQW5pbWF0aW9uU3RhdGVCYXNlXG57XG5cdHByaXZhdGUgX2FuaW1hdGlvbkNsaXBOb2RlOkFuaW1hdGlvbkNsaXBOb2RlQmFzZTtcblx0cHJpdmF0ZSBfYW5pbWF0aW9uU3RhdGVQbGF5YmFja0NvbXBsZXRlOkFuaW1hdGlvblN0YXRlRXZlbnQ7XG5cdHB1YmxpYyBfcEJsZW5kV2VpZ2h0Om51bWJlcjtcblx0cHVibGljIF9wQ3VycmVudEZyYW1lOm51bWJlciAvKnVpbnQqLztcblx0cHVibGljIF9wTmV4dEZyYW1lOm51bWJlciAvKnVpbnQqLztcblxuXHRwdWJsaWMgX3BPbGRGcmFtZTpudW1iZXIgLyp1aW50Ki87XG5cdHB1YmxpYyBfcFRpbWVEaXI6bnVtYmVyIC8qaW50Ki87XG5cdHB1YmxpYyBfcEZyYW1lc0RpcnR5OmJvb2xlYW4gPSB0cnVlO1xuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGEgZnJhY3Rpb25hbCB2YWx1ZSBiZXR3ZWVuIDAgYW5kIDEgcmVwcmVzZW50aW5nIHRoZSBibGVuZGluZyByYXRpbyBvZiB0aGUgY3VycmVudCBwbGF5aGVhZCBwb3NpdGlvblxuXHQgKiBiZXR3ZWVuIHRoZSBjdXJyZW50IGZyYW1lICgwKSBhbmQgbmV4dCBmcmFtZSAoMSkgb2YgdGhlIGFuaW1hdGlvbi5cblx0ICpcblx0ICogQHNlZSAjY3VycmVudEZyYW1lXG5cdCAqIEBzZWUgI25leHRGcmFtZVxuXHQgKi9cblx0cHVibGljIGdldCBibGVuZFdlaWdodCgpOm51bWJlclxuXHR7XG5cdFx0aWYgKHRoaXMuX3BGcmFtZXNEaXJ0eSlcblx0XHRcdHRoaXMuX3BVcGRhdGVGcmFtZXMoKTtcblxuXHRcdHJldHVybiB0aGlzLl9wQmxlbmRXZWlnaHQ7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgY3VycmVudCBmcmFtZSBvZiBhbmltYXRpb24gaW4gdGhlIGNsaXAgYmFzZWQgb24gdGhlIGludGVybmFsIHBsYXloZWFkIHBvc2l0aW9uLlxuXHQgKi9cblx0cHVibGljIGdldCBjdXJyZW50RnJhbWUoKTpudW1iZXIgLyp1aW50Ki9cblx0e1xuXHRcdGlmICh0aGlzLl9wRnJhbWVzRGlydHkpXG5cdFx0XHR0aGlzLl9wVXBkYXRlRnJhbWVzKCk7XG5cblx0XHRyZXR1cm4gdGhpcy5fcEN1cnJlbnRGcmFtZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBuZXh0IGZyYW1lIG9mIGFuaW1hdGlvbiBpbiB0aGUgY2xpcCBiYXNlZCBvbiB0aGUgaW50ZXJuYWwgcGxheWhlYWQgcG9zaXRpb24uXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IG5leHRGcmFtZSgpOm51bWJlciAvKnVpbnQqL1xuXHR7XG5cdFx0aWYgKHRoaXMuX3BGcmFtZXNEaXJ0eSlcblx0XHRcdHRoaXMuX3BVcGRhdGVGcmFtZXMoKTtcblxuXHRcdHJldHVybiB0aGlzLl9wTmV4dEZyYW1lO1xuXHR9XG5cblx0Y29uc3RydWN0b3IoYW5pbWF0b3I6QW5pbWF0b3JCYXNlLCBhbmltYXRpb25DbGlwTm9kZTpBbmltYXRpb25DbGlwTm9kZUJhc2UpXG5cdHtcblx0XHRzdXBlcihhbmltYXRvciwgYW5pbWF0aW9uQ2xpcE5vZGUpO1xuXG5cdFx0dGhpcy5fYW5pbWF0aW9uQ2xpcE5vZGUgPSBhbmltYXRpb25DbGlwTm9kZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIHVwZGF0ZSh0aW1lOm51bWJlciAvKmludCovKVxuXHR7XG5cdFx0aWYgKCF0aGlzLl9hbmltYXRpb25DbGlwTm9kZS5sb29waW5nKSB7XG5cdFx0XHRpZiAodGltZSA+IHRoaXMuX3BTdGFydFRpbWUgKyB0aGlzLl9hbmltYXRpb25DbGlwTm9kZS50b3RhbER1cmF0aW9uKVxuXHRcdFx0XHR0aW1lID0gdGhpcy5fcFN0YXJ0VGltZSArIHRoaXMuX2FuaW1hdGlvbkNsaXBOb2RlLnRvdGFsRHVyYXRpb247IGVsc2UgaWYgKHRpbWUgPCB0aGlzLl9wU3RhcnRUaW1lKVxuXHRcdFx0XHR0aW1lID0gdGhpcy5fcFN0YXJ0VGltZTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5fcFRpbWUgPT0gdGltZSAtIHRoaXMuX3BTdGFydFRpbWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl9wVXBkYXRlVGltZSh0aW1lKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIHBoYXNlKHZhbHVlOm51bWJlcilcblx0e1xuXHRcdHZhciB0aW1lOm51bWJlciAvKmludCovID0gdmFsdWUqdGhpcy5fYW5pbWF0aW9uQ2xpcE5vZGUudG90YWxEdXJhdGlvbiArIHRoaXMuX3BTdGFydFRpbWU7XG5cblx0XHRpZiAodGhpcy5fcFRpbWUgPT0gdGltZSAtIHRoaXMuX3BTdGFydFRpbWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl9wVXBkYXRlVGltZSh0aW1lKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIF9wVXBkYXRlVGltZSh0aW1lOm51bWJlciAvKmludCovKVxuXHR7XG5cdFx0dGhpcy5fcEZyYW1lc0RpcnR5ID0gdHJ1ZTtcblxuXHRcdHRoaXMuX3BUaW1lRGlyID0gKHRpbWUgLSB0aGlzLl9wU3RhcnRUaW1lID4gdGhpcy5fcFRpbWUpPyAxIDogLTE7XG5cblx0XHRzdXBlci5fcFVwZGF0ZVRpbWUodGltZSk7XG5cdH1cblxuXHQvKipcblx0ICogVXBkYXRlcyB0aGUgbm9kZXMgaW50ZXJuYWwgcGxheWhlYWQgdG8gZGV0ZXJtaW5lIHRoZSBjdXJyZW50IGFuZCBuZXh0IGFuaW1hdGlvbiBmcmFtZSwgYW5kIHRoZSBibGVuZFdlaWdodCBiZXR3ZWVuIHRoZSB0d28uXG5cdCAqXG5cdCAqIEBzZWUgI2N1cnJlbnRGcmFtZVxuXHQgKiBAc2VlICNuZXh0RnJhbWVcblx0ICogQHNlZSAjYmxlbmRXZWlnaHRcblx0ICovXG5cdHB1YmxpYyBfcFVwZGF0ZUZyYW1lcygpXG5cdHtcblx0XHR0aGlzLl9wRnJhbWVzRGlydHkgPSBmYWxzZTtcblxuXHRcdHZhciBsb29waW5nOmJvb2xlYW4gPSB0aGlzLl9hbmltYXRpb25DbGlwTm9kZS5sb29waW5nO1xuXHRcdHZhciB0b3RhbER1cmF0aW9uOm51bWJlciAvKnVpbnQqLyA9IHRoaXMuX2FuaW1hdGlvbkNsaXBOb2RlLnRvdGFsRHVyYXRpb247XG5cdFx0dmFyIGxhc3RGcmFtZTpudW1iZXIgLyp1aW50Ki8gPSB0aGlzLl9hbmltYXRpb25DbGlwTm9kZS5sYXN0RnJhbWU7XG5cdFx0dmFyIHRpbWU6bnVtYmVyIC8qaW50Ki8gPSB0aGlzLl9wVGltZTtcblxuXHRcdC8vdHJhY2UoXCJ0aW1lXCIsIHRpbWUsIHRvdGFsRHVyYXRpb24pXG5cdFx0aWYgKGxvb3BpbmcgJiYgKHRpbWUgPj0gdG90YWxEdXJhdGlvbiB8fCB0aW1lIDwgMCkpIHtcblx0XHRcdHRpbWUgJT0gdG90YWxEdXJhdGlvbjtcblx0XHRcdGlmICh0aW1lIDwgMClcblx0XHRcdFx0dGltZSArPSB0b3RhbER1cmF0aW9uO1xuXHRcdH1cblxuXHRcdGlmICghbG9vcGluZyAmJiB0aW1lID49IHRvdGFsRHVyYXRpb24pIHtcblx0XHRcdHRoaXMubm90aWZ5UGxheWJhY2tDb21wbGV0ZSgpO1xuXHRcdFx0dGhpcy5fcEN1cnJlbnRGcmFtZSA9IGxhc3RGcmFtZTtcblx0XHRcdHRoaXMuX3BOZXh0RnJhbWUgPSBsYXN0RnJhbWU7XG5cdFx0XHR0aGlzLl9wQmxlbmRXZWlnaHQgPSAwO1xuXHRcdH0gZWxzZSBpZiAoIWxvb3BpbmcgJiYgdGltZSA8PSAwKSB7XG5cdFx0XHR0aGlzLl9wQ3VycmVudEZyYW1lID0gMDtcblx0XHRcdHRoaXMuX3BOZXh0RnJhbWUgPSAwO1xuXHRcdFx0dGhpcy5fcEJsZW5kV2VpZ2h0ID0gMDtcblx0XHR9IGVsc2UgaWYgKHRoaXMuX2FuaW1hdGlvbkNsaXBOb2RlLmZpeGVkRnJhbWVSYXRlKSB7XG5cdFx0XHR2YXIgdDpudW1iZXIgPSB0aW1lL3RvdGFsRHVyYXRpb24qbGFzdEZyYW1lO1xuXHRcdFx0dGhpcy5fcEN1cnJlbnRGcmFtZSA9IE1hdGguZmxvb3IodCk7XG5cdFx0XHR0aGlzLl9wQmxlbmRXZWlnaHQgPSB0IC0gdGhpcy5fcEN1cnJlbnRGcmFtZTtcblx0XHRcdHRoaXMuX3BOZXh0RnJhbWUgPSB0aGlzLl9wQ3VycmVudEZyYW1lICsgMTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5fcEN1cnJlbnRGcmFtZSA9IDA7XG5cdFx0XHR0aGlzLl9wTmV4dEZyYW1lID0gMDtcblxuXHRcdFx0dmFyIGR1cjpudW1iZXIgLyp1aW50Ki8gPSAwLCBmcmFtZVRpbWU6bnVtYmVyIC8qdWludCovO1xuXHRcdFx0dmFyIGR1cmF0aW9uczpBcnJheTxudW1iZXI+IC8qdWludCovID0gdGhpcy5fYW5pbWF0aW9uQ2xpcE5vZGUuZHVyYXRpb25zO1xuXG5cdFx0XHRkbyB7XG5cdFx0XHRcdGZyYW1lVGltZSA9IGR1cjtcblx0XHRcdFx0ZHVyICs9IGR1cmF0aW9uc1t0aGlzLl9wTmV4dEZyYW1lXTtcblx0XHRcdFx0dGhpcy5fcEN1cnJlbnRGcmFtZSA9IHRoaXMuX3BOZXh0RnJhbWUrKztcblx0XHRcdH0gd2hpbGUgKHRpbWUgPiBkdXIpO1xuXG5cdFx0XHRpZiAodGhpcy5fcEN1cnJlbnRGcmFtZSA9PSBsYXN0RnJhbWUpIHtcblx0XHRcdFx0dGhpcy5fcEN1cnJlbnRGcmFtZSA9IDA7XG5cdFx0XHRcdHRoaXMuX3BOZXh0RnJhbWUgPSAxO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLl9wQmxlbmRXZWlnaHQgPSAodGltZSAtIGZyYW1lVGltZSkvZHVyYXRpb25zW3RoaXMuX3BDdXJyZW50RnJhbWVdO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgbm90aWZ5UGxheWJhY2tDb21wbGV0ZSgpXG5cdHtcblx0XHRpZiAodGhpcy5fYW5pbWF0aW9uU3RhdGVQbGF5YmFja0NvbXBsZXRlID09IG51bGwpXG5cdFx0XHR0aGlzLl9hbmltYXRpb25TdGF0ZVBsYXliYWNrQ29tcGxldGUgPSBuZXcgQW5pbWF0aW9uU3RhdGVFdmVudChBbmltYXRpb25TdGF0ZUV2ZW50LlBMQVlCQUNLX0NPTVBMRVRFLCB0aGlzLl9wQW5pbWF0b3IsIHRoaXMsIHRoaXMuX2FuaW1hdGlvbkNsaXBOb2RlKTtcblxuXHRcdHRoaXMuX2FuaW1hdGlvbkNsaXBOb2RlLmRpc3BhdGNoRXZlbnQodGhpcy5fYW5pbWF0aW9uU3RhdGVQbGF5YmFja0NvbXBsZXRlKTtcblx0fVxufVxuXG5leHBvcnQgPSBBbmltYXRpb25DbGlwU3RhdGU7Il19