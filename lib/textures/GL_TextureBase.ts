import AbstractMethodError			from "awayjs-core/lib/errors/AbstractMethodError";
import AssetEvent					from "awayjs-core/lib/events/AssetEvent";
import ImageBase					from "awayjs-core/lib/image/ImageBase";
import SamplerBase					from "awayjs-core/lib/image/SamplerBase";
import AbstractionBase				from "awayjs-core/lib/library/AbstractionBase";

import ContextGLTextureFormat		from "awayjs-stagegl/lib/base/ContextGLTextureFormat";
import Stage						from "awayjs-stagegl/lib/base/Stage";

import TextureBase					from "awayjs-display/lib/textures/TextureBase";

import GL_SurfaceBase				from "awayjs-renderergl/lib/surfaces/GL_SurfaceBase";
import GL_RenderableBase			from "awayjs-renderergl/lib/renderables/GL_RenderableBase";
import ShaderBase					from "awayjs-renderergl/lib/shaders/ShaderBase";
import ShaderRegisterCache			from "awayjs-renderergl/lib/shaders/ShaderRegisterCache";
import ShaderRegisterData			from "awayjs-renderergl/lib/shaders/ShaderRegisterData";
import ShaderRegisterElement		from "awayjs-renderergl/lib/shaders/ShaderRegisterElement";

/**
 *
 * @class away.pool.GL_TextureBaseBase
 */
class GL_TextureBase extends AbstractionBase
{
	private _texture:TextureBase;
	public _shader:ShaderBase;
	public _stage:Stage;

	constructor(texture:TextureBase, shader:ShaderBase)
	{
		super(texture, shader);

		this._texture = texture;
		this._shader = shader;
		this._stage = shader._stage;
	}

	/**
	 *
	 */
	public onClear(event:AssetEvent)
	{
		super.onClear(event);

		this._texture = null;
		this._shader = null;
		this._stage = null;
	}

	public _iGetFragmentCode(targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedReg:ShaderRegisterData, inputReg:ShaderRegisterElement = null):string
	{
		throw new AbstractMethodError();
	}

	public _setRenderState(renderable:GL_RenderableBase)
	{
		//overidden for state logic
	}

	public activate(render:GL_SurfaceBase)
	{
		//overridden for activation logic
	}

	public getTextureReg(imageIndex:number, regCache:ShaderRegisterCache, sharedReg:ShaderRegisterData):ShaderRegisterElement
	{
		var index:number = this._shader.imageIndices.indexOf(imageIndex); //todo: collapse the index based on duplicate image objects to save registrations

		if (index == -1) {
			var textureReg:ShaderRegisterElement = regCache.getFreeTextureReg();
			sharedReg.textures.push(textureReg);
			this._shader.imageIndices.push(imageIndex);

			return textureReg;
		}

		return sharedReg.textures[index];
	}

	public getFormatString(image:ImageBase):string
	{
		switch (image.format) {
			case ContextGLTextureFormat.COMPRESSED:
				return "dxt1,";
			case ContextGLTextureFormat.COMPRESSED_ALPHA:
				return "dxt5,";
			default:
				return "";
		}
	}
}

export default GL_TextureBase;