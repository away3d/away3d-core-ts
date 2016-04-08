import Vector3D							from "awayjs-core/lib/geom/Vector3D";

import Camera							from "awayjs-display/lib/display/Camera";

import Stage							from "awayjs-stagegl/lib/base/Stage";
import ContextGLVertexBufferFormat		from "awayjs-stagegl/lib/base/ContextGLVertexBufferFormat";

import ParticleAnimator					from "awayjs-renderergl/lib/animators/ParticleAnimator";
import AnimationRegisterCache			from "awayjs-renderergl/lib/animators/data/AnimationRegisterCache";
import AnimationElements				from "awayjs-renderergl/lib/animators/data/AnimationElements";
import ParticlePropertiesMode			from "awayjs-renderergl/lib/animators/data/ParticlePropertiesMode";
import ParticleBezierCurveNode			from "awayjs-renderergl/lib/animators/nodes/ParticleBezierCurveNode";
import ParticleStateBase				from "awayjs-renderergl/lib/animators/states/ParticleStateBase";
import GL_RenderableBase				from "awayjs-renderergl/lib/animators/../renderables/GL_RenderableBase";
/**
 * ...
 */
class ParticleBezierCurveState extends ParticleStateBase
{
	/** @private */
	public static BEZIER_CONTROL_INDEX:number /*int*/ = 0;

	/** @private */
	public static BEZIER_END_INDEX:number /*int*/ = 1;

	private _particleBezierCurveNode:ParticleBezierCurveNode;
	private _controlPoint:Vector3D;
	private _endPoint:Vector3D;

	/**
	 * Defines the default control point of the node, used when in global mode.
	 */
	public get controlPoint():Vector3D
	{
		return this._controlPoint;
	}

	public set controlPoint(value:Vector3D)
	{
		this._controlPoint = value;
	}

	/**
	 * Defines the default end point of the node, used when in global mode.
	 */
	public get endPoint():Vector3D
	{
		return this._endPoint;
	}

	public set endPoint(value:Vector3D)
	{
		this._endPoint = value;
	}

	constructor(animator:ParticleAnimator, particleBezierCurveNode:ParticleBezierCurveNode)
	{
		super(animator, particleBezierCurveNode);

		this._particleBezierCurveNode = particleBezierCurveNode;
		this._controlPoint = this._particleBezierCurveNode._iControlPoint;
		this._endPoint = this._particleBezierCurveNode._iEndPoint;
	}

	public setRenderState(stage:Stage, renderable:GL_RenderableBase, animationElements:AnimationElements, animationRegisterCache:AnimationRegisterCache, camera:Camera)
	{
		var controlIndex:number /*int*/ = animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleBezierCurveState.BEZIER_CONTROL_INDEX);
		var endIndex:number /*int*/ = animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleBezierCurveState.BEZIER_END_INDEX);

		if (this._particleBezierCurveNode.mode == ParticlePropertiesMode.LOCAL_STATIC) {
			animationElements.activateVertexBuffer(controlIndex, this._particleBezierCurveNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
			animationElements.activateVertexBuffer(endIndex, this._particleBezierCurveNode._iDataOffset + 3, stage, ContextGLVertexBufferFormat.FLOAT_3);
		} else {
			animationRegisterCache.setVertexConst(controlIndex, this._controlPoint.x, this._controlPoint.y, this._controlPoint.z);
			animationRegisterCache.setVertexConst(endIndex, this._endPoint.x, this._endPoint.y, this._endPoint.z);
		}
	}
}

export default ParticleBezierCurveState;