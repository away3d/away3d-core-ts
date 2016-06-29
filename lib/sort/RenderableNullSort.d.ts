import { IEntitySorter } from "../sort/IEntitySorter";
import { GL_RenderableBase } from "../renderables/GL_RenderableBase";
/**
 * @class away.sort.NullSort
 */
export declare class RenderableNullSort implements IEntitySorter {
    sortBlendedRenderables(head: GL_RenderableBase): GL_RenderableBase;
    sortOpaqueRenderables(head: GL_RenderableBase): GL_RenderableBase;
}
