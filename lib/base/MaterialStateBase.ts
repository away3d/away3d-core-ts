import {AssetEvent, AbstractionBase} from "@awayjs/core";

import {Stage, GL_ImageBase, ImageBase, ImageSampler, ImageUtils} from "@awayjs/stage";

import {ITexture} from "../base/ITexture";
import {PassEvent} from "../events/PassEvent";
import {MaterialEvent} from "../events/MaterialEvent";

import {RenderGroup} from "../RenderGroup";

import {IEntity} from "./IEntity";
import {IPass} from "./IPass";
import {IMaterial} from "./IMaterial";
import {IAnimator} from "./IAnimator";
import {IAnimationSet} from "./IAnimationSet";
import {MaterialStatePool} from "./MaterialStatePool";
import {ShaderBase} from "./ShaderBase";
import {Style} from "./Style";

/**
 *
 * @class away.pool.Passes
 */
export class MaterialStateBase extends AbstractionBase
{
    private _onInvalidateAnimationDelegate:(event:MaterialEvent) => void;
    private _onInvalidatePassesDelegate:(event:MaterialEvent) => void;
    private _onPassInvalidateDelegate:(event:PassEvent) => void;

	public usages:number = 0;

    protected _renderOrderId:number;
    protected _passes:Array<IPass> = new Array<IPass>();
	protected _material:IMaterial;
    protected _materialStatePool:MaterialStatePool;
    protected _stage:Stage;
    protected _renderGroup:RenderGroup;

    private _invalidAnimation:boolean = true;
	private _invalidRender:boolean = true;
    private _invalidImages:boolean = true;

    private _imageIndices:Object = new Object();
    private _numImages:number;
    private _usesAnimation:boolean = true;

    public images:Array<GL_ImageBase> = new Array<GL_ImageBase>();

    public samplers:Array<ImageSampler> = new Array<ImageSampler>();
	
    /**
     * Indicates whether or not the renderable requires alpha blending during rendering.
     */
	public requiresBlending:boolean = false;
    
	public materialID:number;

	public get animationSet():IAnimationSet
    {
        return this._material.animationSet;
    }

	public get material():IMaterial
	{
		return this._material;
	}

    public get numImages():number
    {
        if (this._invalidImages)
            this._updateImages();

        return this._numImages;
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

    public get style():Style
    {
        return this._material.style;
    }

    public get renderGroup():RenderGroup
    {
        return this._renderGroup;
    }

	constructor(material:IMaterial, materialStatePool:MaterialStatePool)
	{
		super(material, materialStatePool);

		this.materialID = material.id;
		this._material = material;
		this._materialStatePool = materialStatePool;
		this._stage = materialStatePool.stage;
		this._renderGroup = materialStatePool.renderGroup;

        this._onInvalidateAnimationDelegate = (event:MaterialEvent) => this.onInvalidateAnimation(event);
        this._onInvalidatePassesDelegate = (event:MaterialEvent) => this.onInvalidatePasses(event);

        this._material.addEventListener(MaterialEvent.INVALIDATE_ANIMATION, this._onInvalidateAnimationDelegate);
        this._material.addEventListener(MaterialEvent.INVALIDATE_PASSES, this._onInvalidatePassesDelegate);

        this._onPassInvalidateDelegate = (event:PassEvent) => this.onPassInvalidate(event);

    }

    public _includeDependencies(shader:ShaderBase):void
    {
        this._materialStatePool._includeDependencies(shader);

        shader.alphaThreshold = this._material.alphaThreshold;
        shader.useImageRect = this._material.imageRect;
        shader.usesCurves = this._material.curves;
    }

    public getImageIndex(texture:ITexture, index:number = 0):number
    {
        if (this._invalidImages)
            this._updateImages();

        return this._imageIndices[texture.id][index];
    }

	/**
	 *
	 */
	public onClear(event:AssetEvent):void
	{
		super.onClear(event);

        var len:number = this._passes.length;
        for (var i:number = 0; i < len; i++) {
            this._passes[i].removeEventListener(PassEvent.INVALIDATE, this._onPassInvalidateDelegate);
            this._passes[i].dispose();
        }

        this._passes = null;

        this._material.removeEventListener(MaterialEvent.INVALIDATE_ANIMATION, this._onInvalidateAnimationDelegate);
        this._material.removeEventListener(MaterialEvent.INVALIDATE_PASSES, this._onInvalidatePassesDelegate);

        this._material = null;
        this._materialStatePool = null;
        this._stage = null;
    }

    /**
     *
     */
    public onInvalidatePasses(event:MaterialEvent):void
    {
        var len:number = this._passes.length;
        for (var i:number = 0; i < len; i++)
            this._passes[i].invalidate();

        this._invalidAnimation = true;
        this._invalidImages = true;
    }

    /**
     * Listener for when a pass's shader code changes. It recalculates the render order id.
     */
    private onPassInvalidate(event:PassEvent):void
    {
        this._invalidAnimation = true;
    }

    /**
     *
     */
    public onInvalidateAnimation(event:MaterialEvent):void
    {
        this._invalidAnimation = true;
    }

	/**
	 *
	 */
	public onInvalidate(event:AssetEvent):void
	{
		super.onInvalidate(event);

		this._invalidRender = true;
        this._invalidAnimation = true;
	}

    /**
     * Removes all passes from the surface
     */
    public _pClearPasses():void
    {
        var len:number = this._passes.length;
        for (var i:number = 0; i < len; ++i)
            this._passes[i].removeEventListener(PassEvent.INVALIDATE, this._onPassInvalidateDelegate);

        this._passes.length = 0;
    }

    /**
     * Adds a pass to the surface
     * @param pass
     */
    public _pAddPass(pass:IPass):void
    {
        this._passes.push(pass);
        pass.addEventListener(PassEvent.INVALIDATE, this._onPassInvalidateDelegate);
    }

    /**
     * Removes a pass from the surface.
     * @param pass The pass to be removed.
     */
    public _pRemovePass(pass:IPass):void
    {
        pass.removeEventListener(PassEvent.INVALIDATE, this._onPassInvalidateDelegate);
        this._passes.splice(this._passes.indexOf(pass), 1);
    }

	/**
	 * Performs any processing that needs to occur before any of its passes are used.
	 *
	 * @private
	 */
	public _pUpdateRender():void
	{
		this._invalidRender = false;
	}


    /**
     *
     * @param surface
     */
    protected _updateAnimation():void
    {
        if (this._invalidRender)
            this._pUpdateRender();

        this._invalidAnimation = false;

        var usesAnimation:boolean = this._getEnabledGPUAnimation();

        var renderOrderId = 0;
        var mult:number = 1;
        var shader:ShaderBase;
        var len:number = this._passes.length;
        for (var i:number = 0; i < len; i++) {
            shader = this._passes[i].shader;
            shader.usesAnimation = usesAnimation;

            renderOrderId += shader.programData.id*mult;
            mult *= 1000;
        }

        if (this._usesAnimation != usesAnimation) {
            this._usesAnimation = usesAnimation;

            var renderables:Array<IEntity> = this._material.iOwners;
            var numOwners:number = renderables.length;
            for (var j:number = 0; j < numOwners; j++)
                renderables[j].invalidateElements();
        }

        this._renderOrderId = renderOrderId;
    }


    private _updateImages():void
    {
        this._invalidImages = false;

        var style:Style = this._material.style;
        var numTextures:number = this._material.getNumTextures();
        var texture:ITexture;
        var numImages:number;
        var images:Array<number>;
        var index:number = 0;

        for (var i:number = 0; i < numTextures; i++) {
            texture = this._material.getTextureAt(i);
            numImages = texture.getNumImages();
            images = this._imageIndices[texture.id] = new Array<number>();
            for (var j:number = 0; j < numImages; j++) {
                this.images[index] = <GL_ImageBase> this._stage.getAbstraction(texture.getImageAt(j) || (style? style.getImageAt(texture, j) : null) || ImageUtils.getDefaultImage2D());

                this.samplers[index] = texture.getSamplerAt(j) || (style? style.getSamplerAt(texture, j) : null) || ImageUtils.getDefaultSampler();

                images[j] = index++;
            }
        }

        this._numImages = index;
    }

    /**
     * test if animation will be able to run on gpu BEFORE compiling materials
     * test if the shader objects supports animating the animation set in the vertex shader
     * if any object using this material fails to support accelerated animations for any of the shader objects,
     * we should do everything on cpu (otherwise we have the cost of both gpu + cpu animations)
     */
    private _getEnabledGPUAnimation():boolean
    {
        if (this._material.animationSet) {
            this._material.animationSet.resetGPUCompatibility();

            var entities:Array<IEntity> = this._material.iOwners;
            var numOwners:number = entities.length;

            var len:number = this._passes.length;
            var shader:ShaderBase;
            for (var i:number = 0; i < len; i++) {
                shader = this._passes[i].shader;
                shader.usesAnimation = false;
                for (var j:number = 0; j < numOwners; j++)
                    if (entities[j].animator)
                        (<IAnimator> entities[j].animator).testGPUCompatibility(shader);
            }


            return !this._material.animationSet.usesCPU;
        }

        return false;
    }
}