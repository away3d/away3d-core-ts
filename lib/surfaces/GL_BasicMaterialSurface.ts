import AssetEvent					from "awayjs-core/lib/events/AssetEvent";
import BlendMode					from "awayjs-core/lib/image/BlendMode";

import BasicMaterial				from "awayjs-display/lib/materials/BasicMaterial";

import BasicMaterialPass			from "awayjs-renderergl/lib/surfaces/passes/BasicMaterialPass";
import IElementsClassGL				from "awayjs-renderergl/lib/elements/IElementsClassGL";
import GL_SurfaceBase				from "awayjs-renderergl/lib/surfaces/GL_SurfaceBase";
import SurfacePool					from "awayjs-renderergl/lib/surfaces/SurfacePool";

/**
 * RenderMaterialObject forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
class GL_BasicMaterialSurface extends GL_SurfaceBase
{
	private _material:BasicMaterial;
	private _pass:BasicMaterialPass;


	constructor(material:BasicMaterial, elementsClass:IElementsClassGL, renderPool:SurfacePool)
	{
		super(material, elementsClass, renderPool);

		this._material = material;

		this._pAddPass(this._pass = new BasicMaterialPass(this, material, elementsClass, this._stage));
	}

	public onClear(event:AssetEvent)
	{
		super.onClear(event);

		this._material = null;
	}

	/**
	 * @inheritDoc
	 */
	public _pUpdateRender()
	{
		super._pUpdateRender();

		this._pRequiresBlending = (this._material.blendMode != BlendMode.NORMAL || this._material.alphaBlending || (this._material.colorTransform && this._material.colorTransform.alphaMultiplier < 1));
		this._pass.preserveAlpha = this._material.preserveAlpha;//this._pRequiresBlending;
		this._pass.shader.setBlendMode((this._surface.blendMode == BlendMode.NORMAL && this._pRequiresBlending)? BlendMode.LAYER : this._material.blendMode);
		//this._pass.forceSeparateMVP = false;
	}
}

export default GL_BasicMaterialSurface;