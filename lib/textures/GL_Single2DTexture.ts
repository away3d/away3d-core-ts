import AssetEvent					= require("awayjs-core/lib/events/AssetEvent");
import Image2D						= require("awayjs-core/lib/image/Image2D");

import GL_Image2D					= require("awayjs-stagegl/lib/image/GL_Image2D");
import GL_Sampler2D					= require("awayjs-stagegl/lib/image/GL_Sampler2D");

import MappingMode					= require("awayjs-display/lib/textures/MappingMode");
import Single2DTexture				= require("awayjs-display/lib/textures/Single2DTexture");

import RenderBase					= require("awayjs-renderergl/lib/render/RenderBase");
import RenderableBase				= require("awayjs-renderergl/lib/renderables/RenderableBase");
import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
import GL_TextureBase				= require("awayjs-renderergl/lib/textures/GL_TextureBase");

/**
 *
 * @class away.pool.GL_Single2DTexture
 */
class GL_Single2DTexture extends GL_TextureBase
{

	private _single2DTexture:Single2DTexture;
	private _textureIndex:number;
	private _imageIndex:number;
	private _samplerIndex:number;

	constructor(single2DTexture:Single2DTexture, shader:ShaderBase)
	{
		super(single2DTexture, shader);

		this._single2DTexture = single2DTexture;
	}

	public onClear(event:AssetEvent)
	{
		super.onClear(event);

		this._single2DTexture = null;
	}

	/**
	 *
	 * @param shader
	 * @param regCache
	 * @param targetReg The register in which to store the sampled colour.
	 * @param uvReg The uv coordinate vector with which to sample the texture map.
	 * @returns {string}
	 * @private
	 */
	public _iGetFragmentCode(targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedReg:ShaderRegisterData, inputReg:ShaderRegisterElement):string
	{
		var code:string = "";
		var wrap:string = "wrap";
		var format:string = "";//this.getFormatString(this._single2DTexture.image2D);
		var filter:string = "linear,miplinear";

		var temp:ShaderRegisterElement;

		//modify depending on mapping mode
		if (this._single2DTexture.mappingMode == MappingMode.RADIAL_GRADIENT) {
			temp = regCache.getFreeFragmentVectorTemp();
			code += "mul " + temp + ".xy, " + inputReg + ", " + inputReg + "\n";
			code += "mul " + temp + ".xy, " + inputReg + ", " + inputReg + "\n";
			code += "add " + temp + ".x, " + temp + ".x, " + temp + ".y\n";
			code += "sub " + temp + ".y, " + temp + ".y, " + temp + ".y\n";
			code += "sqt " + temp + ".x, " + temp + ".x, " + temp + ".x\n";
			inputReg = temp;
		}

		//handles texture atlasing
		if (this._shader.useImageRect) {
			var samplerReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
			this._samplerIndex = samplerReg.index*4;
			temp = regCache.getFreeFragmentVectorTemp();

			code += "mul " + temp + ", " + inputReg + ", " + samplerReg + ".xy\n";
			code += "add " + temp + ", " + temp + ", " + samplerReg + ".zw\n";
			inputReg = temp;
		}

		this._imageIndex = this._shader.getImageIndex(this._single2DTexture, 0);

		var textureReg:ShaderRegisterElement = this.getTextureReg(this._imageIndex, regCache, sharedReg);
		this._textureIndex = textureReg.index;

		code += "tex " + targetReg + ", " + inputReg + ", " + textureReg + " <2d," + filter + "," + format + wrap + ">\n";

		return code;
	}

	public activate(render:RenderBase)
	{
		var sampler:GL_Sampler2D = <GL_Sampler2D> render.samplers[this._imageIndex];
		sampler.activate(this._textureIndex);

		var image:GL_Image2D = render.images[this._imageIndex];
		image.activate(this._textureIndex, sampler._sampler.mipmap);

		if (this._shader.useImageRect) {
			var index:number = this._samplerIndex;
			var data:Float32Array = this._shader.fragmentConstantData;
			if (!sampler._sampler.imageRect) {
				data[index] = 1;
				data[index + 1] = 1;
				data[index + 2] = 0;
				data[index + 3] = 0;
			} else {
				data[index] = sampler._sampler.imageRect.width;
				data[index + 1] = sampler._sampler.imageRect.height;
				data[index + 2] = sampler._sampler.imageRect.x;
				data[index + 3] = sampler._sampler.imageRect.y;

			}
		}
	}


	public _setRenderState(renderable:RenderableBase)
	{
		var sampler:GL_Sampler2D = <GL_Sampler2D> renderable.samplers[this._imageIndex];

		if (sampler)
			sampler.activate(this._textureIndex);

		var image:GL_Image2D = renderable.images[this._imageIndex];

		if (image)
			image.activate(this._textureIndex, sampler._sampler.mipmap);

		if (this._shader.useImageRect && sampler) {
			var index:number = this._samplerIndex;
			var data:Float32Array = this._shader.fragmentConstantData;
			if (!sampler._sampler.imageRect) {
				data[index] = 1;
				data[index + 1] = 1;
				data[index + 2] = 0;
				data[index + 3] = 0;
			} else {
				data[index] = sampler._sampler.imageRect.width;
				data[index + 1] = sampler._sampler.imageRect.height;
				data[index + 2] = sampler._sampler.imageRect.x;
				data[index + 3] = sampler._sampler.imageRect.y;

			}
		}
	}
}

export = GL_Single2DTexture;