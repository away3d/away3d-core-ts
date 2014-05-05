///<reference path="../../_definitions.ts"/>

/**
 * @module away.pool
 */
module away.pool
{
	/**
	 *
	 * @class away.pool.TextureDataBase
	 */
	export class BitmapCubeTextureData extends TextureDataBase implements ITextureData
	{
		/**
		 *
		 */
		public static id:string = "bitmapcubetexture";

		private _textureProxy:away.textures.BitmapCubeTexture;

		constructor(stageGL:away.base.StageGL, textureProxy:away.textures.BitmapCubeTexture)
		{
			super(stageGL);

			this._textureProxy = textureProxy;
		}

		public _pCreateTexture()
		{
			this._pTexture = this._pStageGL.contextGL.createCubeTexture(this._textureProxy.size, away.gl.ContextGLTextureFormat.BGRA, false);
		}

		public _pUpdateContent()
		{
			for (var i:number = 0; i < 6; ++i) {
				if (this._textureProxy.generateMipmaps) {
					var mipmapData:Array<away.base.BitmapData> = this._textureProxy._iGetMipmapData(i);
					var len:number = mipmapData.length;
					for (var j:number = 0; j < len; j++)
						(<away.gl.CubeTexture> this._pTexture).uploadFromBitmapData(mipmapData[j], i, j);
				} else {
					(<away.gl.CubeTexture> this._pTexture).uploadFromBitmapData(this._textureProxy._pBitmapDatas[i], i, 0);
				}
			}
		}
	}
}
