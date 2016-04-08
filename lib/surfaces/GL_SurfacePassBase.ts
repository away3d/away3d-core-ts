import AssetEvent					from "awayjs-core/lib/events/AssetEvent";
import ImageBase					from "awayjs-core/lib/image/ImageBase";
import Matrix3D						from "awayjs-core/lib/geom/Matrix3D";

import Camera						from "awayjs-display/lib/display/Camera";

import AnimationSetBase				from "awayjs-renderergl/lib/animators/AnimationSetBase";
import PassEvent					from "awayjs-renderergl/lib/events/PassEvent";
import ShaderBase					from "awayjs-renderergl/lib/shaders/ShaderBase";
import ShaderRegisterCache			from "awayjs-renderergl/lib/shaders/ShaderRegisterCache";
import ShaderRegisterData			from "awayjs-renderergl/lib/shaders/ShaderRegisterData";
import IPass						from "awayjs-renderergl/lib/surfaces/passes/IPass";
import GL_RenderableBase			from "awayjs-renderergl/lib/renderables/GL_RenderableBase";
import GL_SurfaceBase				from "awayjs-renderergl/lib/surfaces/GL_SurfaceBase";

/**
 * GL_SurfacePassBase provides an abstract base class for material shader passes. A material pass constitutes at least
 * a render call per required renderable.
 */
class GL_SurfacePassBase extends GL_SurfaceBase implements IPass
{
	public _shader:ShaderBase;

	public get shader():ShaderBase
	{
		return this._shader;
	}

	public get animationSet():AnimationSetBase
	{
		return <AnimationSetBase> this._surface.animationSet;
	}

	/**
	 * Marks the shader program as invalid, so it will be recompiled before the next render.
	 */
	public invalidate()
	{
		this._shader.invalidateShader();

		this.dispatchEvent(new PassEvent(PassEvent.INVALIDATE, this));
	}

	public dispose()
	{
		if (this._shader) {
			this._shader.dispose();
			this._shader = null;
		}
	}

	/**
	 * Renders the current pass. Before calling pass, activatePass needs to be called with the same index.
	 * @param pass The pass used to render the renderable.
	 * @param renderable The IRenderable object to draw.
	 * @param stage The Stage object used for rendering.
	 * @param entityCollector The EntityCollector object that contains the visible scene data.
	 * @param viewProjection The view-projection matrix used to project to the screen. This is not the same as
	 * camera.viewProjection as it includes the scaling factors when rendering to textures.
	 *
	 * @internal
	 */
	public _iRender(renderable:GL_RenderableBase, camera:Camera, viewProjection:Matrix3D)
	{
		this._shader._iRender(renderable, camera, viewProjection);
	}

	/**
	 * Sets the render state for the pass that is independent of the rendered object. This needs to be called before
	 * calling pass. Before activating a pass, the previously used pass needs to be deactivated.
	 * @param stage The Stage object which is currently used for rendering.
	 * @param camera The camera from which the scene is viewed.
	 * @private
	 */
	public _iActivate(camera:Camera)
	{
		this._shader._iActivate(camera);
	}

	/**
	 * Clears the render state for the pass. This needs to be called before activating another pass.
	 * @param stage The Stage used for rendering
	 *
	 * @private
	 */
	public _iDeactivate()
	{
		this._shader._iDeactivate();
	}

	public _iInitConstantData(shader:ShaderBase)
	{

	}

	public _iGetPreLightingVertexCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	public _iGetPreLightingFragmentCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	public _iGetVertexCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	public _iGetFragmentCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	public _iGetNormalVertexCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	public _iGetNormalFragmentCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}
}

export default GL_SurfacePassBase;