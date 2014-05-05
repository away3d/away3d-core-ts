///<reference path="../../_definitions.ts"/>

module away.materials
{

	/**
	 * EffectEnvMapMethod provides a material method to perform reflection mapping using cube maps.
	 */
	export class EffectEnvMapMethod extends EffectMethodBase
	{
		private _cubeTexture:away.textures.CubeTextureBase;
		private _alpha:number;
		private _mask:away.textures.Texture2DBase;

		/**
		 * Creates an EffectEnvMapMethod object.
		 * @param envMap The environment map containing the reflected scene.
		 * @param alpha The reflectivity of the surface.
		 */
		constructor(envMap:away.textures.CubeTextureBase, alpha:number = 1)
		{
			super();
			this._cubeTexture = envMap;
			this._alpha = alpha;

		}

		/**
		 * An optional texture to modulate the reflectivity of the surface.
		 */
		public get mask():away.textures.Texture2DBase
		{
			return this._mask;
		}

		public set mask(value:away.textures.Texture2DBase)
		{
			if (value != this._mask || (value && this._mask && (value.hasMipmaps != this._mask.hasMipmaps || value.format != this._mask.format)))
				this.iInvalidateShaderProgram();

			/*
			 if (Boolean(value) != Boolean(_mask) ||
			 (value && _mask && (value.hasMipmaps != _mask.hasMipmaps || value.format != _mask.format))) {
			 iInvalidateShaderProgram();
			 }
			 */

			this._mask = value;
		}

		/**
		 * @inheritDoc
		 */
		public iInitVO(vo:MethodVO)
		{
			vo.needsNormals = true;
			vo.needsView = true;
			vo.needsUV = this._mask != null;
		}

		/**
		 * The cubic environment map containing the reflected scene.
		 */
		public get envMap():away.textures.CubeTextureBase
		{
			return this._cubeTexture;
		}

		public set envMap(value:away.textures.CubeTextureBase)
		{
			this._cubeTexture = value;
		}

		/**
		 * @inheritDoc
		 */
		public dispose()
		{
		}

		/**
		 * The reflectivity of the surface.
		 */
		public get alpha():number
		{
			return this._alpha;
		}

		public set alpha(value:number)
		{
			this._alpha = value;
		}

		/**
		 * @inheritDoc
		 */
		public iActivate(vo:MethodVO, stageGL:away.base.StageGL)
		{
			var context:away.gl.ContextGL = stageGL.contextGL;
			vo.fragmentData[vo.fragmentConstantsIndex] = this._alpha;

			this._cubeTexture.activateTextureForStage(vo.texturesIndex, stageGL);
			if (this._mask)
				this._mask.activateTextureForStage(vo.texturesIndex + 1, stageGL);
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentCode(vo:MethodVO, regCache:ShaderRegisterCache, targetReg:ShaderRegisterElement):string
		{
			var dataRegister:ShaderRegisterElement = regCache.getFreeFragmentConstant();
			var temp:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
			var code:string = "";
			var cubeMapReg:ShaderRegisterElement = regCache.getFreeTextureReg();

			vo.texturesIndex = cubeMapReg.index;
			vo.fragmentConstantsIndex = dataRegister.index*4;

			regCache.addFragmentTempUsages(temp, 1);
			var temp2:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();

			// r = I - 2(I.N)*N
			code += "dp3 " + temp + ".w, " + this._sharedRegisters.viewDirFragment + ".xyz, " + this._sharedRegisters.normalFragment + ".xyz		\n" + "add " + temp + ".w, " + temp + ".w, " + temp + ".w											\n" + "mul " + temp + ".xyz, " + this._sharedRegisters.normalFragment + ".xyz, " + temp + ".w						\n" + "sub " + temp + ".xyz, " + temp + ".xyz, " + this._sharedRegisters.viewDirFragment + ".xyz					\n" + this.pGetTexCubeSampleCode(vo, temp, cubeMapReg, this._cubeTexture, temp) + "sub " + temp2 + ".w, " + temp + ".w, fc0.x									\n" +               	// -.5
				"kil " + temp2 + ".w\n" +	// used for real time reflection mapping - if alpha is not 1 (mock texture) kil output
				"sub " + temp + ", " + temp + ", " + targetReg + "											\n";

			if (this._mask) {
				var maskReg:ShaderRegisterElement = regCache.getFreeTextureReg();
				code += this.pGetTex2DSampleCode(vo, temp2, maskReg, this._mask, this._sharedRegisters.uvVarying) + "mul " + temp + ", " + temp2 + ", " + temp + "\n";
			}
			code += "mul " + temp + ", " + temp + ", " + dataRegister + ".x										\n" + "add " + targetReg + ", " + targetReg + ", " + temp + "										\n";

			regCache.removeFragmentTempUsage(temp);

			return code;
		}
	}
}
