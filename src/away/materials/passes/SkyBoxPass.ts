///<reference path="../../_definitions.ts"/>

module away.materials
{
	import SubGeometry								= away.base.TriangleSubGeometry;

	/**
	 * SkyboxPass provides a material pass exclusively used to render sky boxes from a cube texture.
	 */
	export class SkyboxPass extends MaterialPassBase
	{
		private _cubeTexture:away.textures.CubeTextureBase;
		private _vertexData:Array<number>;

		/**
		 * Creates a new SkyboxPass object.
		 */
		constructor()
		{
			super();
			this.mipmap = false;
			this._pNumUsedTextures = 1;
			this._vertexData = new Array<number>(0, 0, 0, 0, 1, 1, 1, 1);
		}

		/**
		 * The cube texture to use as the skybox.
		 */
		public get cubeTexture():away.textures.CubeTextureBase
		{
			return this._cubeTexture;
		}

		public set cubeTexture(value:away.textures.CubeTextureBase)
		{
			this._cubeTexture = value;
		}

		/**
		 * @inheritDoc
		 */
		public iGetVertexCode():string
		{
			return "mul vt0, va0, vc5\n" +
				"add vt0, vt0, vc4\n" +
				"m44 op, vt0, vc0\n" +
				"mov v0, va0\n";
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentCode(animationCode:string):string
		{
			var format:string;
			switch (this._cubeTexture.format) {
				case away.gl.ContextGLTextureFormat.COMPRESSED:
					format = "dxt1,";
					break;
				case "compressedAlpha":
					format = "dxt5,";
					break;
				default:
					format = "";
			}

			var mip:string = ",mipnone";

			if (this._cubeTexture.hasMipmaps) {
				mip = ",miplinear";
			}
			return "tex ft0, v0, fs0 <cube," + format + "linear,clamp" + mip + ">\n" +
				"mov oc, ft0\n";
		}

		/**
		 * @inheritDoc
		 */
		public iRender(renderable:away.pool.RenderableBase, stageGL:away.base.StageGL, camera:away.entities.Camera, viewProjection:away.geom.Matrix3D)
		{
			var context:away.gl.ContextGL = stageGL.contextGL;
			var pos:away.geom.Vector3D = camera.scenePosition;
			this._vertexData[0] = pos.x;
			this._vertexData[1] = pos.y;
			this._vertexData[2] = pos.z;
			this._vertexData[4] = this._vertexData[5] = this._vertexData[6] = camera.projection.far/Math.sqrt(3);
			context.setProgramConstantsFromMatrix(away.gl.ContextGLProgramType.VERTEX, 0, viewProjection, true);
			context.setProgramConstantsFromArray(away.gl.ContextGLProgramType.VERTEX, 4, this._vertexData, 2);

			stageGL.activateBuffer(0, renderable.getVertexData(SubGeometry.POSITION_DATA), renderable.getVertexOffset(SubGeometry.POSITION_DATA), SubGeometry.POSITION_FORMAT);
			context.drawTriangles(stageGL.getIndexBuffer(renderable.getIndexData()), 0, renderable.numTriangles);
		}

		/**
		 * @inheritDoc
		 */
		public iActivate(stageGL:away.base.StageGL, camera:away.entities.Camera)
		{
			super.iActivate(stageGL, camera);
			var context:away.gl.ContextGL = stageGL.contextGL;
			context.setSamplerStateAt(0, away.gl.ContextGLWrapMode.CLAMP, away.gl.ContextGLTextureFilter.LINEAR, this._cubeTexture.hasMipmaps? away.gl.ContextGLMipFilter.MIPLINEAR : away.gl.ContextGLMipFilter.MIPNONE);
			context.setDepthTest(false, away.gl.ContextGLCompareMode.LESS);
			this._cubeTexture.activateTextureForStage(0, stageGL);
		}
	}
}
