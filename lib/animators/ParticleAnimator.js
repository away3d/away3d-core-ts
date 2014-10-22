var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AnimatorBase = require("awayjs-stagegl/lib/animators/AnimatorBase");
var ContextGLProgramType = require("awayjs-stagegl/lib/core/stagegl/ContextGLProgramType");
var AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
var ParticlePropertiesMode = require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
/**
 * Provides an interface for assigning paricle-based animation data sets to mesh-based entity objects
 * and controlling the various available states of animation through an interative playhead that can be
 * automatically updated or manually triggered.
 *
 * Requires that the containing geometry of the parent mesh is particle geometry
 *
 * @see away.base.ParticleGeometry
 */
var ParticleAnimator = (function (_super) {
    __extends(ParticleAnimator, _super);
    /**
     * Creates a new <code>ParticleAnimator</code> object.
     *
     * @param particleAnimationSet The animation data set containing the particle animations used by the animator.
     */
    function ParticleAnimator(particleAnimationSet) {
        _super.call(this, particleAnimationSet);
        this._animationParticleStates = new Array();
        this._animatorParticleStates = new Array();
        this._timeParticleStates = new Array();
        this._totalLenOfOneVertex = 0;
        this._animatorSubGeometries = new Object();
        this._particleAnimationSet = particleAnimationSet;
        var state;
        var node;
        for (var i = 0; i < this._particleAnimationSet.particleNodes.length; i++) {
            node = this._particleAnimationSet.particleNodes[i];
            state = this.getAnimationState(node);
            if (node.mode == ParticlePropertiesMode.LOCAL_DYNAMIC) {
                this._animatorParticleStates.push(state);
                node._iDataOffset = this._totalLenOfOneVertex;
                this._totalLenOfOneVertex += node.dataLength;
            }
            else {
                this._animationParticleStates.push(state);
            }
            if (state.needUpdateTime)
                this._timeParticleStates.push(state);
        }
    }
    /**
     * @inheritDoc
     */
    ParticleAnimator.prototype.clone = function () {
        return new ParticleAnimator(this._particleAnimationSet);
    };
    /**
     * @inheritDoc
     */
    ParticleAnimator.prototype.setRenderState = function (shaderObject, renderable, stage, camera, vertexConstantOffset /*int*/, vertexStreamOffset /*int*/) {
        var animationRegisterCache = this._particleAnimationSet._iAnimationRegisterCache;
        var subMesh = renderable.subMesh;
        var state;
        var i;
        if (!subMesh)
            throw (new Error("Must be subMesh"));
        //process animation sub geometries
        var animationSubGeometry = this._particleAnimationSet.getAnimationSubGeometry(subMesh);
        for (i = 0; i < this._animationParticleStates.length; i++)
            this._animationParticleStates[i].setRenderState(stage, renderable, animationSubGeometry, animationRegisterCache, camera);
        //process animator subgeometries
        var animatorSubGeometry = this.getAnimatorSubGeometry(subMesh);
        for (i = 0; i < this._animatorParticleStates.length; i++)
            this._animatorParticleStates[i].setRenderState(stage, renderable, animatorSubGeometry, animationRegisterCache, camera);
        stage.context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, animationRegisterCache.vertexConstantOffset, animationRegisterCache.vertexConstantData, animationRegisterCache.numVertexConstant);
        if (animationRegisterCache.numFragmentConstant > 0)
            stage.context.setProgramConstantsFromArray(ContextGLProgramType.FRAGMENT, animationRegisterCache.fragmentConstantOffset, animationRegisterCache.fragmentConstantData, animationRegisterCache.numFragmentConstant);
    };
    /**
     * @inheritDoc
     */
    ParticleAnimator.prototype.testGPUCompatibility = function (shaderObject) {
    };
    /**
     * @inheritDoc
     */
    ParticleAnimator.prototype.start = function () {
        _super.prototype.start.call(this);
        for (var i = 0; i < this._timeParticleStates.length; i++)
            this._timeParticleStates[i].offset(this._pAbsoluteTime);
    };
    /**
     * @inheritDoc
     */
    ParticleAnimator.prototype._pUpdateDeltaTime = function (dt) {
        this._pAbsoluteTime += dt;
        for (var i = 0; i < this._timeParticleStates.length; i++)
            this._timeParticleStates[i].update(this._pAbsoluteTime);
    };
    /**
     * @inheritDoc
     */
    ParticleAnimator.prototype.resetTime = function (offset) {
        if (offset === void 0) { offset = 0; }
        for (var i = 0; i < this._timeParticleStates.length; i++)
            this._timeParticleStates[i].offset(this._pAbsoluteTime + offset);
        this.update(this.time);
    };
    ParticleAnimator.prototype.dispose = function () {
        for (var key in this._animatorSubGeometries)
            this._animatorSubGeometries[key].dispose();
    };
    ParticleAnimator.prototype.getAnimatorSubGeometry = function (subMesh) {
        if (!this._animatorParticleStates.length)
            return;
        var subGeometry = subMesh.subGeometry;
        var animatorSubGeometry = this._animatorSubGeometries[subGeometry.id] = new AnimationSubGeometry();
        //create the vertexData vector that will be used for local state data
        animatorSubGeometry.createVertexData(subGeometry.numVertices, this._totalLenOfOneVertex);
        //pass the particles data to the animator subGeometry
        animatorSubGeometry.animationParticles = this._particleAnimationSet.getAnimationSubGeometry(subMesh).animationParticles;
    };
    return ParticleAnimator;
})(AnimatorBase);
module.exports = ParticleAnimator;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuaW1hdG9ycy9wYXJ0aWNsZWFuaW1hdG9yLnRzIl0sIm5hbWVzIjpbIlBhcnRpY2xlQW5pbWF0b3IiLCJQYXJ0aWNsZUFuaW1hdG9yLmNvbnN0cnVjdG9yIiwiUGFydGljbGVBbmltYXRvci5jbG9uZSIsIlBhcnRpY2xlQW5pbWF0b3Iuc2V0UmVuZGVyU3RhdGUiLCJQYXJ0aWNsZUFuaW1hdG9yLnRlc3RHUFVDb21wYXRpYmlsaXR5IiwiUGFydGljbGVBbmltYXRvci5zdGFydCIsIlBhcnRpY2xlQW5pbWF0b3IuX3BVcGRhdGVEZWx0YVRpbWUiLCJQYXJ0aWNsZUFuaW1hdG9yLnJlc2V0VGltZSIsIlBhcnRpY2xlQW5pbWF0b3IuZGlzcG9zZSIsIlBhcnRpY2xlQW5pbWF0b3IuZ2V0QW5pbWF0b3JTdWJHZW9tZXRyeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBSUEsSUFBTyxZQUFZLFdBQWdCLDJDQUEyQyxDQUFDLENBQUM7QUFLaEYsSUFBTyxvQkFBb0IsV0FBYyxzREFBc0QsQ0FBQyxDQUFDO0FBS2pHLElBQU8sb0JBQW9CLFdBQWMsMkRBQTJELENBQUMsQ0FBQztBQUV0RyxJQUFPLHNCQUFzQixXQUFhLDZEQUE2RCxDQUFDLENBQUM7QUFJekcsQUFTQTs7Ozs7Ozs7R0FERztJQUNHLGdCQUFnQjtJQUFTQSxVQUF6QkEsZ0JBQWdCQSxVQUFxQkE7SUFVMUNBOzs7O09BSUdBO0lBQ0hBLFNBZktBLGdCQUFnQkEsQ0FlVEEsb0JBQXlDQTtRQUVwREMsa0JBQU1BLG9CQUFvQkEsQ0FBQ0EsQ0FBQ0E7UUFickJBLDZCQUF3QkEsR0FBNEJBLElBQUlBLEtBQUtBLEVBQXFCQSxDQUFDQTtRQUNuRkEsNEJBQXVCQSxHQUE0QkEsSUFBSUEsS0FBS0EsRUFBcUJBLENBQUNBO1FBQ2xGQSx3QkFBbUJBLEdBQTRCQSxJQUFJQSxLQUFLQSxFQUFxQkEsQ0FBQ0E7UUFDOUVBLHlCQUFvQkEsR0FBbUJBLENBQUNBLENBQUNBO1FBQ3pDQSwyQkFBc0JBLEdBQVVBLElBQUlBLE1BQU1BLEVBQUVBLENBQUNBO1FBVXBEQSxJQUFJQSxDQUFDQSxxQkFBcUJBLEdBQUdBLG9CQUFvQkEsQ0FBQ0E7UUFFbERBLElBQUlBLEtBQXVCQSxDQUFDQTtRQUM1QkEsSUFBSUEsSUFBcUJBLENBQUNBO1FBRTFCQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFVQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxxQkFBcUJBLENBQUNBLGFBQWFBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO1lBQ2pGQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxxQkFBcUJBLENBQUNBLGFBQWFBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ25EQSxLQUFLQSxHQUF1QkEsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUN6REEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsSUFBSUEsc0JBQXNCQSxDQUFDQSxhQUFhQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDdkRBLElBQUlBLENBQUNBLHVCQUF1QkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3pDQSxJQUFJQSxDQUFDQSxZQUFZQSxHQUFHQSxJQUFJQSxDQUFDQSxvQkFBb0JBLENBQUNBO2dCQUM5Q0EsSUFBSUEsQ0FBQ0Esb0JBQW9CQSxJQUFJQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQTtZQUM5Q0EsQ0FBQ0E7WUFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ1BBLElBQUlBLENBQUNBLHdCQUF3QkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7WUFDM0NBLENBQUNBO1lBQ0RBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLGNBQWNBLENBQUNBO2dCQUN4QkEsSUFBSUEsQ0FBQ0EsbUJBQW1CQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUN2Q0EsQ0FBQ0E7SUFDRkEsQ0FBQ0E7SUFFREQ7O09BRUdBO0lBQ0lBLGdDQUFLQSxHQUFaQTtRQUVDRSxNQUFNQSxDQUFDQSxJQUFJQSxnQkFBZ0JBLENBQUNBLElBQUlBLENBQUNBLHFCQUFxQkEsQ0FBQ0EsQ0FBQ0E7SUFDekRBLENBQUNBO0lBRURGOztPQUVHQTtJQUNJQSx5Q0FBY0EsR0FBckJBLFVBQXNCQSxZQUE2QkEsRUFBRUEsVUFBeUJBLEVBQUVBLEtBQVdBLEVBQUVBLE1BQWFBLEVBQUVBLG9CQUFvQkEsQ0FBUUEsT0FBREEsQUFBUUEsRUFBRUEsa0JBQWtCQSxDQUFRQSxPQUFEQSxBQUFRQTtRQUVqTEcsSUFBSUEsc0JBQXNCQSxHQUEwQkEsSUFBSUEsQ0FBQ0EscUJBQXFCQSxDQUFDQSx3QkFBd0JBLENBQUNBO1FBRXhHQSxJQUFJQSxPQUFPQSxHQUF5Q0EsVUFBV0EsQ0FBQ0EsT0FBT0EsQ0FBQ0E7UUFDeEVBLElBQUlBLEtBQXVCQSxDQUFDQTtRQUM1QkEsSUFBSUEsQ0FBUUEsQ0FBQ0E7UUFFYkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0E7WUFDWkEsTUFBS0EsQ0FBQ0EsSUFBSUEsS0FBS0EsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUVyQ0EsQUFDQUEsa0NBRGtDQTtZQUM5QkEsb0JBQW9CQSxHQUF3QkEsSUFBSUEsQ0FBQ0EscUJBQXFCQSxDQUFDQSx1QkFBdUJBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBO1FBRTVHQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSx3QkFBd0JBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBO1lBQ3hEQSxJQUFJQSxDQUFDQSx3QkFBd0JBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLGNBQWNBLENBQUNBLEtBQUtBLEVBQUVBLFVBQVVBLEVBQUVBLG9CQUFvQkEsRUFBRUEsc0JBQXNCQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQTtRQUUxSEEsQUFDQUEsZ0NBRGdDQTtZQUM1QkEsbUJBQW1CQSxHQUF3QkEsSUFBSUEsQ0FBQ0Esc0JBQXNCQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtRQUVwRkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsdUJBQXVCQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQTtZQUN2REEsSUFBSUEsQ0FBQ0EsdUJBQXVCQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxjQUFjQSxDQUFDQSxLQUFLQSxFQUFFQSxVQUFVQSxFQUFFQSxtQkFBbUJBLEVBQUVBLHNCQUFzQkEsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0E7UUFFckdBLEtBQUtBLENBQUNBLE9BQVFBLENBQUNBLDRCQUE0QkEsQ0FBQ0Esb0JBQW9CQSxDQUFDQSxNQUFNQSxFQUFFQSxzQkFBc0JBLENBQUNBLG9CQUFvQkEsRUFBRUEsc0JBQXNCQSxDQUFDQSxrQkFBa0JBLEVBQUVBLHNCQUFzQkEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxDQUFDQTtRQUU5TkEsRUFBRUEsQ0FBQ0EsQ0FBQ0Esc0JBQXNCQSxDQUFDQSxtQkFBbUJBLEdBQUdBLENBQUNBLENBQUNBO1lBQy9CQSxLQUFLQSxDQUFDQSxPQUFRQSxDQUFDQSw0QkFBNEJBLENBQUNBLG9CQUFvQkEsQ0FBQ0EsUUFBUUEsRUFBRUEsc0JBQXNCQSxDQUFDQSxzQkFBc0JBLEVBQUVBLHNCQUFzQkEsQ0FBQ0Esb0JBQW9CQSxFQUFFQSxzQkFBc0JBLENBQUNBLG1CQUFtQkEsQ0FBQ0EsQ0FBQ0E7SUFDeE9BLENBQUNBO0lBRURIOztPQUVHQTtJQUNJQSwrQ0FBb0JBLEdBQTNCQSxVQUE0QkEsWUFBNkJBO0lBR3pESSxDQUFDQTtJQUVESjs7T0FFR0E7SUFDSUEsZ0NBQUtBLEdBQVpBO1FBRUNLLGdCQUFLQSxDQUFDQSxLQUFLQSxXQUFFQSxDQUFDQTtRQUVkQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFVQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxtQkFBbUJBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBO1lBQzlEQSxJQUFJQSxDQUFDQSxtQkFBbUJBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLENBQUNBO0lBQzFEQSxDQUFDQTtJQUVETDs7T0FFR0E7SUFDSUEsNENBQWlCQSxHQUF4QkEsVUFBeUJBLEVBQVNBO1FBRWpDTSxJQUFJQSxDQUFDQSxjQUFjQSxJQUFJQSxFQUFFQSxDQUFDQTtRQUUxQkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBVUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsbUJBQW1CQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQTtZQUM5REEsSUFBSUEsQ0FBQ0EsbUJBQW1CQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxDQUFDQTtJQUMxREEsQ0FBQ0E7SUFFRE47O09BRUdBO0lBQ0lBLG9DQUFTQSxHQUFoQkEsVUFBaUJBLE1BQXlCQTtRQUF6Qk8sc0JBQXlCQSxHQUF6QkEsVUFBeUJBO1FBRXpDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFVQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxtQkFBbUJBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBO1lBQzlEQSxJQUFJQSxDQUFDQSxtQkFBbUJBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGNBQWNBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBO1FBQ2xFQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtJQUN4QkEsQ0FBQ0E7SUFFTVAsa0NBQU9BLEdBQWRBO1FBRUNRLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLElBQUlBLElBQUlBLENBQUNBLHNCQUFzQkEsQ0FBQ0E7WUFDbkJBLElBQUlBLENBQUNBLHNCQUFzQkEsQ0FBQ0EsR0FBR0EsQ0FBRUEsQ0FBQ0EsT0FBT0EsRUFBRUEsQ0FBQ0E7SUFDdEVBLENBQUNBO0lBRU9SLGlEQUFzQkEsR0FBOUJBLFVBQStCQSxPQUFnQkE7UUFFOUNTLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLHVCQUF1QkEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7WUFDeENBLE1BQU1BLENBQUNBO1FBRVJBLElBQUlBLFdBQVdBLEdBQW1CQSxPQUFPQSxDQUFDQSxXQUFXQSxDQUFDQTtRQUN0REEsSUFBSUEsbUJBQW1CQSxHQUF3QkEsSUFBSUEsQ0FBQ0Esc0JBQXNCQSxDQUFDQSxXQUFXQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxvQkFBb0JBLEVBQUVBLENBQUNBO1FBRXhIQSxBQUNBQSxxRUFEcUVBO1FBQ3JFQSxtQkFBbUJBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsV0FBV0EsRUFBRUEsSUFBSUEsQ0FBQ0Esb0JBQW9CQSxDQUFDQSxDQUFDQTtRQUV6RkEsQUFDQUEscURBRHFEQTtRQUNyREEsbUJBQW1CQSxDQUFDQSxrQkFBa0JBLEdBQUdBLElBQUlBLENBQUNBLHFCQUFxQkEsQ0FBQ0EsdUJBQXVCQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxrQkFBa0JBLENBQUNBO0lBQ3pIQSxDQUFDQTtJQUNGVCx1QkFBQ0E7QUFBREEsQ0ExSUEsQUEwSUNBLEVBMUk4QixZQUFZLEVBMEkxQztBQUVELEFBQTBCLGlCQUFqQixnQkFBZ0IsQ0FBQyIsImZpbGUiOiJhbmltYXRvcnMvUGFydGljbGVBbmltYXRvci5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvcm9iYmF0ZW1hbi9XZWJzdG9ybVByb2plY3RzL2F3YXlqcy1yZW5kZXJlcmdsLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBJU3ViTWVzaFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2NvcmUvYmFzZS9JU3ViTWVzaFwiKTtcbmltcG9ydCBTdWJHZW9tZXRyeUJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2NvcmUvYmFzZS9TdWJHZW9tZXRyeUJhc2VcIik7XG5pbXBvcnQgQ2FtZXJhXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZW50aXRpZXMvQ2FtZXJhXCIpO1xuXG5pbXBvcnQgQW5pbWF0b3JCYXNlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2FuaW1hdG9ycy9BbmltYXRvckJhc2VcIik7XG5pbXBvcnQgQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9hbmltYXRvcnMvZGF0YS9BbmltYXRpb25SZWdpc3RlckNhY2hlXCIpO1xuaW1wb3J0IFN0YWdlXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvY29yZS9iYXNlL1N0YWdlXCIpO1xuaW1wb3J0IFJlbmRlcmFibGVCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9jb3JlL3Bvb2wvUmVuZGVyYWJsZUJhc2VcIik7XG5pbXBvcnQgVHJpYW5nbGVTdWJNZXNoUmVuZGVyYWJsZVx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvY29yZS9wb29sL1RyaWFuZ2xlU3ViTWVzaFJlbmRlcmFibGVcIik7XG5pbXBvcnQgQ29udGV4dEdMUHJvZ3JhbVR5cGVcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9jb3JlL3N0YWdlZ2wvQ29udGV4dEdMUHJvZ3JhbVR5cGVcIik7XG5pbXBvcnQgSUNvbnRleHRTdGFnZUdMXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9jb3JlL3N0YWdlZ2wvSUNvbnRleHRTdGFnZUdMXCIpO1xuaW1wb3J0IFNoYWRlck9iamVjdEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJPYmplY3RCYXNlXCIpO1xuXG5pbXBvcnQgUGFydGljbGVBbmltYXRpb25TZXRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvUGFydGljbGVBbmltYXRpb25TZXRcIik7XG5pbXBvcnQgQW5pbWF0aW9uU3ViR2VvbWV0cnlcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9BbmltYXRpb25TdWJHZW9tZXRyeVwiKTtcbmltcG9ydCBQYXJ0aWNsZUFuaW1hdGlvbkRhdGFcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvUGFydGljbGVBbmltYXRpb25EYXRhXCIpO1xuaW1wb3J0IFBhcnRpY2xlUHJvcGVydGllc01vZGVcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvUGFydGljbGVQcm9wZXJ0aWVzTW9kZVwiKTtcbmltcG9ydCBQYXJ0aWNsZU5vZGVCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvbm9kZXMvUGFydGljbGVOb2RlQmFzZVwiKTtcbmltcG9ydCBQYXJ0aWNsZVN0YXRlQmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9zdGF0ZXMvUGFydGljbGVTdGF0ZUJhc2VcIik7XG5cbi8qKlxuICogUHJvdmlkZXMgYW4gaW50ZXJmYWNlIGZvciBhc3NpZ25pbmcgcGFyaWNsZS1iYXNlZCBhbmltYXRpb24gZGF0YSBzZXRzIHRvIG1lc2gtYmFzZWQgZW50aXR5IG9iamVjdHNcbiAqIGFuZCBjb250cm9sbGluZyB0aGUgdmFyaW91cyBhdmFpbGFibGUgc3RhdGVzIG9mIGFuaW1hdGlvbiB0aHJvdWdoIGFuIGludGVyYXRpdmUgcGxheWhlYWQgdGhhdCBjYW4gYmVcbiAqIGF1dG9tYXRpY2FsbHkgdXBkYXRlZCBvciBtYW51YWxseSB0cmlnZ2VyZWQuXG4gKlxuICogUmVxdWlyZXMgdGhhdCB0aGUgY29udGFpbmluZyBnZW9tZXRyeSBvZiB0aGUgcGFyZW50IG1lc2ggaXMgcGFydGljbGUgZ2VvbWV0cnlcbiAqXG4gKiBAc2VlIGF3YXkuYmFzZS5QYXJ0aWNsZUdlb21ldHJ5XG4gKi9cbmNsYXNzIFBhcnRpY2xlQW5pbWF0b3IgZXh0ZW5kcyBBbmltYXRvckJhc2VcbntcblxuXHRwcml2YXRlIF9wYXJ0aWNsZUFuaW1hdGlvblNldDpQYXJ0aWNsZUFuaW1hdGlvblNldDtcblx0cHJpdmF0ZSBfYW5pbWF0aW9uUGFydGljbGVTdGF0ZXM6QXJyYXk8UGFydGljbGVTdGF0ZUJhc2U+ID0gbmV3IEFycmF5PFBhcnRpY2xlU3RhdGVCYXNlPigpO1xuXHRwcml2YXRlIF9hbmltYXRvclBhcnRpY2xlU3RhdGVzOkFycmF5PFBhcnRpY2xlU3RhdGVCYXNlPiA9IG5ldyBBcnJheTxQYXJ0aWNsZVN0YXRlQmFzZT4oKTtcblx0cHJpdmF0ZSBfdGltZVBhcnRpY2xlU3RhdGVzOkFycmF5PFBhcnRpY2xlU3RhdGVCYXNlPiA9IG5ldyBBcnJheTxQYXJ0aWNsZVN0YXRlQmFzZT4oKTtcblx0cHJpdmF0ZSBfdG90YWxMZW5PZk9uZVZlcnRleDpudW1iZXIgLyp1aW50Ki8gPSAwO1xuXHRwcml2YXRlIF9hbmltYXRvclN1Ykdlb21ldHJpZXM6T2JqZWN0ID0gbmV3IE9iamVjdCgpO1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IDxjb2RlPlBhcnRpY2xlQW5pbWF0b3I8L2NvZGU+IG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIHBhcnRpY2xlQW5pbWF0aW9uU2V0IFRoZSBhbmltYXRpb24gZGF0YSBzZXQgY29udGFpbmluZyB0aGUgcGFydGljbGUgYW5pbWF0aW9ucyB1c2VkIGJ5IHRoZSBhbmltYXRvci5cblx0ICovXG5cdGNvbnN0cnVjdG9yKHBhcnRpY2xlQW5pbWF0aW9uU2V0OlBhcnRpY2xlQW5pbWF0aW9uU2V0KVxuXHR7XG5cdFx0c3VwZXIocGFydGljbGVBbmltYXRpb25TZXQpO1xuXHRcdHRoaXMuX3BhcnRpY2xlQW5pbWF0aW9uU2V0ID0gcGFydGljbGVBbmltYXRpb25TZXQ7XG5cblx0XHR2YXIgc3RhdGU6UGFydGljbGVTdGF0ZUJhc2U7XG5cdFx0dmFyIG5vZGU6UGFydGljbGVOb2RlQmFzZTtcblxuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IHRoaXMuX3BhcnRpY2xlQW5pbWF0aW9uU2V0LnBhcnRpY2xlTm9kZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdG5vZGUgPSB0aGlzLl9wYXJ0aWNsZUFuaW1hdGlvblNldC5wYXJ0aWNsZU5vZGVzW2ldO1xuXHRcdFx0c3RhdGUgPSA8UGFydGljbGVTdGF0ZUJhc2U+IHRoaXMuZ2V0QW5pbWF0aW9uU3RhdGUobm9kZSk7XG5cdFx0XHRpZiAobm9kZS5tb2RlID09IFBhcnRpY2xlUHJvcGVydGllc01vZGUuTE9DQUxfRFlOQU1JQykge1xuXHRcdFx0XHR0aGlzLl9hbmltYXRvclBhcnRpY2xlU3RhdGVzLnB1c2goc3RhdGUpO1xuXHRcdFx0XHRub2RlLl9pRGF0YU9mZnNldCA9IHRoaXMuX3RvdGFsTGVuT2ZPbmVWZXJ0ZXg7XG5cdFx0XHRcdHRoaXMuX3RvdGFsTGVuT2ZPbmVWZXJ0ZXggKz0gbm9kZS5kYXRhTGVuZ3RoO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5fYW5pbWF0aW9uUGFydGljbGVTdGF0ZXMucHVzaChzdGF0ZSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoc3RhdGUubmVlZFVwZGF0ZVRpbWUpXG5cdFx0XHRcdHRoaXMuX3RpbWVQYXJ0aWNsZVN0YXRlcy5wdXNoKHN0YXRlKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBjbG9uZSgpOkFuaW1hdG9yQmFzZVxuXHR7XG5cdFx0cmV0dXJuIG5ldyBQYXJ0aWNsZUFuaW1hdG9yKHRoaXMuX3BhcnRpY2xlQW5pbWF0aW9uU2V0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIHNldFJlbmRlclN0YXRlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCByZW5kZXJhYmxlOlJlbmRlcmFibGVCYXNlLCBzdGFnZTpTdGFnZSwgY2FtZXJhOkNhbWVyYSwgdmVydGV4Q29uc3RhbnRPZmZzZXQ6bnVtYmVyIC8qaW50Ki8sIHZlcnRleFN0cmVhbU9mZnNldDpudW1iZXIgLyppbnQqLylcblx0e1xuXHRcdHZhciBhbmltYXRpb25SZWdpc3RlckNhY2hlOkFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUgPSB0aGlzLl9wYXJ0aWNsZUFuaW1hdGlvblNldC5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGU7XG5cblx0XHR2YXIgc3ViTWVzaDpJU3ViTWVzaCA9ICg8VHJpYW5nbGVTdWJNZXNoUmVuZGVyYWJsZT4gcmVuZGVyYWJsZSkuc3ViTWVzaDtcblx0XHR2YXIgc3RhdGU6UGFydGljbGVTdGF0ZUJhc2U7XG5cdFx0dmFyIGk6bnVtYmVyO1xuXG5cdFx0aWYgKCFzdWJNZXNoKVxuXHRcdFx0dGhyb3cobmV3IEVycm9yKFwiTXVzdCBiZSBzdWJNZXNoXCIpKTtcblxuXHRcdC8vcHJvY2VzcyBhbmltYXRpb24gc3ViIGdlb21ldHJpZXNcblx0XHR2YXIgYW5pbWF0aW9uU3ViR2VvbWV0cnk6QW5pbWF0aW9uU3ViR2VvbWV0cnkgPSB0aGlzLl9wYXJ0aWNsZUFuaW1hdGlvblNldC5nZXRBbmltYXRpb25TdWJHZW9tZXRyeShzdWJNZXNoKTtcblxuXHRcdGZvciAoaSA9IDA7IGkgPCB0aGlzLl9hbmltYXRpb25QYXJ0aWNsZVN0YXRlcy5sZW5ndGg7IGkrKylcblx0XHRcdHRoaXMuX2FuaW1hdGlvblBhcnRpY2xlU3RhdGVzW2ldLnNldFJlbmRlclN0YXRlKHN0YWdlLCByZW5kZXJhYmxlLCBhbmltYXRpb25TdWJHZW9tZXRyeSwgYW5pbWF0aW9uUmVnaXN0ZXJDYWNoZSwgY2FtZXJhKTtcblxuXHRcdC8vcHJvY2VzcyBhbmltYXRvciBzdWJnZW9tZXRyaWVzXG5cdFx0dmFyIGFuaW1hdG9yU3ViR2VvbWV0cnk6QW5pbWF0aW9uU3ViR2VvbWV0cnkgPSB0aGlzLmdldEFuaW1hdG9yU3ViR2VvbWV0cnkoc3ViTWVzaCk7XG5cblx0XHRmb3IgKGkgPSAwOyBpIDwgdGhpcy5fYW5pbWF0b3JQYXJ0aWNsZVN0YXRlcy5sZW5ndGg7IGkrKylcblx0XHRcdHRoaXMuX2FuaW1hdG9yUGFydGljbGVTdGF0ZXNbaV0uc2V0UmVuZGVyU3RhdGUoc3RhZ2UsIHJlbmRlcmFibGUsIGFuaW1hdG9yU3ViR2VvbWV0cnksIGFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUsIGNhbWVyYSk7XG5cblx0XHQoPElDb250ZXh0U3RhZ2VHTD4gc3RhZ2UuY29udGV4dCkuc2V0UHJvZ3JhbUNvbnN0YW50c0Zyb21BcnJheShDb250ZXh0R0xQcm9ncmFtVHlwZS5WRVJURVgsIGFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUudmVydGV4Q29uc3RhbnRPZmZzZXQsIGFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUudmVydGV4Q29uc3RhbnREYXRhLCBhbmltYXRpb25SZWdpc3RlckNhY2hlLm51bVZlcnRleENvbnN0YW50KTtcblxuXHRcdGlmIChhbmltYXRpb25SZWdpc3RlckNhY2hlLm51bUZyYWdtZW50Q29uc3RhbnQgPiAwKVxuXHRcdFx0KDxJQ29udGV4dFN0YWdlR0w+IHN0YWdlLmNvbnRleHQpLnNldFByb2dyYW1Db25zdGFudHNGcm9tQXJyYXkoQ29udGV4dEdMUHJvZ3JhbVR5cGUuRlJBR01FTlQsIGFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUuZnJhZ21lbnRDb25zdGFudE9mZnNldCwgYW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5mcmFnbWVudENvbnN0YW50RGF0YSwgYW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5udW1GcmFnbWVudENvbnN0YW50KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIHRlc3RHUFVDb21wYXRpYmlsaXR5KHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKVxuXHR7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIHN0YXJ0KClcblx0e1xuXHRcdHN1cGVyLnN0YXJ0KCk7XG5cblx0XHRmb3IgKHZhciBpOm51bWJlciA9IDA7IGkgPCB0aGlzLl90aW1lUGFydGljbGVTdGF0ZXMubGVuZ3RoOyBpKyspXG5cdFx0XHR0aGlzLl90aW1lUGFydGljbGVTdGF0ZXNbaV0ub2Zmc2V0KHRoaXMuX3BBYnNvbHV0ZVRpbWUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgX3BVcGRhdGVEZWx0YVRpbWUoZHQ6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5fcEFic29sdXRlVGltZSArPSBkdDtcblxuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IHRoaXMuX3RpbWVQYXJ0aWNsZVN0YXRlcy5sZW5ndGg7IGkrKylcblx0XHRcdHRoaXMuX3RpbWVQYXJ0aWNsZVN0YXRlc1tpXS51cGRhdGUodGhpcy5fcEFic29sdXRlVGltZSk7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyByZXNldFRpbWUob2Zmc2V0Om51bWJlciAvKmludCovID0gMClcblx0e1xuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IHRoaXMuX3RpbWVQYXJ0aWNsZVN0YXRlcy5sZW5ndGg7IGkrKylcblx0XHRcdHRoaXMuX3RpbWVQYXJ0aWNsZVN0YXRlc1tpXS5vZmZzZXQodGhpcy5fcEFic29sdXRlVGltZSArIG9mZnNldCk7XG5cdFx0dGhpcy51cGRhdGUodGhpcy50aW1lKTtcblx0fVxuXG5cdHB1YmxpYyBkaXNwb3NlKClcblx0e1xuXHRcdGZvciAodmFyIGtleSBpbiB0aGlzLl9hbmltYXRvclN1Ykdlb21ldHJpZXMpXG5cdFx0XHQoPEFuaW1hdGlvblN1Ykdlb21ldHJ5PiB0aGlzLl9hbmltYXRvclN1Ykdlb21ldHJpZXNba2V5XSkuZGlzcG9zZSgpO1xuXHR9XG5cblx0cHJpdmF0ZSBnZXRBbmltYXRvclN1Ykdlb21ldHJ5KHN1Yk1lc2g6SVN1Yk1lc2gpOkFuaW1hdGlvblN1Ykdlb21ldHJ5XG5cdHtcblx0XHRpZiAoIXRoaXMuX2FuaW1hdG9yUGFydGljbGVTdGF0ZXMubGVuZ3RoKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dmFyIHN1Ykdlb21ldHJ5OlN1Ykdlb21ldHJ5QmFzZSA9IHN1Yk1lc2guc3ViR2VvbWV0cnk7XG5cdFx0dmFyIGFuaW1hdG9yU3ViR2VvbWV0cnk6QW5pbWF0aW9uU3ViR2VvbWV0cnkgPSB0aGlzLl9hbmltYXRvclN1Ykdlb21ldHJpZXNbc3ViR2VvbWV0cnkuaWRdID0gbmV3IEFuaW1hdGlvblN1Ykdlb21ldHJ5KCk7XG5cblx0XHQvL2NyZWF0ZSB0aGUgdmVydGV4RGF0YSB2ZWN0b3IgdGhhdCB3aWxsIGJlIHVzZWQgZm9yIGxvY2FsIHN0YXRlIGRhdGFcblx0XHRhbmltYXRvclN1Ykdlb21ldHJ5LmNyZWF0ZVZlcnRleERhdGEoc3ViR2VvbWV0cnkubnVtVmVydGljZXMsIHRoaXMuX3RvdGFsTGVuT2ZPbmVWZXJ0ZXgpO1xuXG5cdFx0Ly9wYXNzIHRoZSBwYXJ0aWNsZXMgZGF0YSB0byB0aGUgYW5pbWF0b3Igc3ViR2VvbWV0cnlcblx0XHRhbmltYXRvclN1Ykdlb21ldHJ5LmFuaW1hdGlvblBhcnRpY2xlcyA9IHRoaXMuX3BhcnRpY2xlQW5pbWF0aW9uU2V0LmdldEFuaW1hdGlvblN1Ykdlb21ldHJ5KHN1Yk1lc2gpLmFuaW1hdGlvblBhcnRpY2xlcztcblx0fVxufVxuXG5leHBvcnQgPSBQYXJ0aWNsZUFuaW1hdG9yOyJdfQ==