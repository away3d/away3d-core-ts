import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import AssetEvent					= require("awayjs-core/lib/events/AssetEvent");
import AbstractionBase				= require("awayjs-core/lib/library/AbstractionBase");

import IRenderOwner					= require("awayjs-display/lib/base/IRenderOwner");
import Camera						= require("awayjs-display/lib/entities/Camera");
import RenderOwnerEvent				= require("awayjs-display/lib/events/RenderOwnerEvent");
import IRenderableOwner				= require("awayjs-display/lib/base/IRenderableOwner");
import MaterialBase					= require("awayjs-display/lib/materials/MaterialBase");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import AnimatorBase					= require("awayjs-renderergl/lib/animators/AnimatorBase");
import PassEvent					= require("awayjs-renderergl/lib/events/PassEvent");
import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import RenderPool					= require("awayjs-renderergl/lib/render/RenderPool");
import IPass						= require("awayjs-renderergl/lib/render/passes/IPass");
import IRenderableClass				= require("awayjs-renderergl/lib/renderables/IRenderableClass");
import TextureVOBase				= require("awayjs-renderergl/lib/vos/TextureVOBase");

/**
 *
 * @class away.pool.Passes
 */
class RenderBase extends AbstractionBase
{
	private _onInvalidateAnimationDelegate:(event:RenderOwnerEvent) => void;
	private _onInvalidatePassesDelegate:(event:RenderOwnerEvent) => void;

	public usages:number = 0;
	public _forceSeparateMVP:boolean = false;

	public _renderOwner:IRenderOwner;
	public _renderableClass:IRenderableClass;
	public _stage:Stage;

	private _renderOrderId:number;
	private _invalidAnimation:boolean = true;
	private _invalidRender:boolean = true;
	private _passes:Array<IPass> = new Array<IPass>();



	public _pRequiresBlending:boolean = false;

	private _onPassInvalidateDelegate:(event:PassEvent) => void;

	public renderId:number;

	/**
	 * Indicates whether or not the renderable requires alpha blending during rendering.
	 */
	public get requiresBlending():boolean
	{
		return this._pRequiresBlending;
	}

	public get renderOrderId():number
	{
		if (this._invalidAnimation)
			this._updateAnimation();

		return this._renderOrderId;
	}

	public get passes():Array<IPass>
	{
		if (this._invalidAnimation)
			this._updateAnimation();

		return this._passes;
	}

	public get renderOwner():IRenderOwner
	{
		return this._renderOwner;
	}

	constructor(renderOwner:IRenderOwner, renderableClass:IRenderableClass, renderPool:RenderPool)
	{
		super(renderOwner, renderPool);

		this._onInvalidateAnimationDelegate = (event:RenderOwnerEvent) => this.onInvalidateAnimation(event);
		this._onInvalidatePassesDelegate = (event:RenderOwnerEvent) => this.onInvalidatePasses(event);

		this.renderId = renderOwner.id;
		this._renderOwner = renderOwner;
		this._renderableClass = renderableClass;
		this._stage = renderPool.stage;

		this._renderOwner.addEventListener(RenderOwnerEvent.INVALIDATE_ANIMATION, this._onInvalidateAnimationDelegate);
		this._renderOwner.addEventListener(RenderOwnerEvent.INVALIDATE_PASSES, this._onInvalidatePassesDelegate);

		this._onPassInvalidateDelegate = (event:PassEvent) => this.onPassInvalidate(event);
	}

	public _iIncludeDependencies(shader:ShaderBase)
	{
		this._renderableClass._iIncludeDependencies(shader);

		shader.alphaThreshold = this._renderOwner.alphaThreshold;
		shader.useMipmapping = this._renderOwner.mipmap;
		shader.useSmoothTextures = this._renderOwner.smooth;
		shader.useImageRect = this._renderOwner.imageRect;
		//shader.useUVBuffer = this._renderOwner.uvBuffer;

		if (this._renderOwner instanceof MaterialBase) {
			var material:MaterialBase = <MaterialBase> this._renderOwner;
			shader.useAlphaPremultiplied = material.alphaPremultiplied;
			shader.useBothSides = material.bothSides;
			shader.repeatTextures = material.repeat;
			shader.usesUVTransform = material.animateUVs;
			shader.usesColorTransform = material.useColorTransform;
			shader.texture = material.texture;
			shader.color = material.color;
		}
	}

	/**
	 *
	 */
	public onClear(event:AssetEvent)
	{
		super.onClear(event);

		this._renderOwner = null;
		this._renderableClass = null;
		this._stage = null;

		var len:number = this._passes.length;
		for (var i:number = 0; i < len; i++) {
			this._passes[i].removeEventListener(PassEvent.INVALIDATE, this._onPassInvalidateDelegate);
			this._passes[i].dispose();
		}

		this._passes = null;
	}

	/**
	 *
	 */
	public onInvalidate(event:AssetEvent)
	{
		super.onInvalidate(event);

		this._invalidRender = true;
		this._invalidAnimation = true;
	}

	/**
	 *
	 */
	public onInvalidatePasses(event:RenderOwnerEvent)
	{
		var len:number = this._passes.length;
		for (var i:number = 0; i < len; i++)
			this._passes[i].invalidate();

		this._invalidAnimation = true;
	}

	/**
	 *
	 */
	public onInvalidateAnimation(event:RenderOwnerEvent)
	{
		this._invalidAnimation = true;
	}

	/**
	 *
	 * @param renderOwner
	 */
	private _updateAnimation()
	{
		if (this._invalidRender)
			this._pUpdateRender();

		this._invalidAnimation = false;

		var enabledGPUAnimation:boolean = this._getEnabledGPUAnimation();

		var renderOrderId = 0;
		var mult:number = 1;
		var shader:ShaderBase;
		var len:number = this._passes.length;
		for (var i:number = 0; i < len; i++) {
			shader = this._passes[i].shader;

			if (shader.usesAnimation != enabledGPUAnimation) {
				shader.usesAnimation = enabledGPUAnimation;
				shader.invalidateProgram();
			}

			renderOrderId += shader.programData.id*mult;
			mult *= 1000;
		}

		this._renderOrderId = renderOrderId;
	}

	/**
	 * Performs any processing that needs to occur before any of its passes are used.
	 *
	 * @private
	 */
	public _pUpdateRender()
	{
		this._invalidRender = false;

		//overrride to update shader object properties
	}

	/**
	 * Removes a pass from the renderOwner.
	 * @param pass The pass to be removed.
	 */
	public _pRemovePass(pass:IPass)
	{
		pass.removeEventListener(PassEvent.INVALIDATE, this._onPassInvalidateDelegate);
		this._passes.splice(this._passes.indexOf(pass), 1);
	}

	/**
	 * Removes all passes from the renderOwner
	 */
	public _pClearPasses()
	{
		var len:number = this._passes.length;
		for (var i:number = 0; i < len; ++i)
			this._passes[i].removeEventListener(PassEvent.INVALIDATE, this._onPassInvalidateDelegate);

		this._passes.length = 0;
	}

	/**
	 * Adds a pass to the renderOwner
	 * @param pass
	 */
	public _pAddPass(pass:IPass)
	{
		this._passes.push(pass);
		pass.addEventListener(PassEvent.INVALIDATE, this._onPassInvalidateDelegate);
	}

	/**
	 * Listener for when a pass's shader code changes. It recalculates the render order id.
	 */
	private onPassInvalidate(event:PassEvent)
	{
		this._invalidAnimation = true;
	}


	/**
	 * test if animation will be able to run on gpu BEFORE compiling materials
	 * test if the shader objects supports animating the animation set in the vertex shader
	 * if any object using this material fails to support accelerated animations for any of the shader objects,
	 * we should do everything on cpu (otherwise we have the cost of both gpu + cpu animations)
	 */
	private _getEnabledGPUAnimation():boolean
	{
		if (this._renderOwner.animationSet) {
			this._renderOwner.animationSet.resetGPUCompatibility();

			var owners:Array<IRenderableOwner> = this._renderOwner.iOwners;
			var numOwners:number = owners.length;

			var len:number = this._passes.length;
			for (var i:number = 0; i < len; i++)
				for (var j:number = 0; j < numOwners; j++)
					if (owners[j].animator)
						(<AnimatorBase> owners[j].animator).testGPUCompatibility(this._passes[i].shader);

			return !this._renderOwner.animationSet.usesCPU;
		}

		return false;
	}
}

export = RenderBase;