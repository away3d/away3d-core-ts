import { IEventDispatcher } from '@awayjs/core';
import { ContainerNode, INode } from '@awayjs/view';
import { _Stage_ElementsBase } from './_Stage_ElementsBase';
import { _Render_MaterialBase } from './_Render_MaterialBase';

export interface IRenderable extends IEventDispatcher
{

	materialID: number;

	renderOrderId: number;

	zIndex: number;

	next: IRenderable;

	readonly node: INode;

	renderMaterial: _Render_MaterialBase;

	stageElements: _Stage_ElementsBase;

	maskOwners: ContainerNode[];

	executeRender(
		enableDepthAndStencil?: boolean, surfaceSelector?: number, mipmapSelector?: number, maskConfig?: number): void;
}