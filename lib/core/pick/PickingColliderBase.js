var RenderablePool = require("awayjs-core/lib/core/pool/RenderablePool");
var Point = require("awayjs-core/lib/core/geom/Point");
var Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
var AbstractMethodError = require("awayjs-core/lib/errors/AbstractMethodError");
var BillboardRenderable = require("awayjs-stagegl/lib/core/pool/BillboardRenderable");
var TriangleSubMeshRenderable = require("awayjs-stagegl/lib/core/pool/TriangleSubMeshRenderable");
/**
 * An abstract base class for all picking collider classes. It should not be instantiated directly.
 *
 * @class away.pick.PickingColliderBase
 */
var PickingColliderBase = (function () {
    function PickingColliderBase() {
        this._billboardRenderablePool = RenderablePool.getPool(BillboardRenderable);
        this._subMeshRenderablePool = RenderablePool.getPool(TriangleSubMeshRenderable);
    }
    PickingColliderBase.prototype._pPetCollisionNormal = function (indexData /*uint*/, vertexData, triangleIndex) {
        var normal = new Vector3D();
        var i0 = indexData[triangleIndex] * 3;
        var i1 = indexData[triangleIndex + 1] * 3;
        var i2 = indexData[triangleIndex + 2] * 3;
        var p0 = new Vector3D(vertexData[i0], vertexData[i0 + 1], vertexData[i0 + 2]);
        var p1 = new Vector3D(vertexData[i1], vertexData[i1 + 1], vertexData[i1 + 2]);
        var p2 = new Vector3D(vertexData[i2], vertexData[i2 + 1], vertexData[i2 + 2]);
        var side0 = p1.subtract(p0);
        var side1 = p2.subtract(p0);
        normal = side0.crossProduct(side1);
        normal.normalize();
        return normal;
    };
    PickingColliderBase.prototype._pGetCollisionUV = function (indexData /*uint*/, uvData, triangleIndex, v, w, u, uvOffset, uvStride) {
        var uv = new Point();
        var uIndex = indexData[triangleIndex] * uvStride + uvOffset;
        var uv0 = new Vector3D(uvData[uIndex], uvData[uIndex + 1]);
        uIndex = indexData[triangleIndex + 1] * uvStride + uvOffset;
        var uv1 = new Vector3D(uvData[uIndex], uvData[uIndex + 1]);
        uIndex = indexData[triangleIndex + 2] * uvStride + uvOffset;
        var uv2 = new Vector3D(uvData[uIndex], uvData[uIndex + 1]);
        uv.x = u * uv0.x + v * uv1.x + w * uv2.x;
        uv.y = u * uv0.y + v * uv1.y + w * uv2.y;
        return uv;
    };
    /**
     * @inheritDoc
     */
    PickingColliderBase.prototype._pTestRenderableCollision = function (renderable, pickingCollisionVO, shortestCollisionDistance) {
        throw new AbstractMethodError();
    };
    /**
     * @inheritDoc
     */
    PickingColliderBase.prototype.setLocalRay = function (localPosition, localDirection) {
        this.rayPosition = localPosition;
        this.rayDirection = localDirection;
    };
    /**
     * Tests a <code>Billboard</code> object for a collision with the picking ray.
     *
     * @param billboard The billboard instance to be tested.
     * @param pickingCollisionVO The collision object used to store the collision results
     * @param shortestCollisionDistance The current value of the shortest distance to a detected collision along the ray.
     * @param findClosest
     */
    PickingColliderBase.prototype.testBillboardCollision = function (billboard, pickingCollisionVO, shortestCollisionDistance) {
        this.setLocalRay(pickingCollisionVO.localRayPosition, pickingCollisionVO.localRayDirection);
        pickingCollisionVO.materialOwner = null;
        if (this._pTestRenderableCollision(this._billboardRenderablePool.getItem(billboard), pickingCollisionVO, shortestCollisionDistance)) {
            shortestCollisionDistance = pickingCollisionVO.rayEntryDistance;
            pickingCollisionVO.materialOwner = billboard;
            return true;
        }
        return false;
    };
    /**
     * Tests a <code>Mesh</code> object for a collision with the picking ray.
     *
     * @param mesh The mesh instance to be tested.
     * @param pickingCollisionVO The collision object used to store the collision results
     * @param shortestCollisionDistance The current value of the shortest distance to a detected collision along the ray.
     * @param findClosest
     */
    PickingColliderBase.prototype.testMeshCollision = function (mesh, pickingCollisionVO, shortestCollisionDistance, findClosest) {
        this.setLocalRay(pickingCollisionVO.localRayPosition, pickingCollisionVO.localRayDirection);
        pickingCollisionVO.materialOwner = null;
        var subMesh;
        var len = mesh.subMeshes.length;
        for (var i = 0; i < len; ++i) {
            subMesh = mesh.subMeshes[i];
            if (this._pTestRenderableCollision(this._subMeshRenderablePool.getItem(subMesh), pickingCollisionVO, shortestCollisionDistance)) {
                shortestCollisionDistance = pickingCollisionVO.rayEntryDistance;
                pickingCollisionVO.materialOwner = subMesh;
                if (!findClosest)
                    return true;
            }
        }
        return pickingCollisionVO.materialOwner != null;
    };
    return PickingColliderBase;
})();
module.exports = PickingColliderBase;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvcGljay9waWNraW5nY29sbGlkZXJiYXNlLnRzIl0sIm5hbWVzIjpbIlBpY2tpbmdDb2xsaWRlckJhc2UiLCJQaWNraW5nQ29sbGlkZXJCYXNlLmNvbnN0cnVjdG9yIiwiUGlja2luZ0NvbGxpZGVyQmFzZS5fcFBldENvbGxpc2lvbk5vcm1hbCIsIlBpY2tpbmdDb2xsaWRlckJhc2UuX3BHZXRDb2xsaXNpb25VViIsIlBpY2tpbmdDb2xsaWRlckJhc2UuX3BUZXN0UmVuZGVyYWJsZUNvbGxpc2lvbiIsIlBpY2tpbmdDb2xsaWRlckJhc2Uuc2V0TG9jYWxSYXkiLCJQaWNraW5nQ29sbGlkZXJCYXNlLnRlc3RCaWxsYm9hcmRDb2xsaXNpb24iLCJQaWNraW5nQ29sbGlkZXJCYXNlLnRlc3RNZXNoQ29sbGlzaW9uIl0sIm1hcHBpbmdzIjoiQUFFQSxJQUFPLGNBQWMsV0FBZSwwQ0FBMEMsQ0FBQyxDQUFDO0FBQ2hGLElBQU8sS0FBSyxXQUFpQixpQ0FBaUMsQ0FBQyxDQUFDO0FBQ2hFLElBQU8sUUFBUSxXQUFpQixvQ0FBb0MsQ0FBQyxDQUFDO0FBR3RFLElBQU8sbUJBQW1CLFdBQWMsNENBQTRDLENBQUMsQ0FBQztBQUV0RixJQUFPLG1CQUFtQixXQUFjLGtEQUFrRCxDQUFDLENBQUM7QUFFNUYsSUFBTyx5QkFBeUIsV0FBWSx3REFBd0QsQ0FBQyxDQUFDO0FBRXRHLEFBS0E7Ozs7R0FERztJQUNHLG1CQUFtQjtJQVF4QkEsU0FSS0EsbUJBQW1CQTtRQVV2QkMsSUFBSUEsQ0FBQ0Esd0JBQXdCQSxHQUFHQSxjQUFjQSxDQUFDQSxPQUFPQSxDQUFDQSxtQkFBbUJBLENBQUNBLENBQUNBO1FBQzVFQSxJQUFJQSxDQUFDQSxzQkFBc0JBLEdBQUdBLGNBQWNBLENBQUNBLE9BQU9BLENBQUNBLHlCQUF5QkEsQ0FBQ0EsQ0FBQ0E7SUFDakZBLENBQUNBO0lBRU1ELGtEQUFvQkEsR0FBM0JBLFVBQTRCQSxTQUFTQSxDQUFlQSxRQUFEQSxBQUFTQSxFQUFFQSxVQUF3QkEsRUFBRUEsYUFBb0JBO1FBRTNHRSxJQUFJQSxNQUFNQSxHQUFZQSxJQUFJQSxRQUFRQSxFQUFFQSxDQUFDQTtRQUNyQ0EsSUFBSUEsRUFBRUEsR0FBVUEsU0FBU0EsQ0FBRUEsYUFBYUEsQ0FBRUEsR0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDN0NBLElBQUlBLEVBQUVBLEdBQVVBLFNBQVNBLENBQUVBLGFBQWFBLEdBQUdBLENBQUNBLENBQUVBLEdBQUNBLENBQUNBLENBQUNBO1FBQ2pEQSxJQUFJQSxFQUFFQSxHQUFVQSxTQUFTQSxDQUFFQSxhQUFhQSxHQUFHQSxDQUFDQSxDQUFFQSxHQUFDQSxDQUFDQSxDQUFDQTtRQUNqREEsSUFBSUEsRUFBRUEsR0FBWUEsSUFBSUEsUUFBUUEsQ0FBQ0EsVUFBVUEsQ0FBRUEsRUFBRUEsQ0FBRUEsRUFBRUEsVUFBVUEsQ0FBRUEsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBRUEsRUFBRUEsVUFBVUEsQ0FBRUEsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBRUEsQ0FBQ0EsQ0FBQ0E7UUFDN0ZBLElBQUlBLEVBQUVBLEdBQVlBLElBQUlBLFFBQVFBLENBQUNBLFVBQVVBLENBQUVBLEVBQUVBLENBQUVBLEVBQUVBLFVBQVVBLENBQUVBLEVBQUVBLEdBQUdBLENBQUNBLENBQUVBLEVBQUVBLFVBQVVBLENBQUVBLEVBQUVBLEdBQUdBLENBQUNBLENBQUVBLENBQUNBLENBQUNBO1FBQzdGQSxJQUFJQSxFQUFFQSxHQUFZQSxJQUFJQSxRQUFRQSxDQUFDQSxVQUFVQSxDQUFFQSxFQUFFQSxDQUFFQSxFQUFFQSxVQUFVQSxDQUFFQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFFQSxFQUFFQSxVQUFVQSxDQUFFQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFFQSxDQUFDQSxDQUFDQTtRQUM3RkEsSUFBSUEsS0FBS0EsR0FBWUEsRUFBRUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0E7UUFDckNBLElBQUlBLEtBQUtBLEdBQVlBLEVBQUVBLENBQUNBLFFBQVFBLENBQUNBLEVB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Q0FBQ0EsRUFBRUEsa0JBQWtCQSxFQUFFQSx5QkFBeUJBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUNsSkEseUJBQXlCQSxHQUFHQSxrQkFBa0JBLENBQUNBLGdCQUFnQkEsQ0FBQ0E7Z0JBRWhFQSxrQkFBa0JBLENBQUNBLGFBQWFBLEdBQUdBLE9BQU9BLENBQUNBO2dCQUUzQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsV0FBV0EsQ0FBQ0E7b0JBQ2hCQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtZQUNkQSxDQUFDQTtRQUNGQSxDQUFDQTtRQUVEQSxNQUFNQSxDQUFDQSxrQkFBa0JBLENBQUNBLGFBQWFBLElBQUlBLElBQUlBLENBQUNBO0lBQ2pEQSxDQUFDQTtJQUNGUCwwQkFBQ0E7QUFBREEsQ0FwSEEsQUFvSENBLElBQUE7QUFFRCxBQUE2QixpQkFBcEIsbUJBQW1CLENBQUMiLCJmaWxlIjoiY29yZS9waWNrL1BpY2tpbmdDb2xsaWRlckJhc2UuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL3JvYmJhdGVtYW4vV2Vic3Rvcm1Qcm9qZWN0cy9hd2F5anMtcmVuZGVyZXJnbC8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSVN1Yk1lc2hcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9jb3JlL2Jhc2UvSVN1Yk1lc2hcIik7XG5pbXBvcnQgUGlja2luZ0NvbGxpc2lvblZPXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvY29yZS9waWNrL1BpY2tpbmdDb2xsaXNpb25WT1wiKTtcbmltcG9ydCBSZW5kZXJhYmxlUG9vbFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvY29yZS9wb29sL1JlbmRlcmFibGVQb29sXCIpO1xuaW1wb3J0IFBvaW50XHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvY29yZS9nZW9tL1BvaW50XCIpO1xuaW1wb3J0IFZlY3RvcjNEXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvY29yZS9nZW9tL1ZlY3RvcjNEXCIpO1xuaW1wb3J0IEJpbGxib2FyZFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9lbnRpdGllcy9CaWxsYm9hcmRcIik7XG5pbXBvcnQgTWVzaFx0XHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZW50aXRpZXMvTWVzaFwiKTtcbmltcG9ydCBBYnN0cmFjdE1ldGhvZEVycm9yXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZXJyb3JzL0Fic3RyYWN0TWV0aG9kRXJyb3JcIik7XG5cbmltcG9ydCBCaWxsYm9hcmRSZW5kZXJhYmxlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvY29yZS9wb29sL0JpbGxib2FyZFJlbmRlcmFibGVcIik7XG5pbXBvcnQgUmVuZGVyYWJsZUJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2NvcmUvcG9vbC9SZW5kZXJhYmxlQmFzZVwiKTtcbmltcG9ydCBUcmlhbmdsZVN1Yk1lc2hSZW5kZXJhYmxlXHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9jb3JlL3Bvb2wvVHJpYW5nbGVTdWJNZXNoUmVuZGVyYWJsZVwiKTtcblxuLyoqXG4gKiBBbiBhYnN0cmFjdCBiYXNlIGNsYXNzIGZvciBhbGwgcGlja2luZyBjb2xsaWRlciBjbGFzc2VzLiBJdCBzaG91bGQgbm90IGJlIGluc3RhbnRpYXRlZCBkaXJlY3RseS5cbiAqXG4gKiBAY2xhc3MgYXdheS5waWNrLlBpY2tpbmdDb2xsaWRlckJhc2VcbiAqL1xuY2xhc3MgUGlja2luZ0NvbGxpZGVyQmFzZVxue1xuXHRwcml2YXRlIF9iaWxsYm9hcmRSZW5kZXJhYmxlUG9vbDpSZW5kZXJhYmxlUG9vbDtcblx0cHJpdmF0ZSBfc3ViTWVzaFJlbmRlcmFibGVQb29sOlJlbmRlcmFibGVQb29sO1xuXG5cdHB1YmxpYyByYXlQb3NpdGlvbjpWZWN0b3IzRDtcblx0cHVibGljIHJheURpcmVjdGlvbjpWZWN0b3IzRDtcblxuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHR0aGlzLl9iaWxsYm9hcmRSZW5kZXJhYmxlUG9vbCA9IFJlbmRlcmFibGVQb29sLmdldFBvb2woQmlsbGJvYXJkUmVuZGVyYWJsZSk7XG5cdFx0dGhpcy5fc3ViTWVzaFJlbmRlcmFibGVQb29sID0gUmVuZGVyYWJsZVBvb2wuZ2V0UG9vbChUcmlhbmdsZVN1Yk1lc2hSZW5kZXJhYmxlKTtcblx0fVxuXG5cdHB1YmxpYyBfcFBldENvbGxpc2lvbk5vcm1hbChpbmRleERhdGE6QXJyYXk8bnVtYmVyPiAvKnVpbnQqLywgdmVydGV4RGF0YTpBcnJheTxudW1iZXI+LCB0cmlhbmdsZUluZGV4Om51bWJlcik6VmVjdG9yM0QgLy8gUFJPVEVDVEVEXG5cdHtcblx0XHR2YXIgbm9ybWFsOlZlY3RvcjNEID0gbmV3IFZlY3RvcjNEKCk7XG5cdFx0dmFyIGkwOm51bWJlciA9IGluZGV4RGF0YVsgdHJpYW5nbGVJbmRleCBdKjM7XG5cdFx0dmFyIGkxOm51bWJlciA9IGluZGV4RGF0YVsgdHJpYW5nbGVJbmRleCArIDEgXSozO1xuXHRcdHZhciBpMjpudW1iZXIgPSBpbmRleERhdGFbIHRyaWFuZ2xlSW5kZXggKyAyIF0qMztcblx0XHR2YXIgcDA6VmVjdG9yM0QgPSBuZXcgVmVjdG9yM0QodmVydGV4RGF0YVsgaTAgXSwgdmVydGV4RGF0YVsgaTAgKyAxIF0sIHZlcnRleERhdGFbIGkwICsgMiBdKTtcblx0XHR2YXIgcDE6VmVjdG9yM0QgPSBuZXcgVmVjdG9yM0QodmVydGV4RGF0YVsgaTEgXSwgdmVydGV4RGF0YVsgaTEgKyAxIF0sIHZlcnRleERhdGFbIGkxICsgMiBdKTtcblx0XHR2YXIgcDI6VmVjdG9yM0QgPSBuZXcgVmVjdG9yM0QodmVydGV4RGF0YVsgaTIgXSwgdmVydGV4RGF0YVsgaTIgKyAxIF0sIHZlcnRleERhdGFbIGkyICsgMiBdKTtcblx0XHR2YXIgc2lkZTA6VmVjdG9yM0QgPSBwMS5zdWJ0cmFjdChwMCk7XG5cdFx0dmFyIHNpZGUxOlZlY3RvcjNEID0gcDIuc3VidHJhY3QocDApO1xuXHRcdG5vcm1hbCA9IHNpZGUwLmNyb3NzUHJvZHVjdChzaWRlMSk7XG5cdFx0bm9ybWFsLm5vcm1hbGl6ZSgpO1xuXHRcdHJldHVybiBub3JtYWw7XG5cdH1cblxuXHRwdWJsaWMgX3BHZXRDb2xsaXNpb25VVihpbmRleERhdGE6QXJyYXk8bnVtYmVyPiAvKnVpbnQqLywgdXZEYXRhOkFycmF5PG51bWJlcj4sIHRyaWFuZ2xlSW5kZXg6bnVtYmVyLCB2Om51bWJlciwgdzpudW1iZXIsIHU6bnVtYmVyLCB1dk9mZnNldDpudW1iZXIsIHV2U3RyaWRlOm51bWJlcik6UG9pbnQgLy8gUFJPVEVDVEVEXG5cdHtcblx0XHR2YXIgdXY6UG9pbnQgPSBuZXcgUG9pbnQoKTtcblx0XHR2YXIgdUluZGV4Om51bWJlciA9IGluZGV4RGF0YVsgdHJpYW5nbGVJbmRleCBdKnV2U3RyaWRlICsgdXZPZmZzZXQ7XG5cdFx0dmFyIHV2MDpWZWN0b3IzRCA9IG5ldyBWZWN0b3IzRCh1dkRhdGFbIHVJbmRleCBdLCB1dkRhdGFbIHVJbmRleCArIDEgXSk7XG5cdFx0dUluZGV4ID0gaW5kZXhEYXRhWyB0cmlhbmdsZUluZGV4ICsgMSBdKnV2U3RyaWRlICsgdXZPZmZzZXQ7XG5cdFx0dmFyIHV2MTpWZWN0b3IzRCA9IG5ldyBWZWN0b3IzRCh1dkRhdGFbIHVJbmRleCBdLCB1dkRhdGFbIHVJbmRleCArIDEgXSk7XG5cdFx0dUluZGV4ID0gaW5kZXhEYXRhWyB0cmlhbmdsZUluZGV4ICsgMiBdKnV2U3RyaWRlICsgdXZPZmZzZXQ7XG5cdFx0dmFyIHV2MjpWZWN0b3IzRCA9IG5ldyBWZWN0b3IzRCh1dkRhdGFbIHVJbmRleCBdLCB1dkRhdGFbIHVJbmRleCArIDEgXSk7XG5cdFx0dXYueCA9IHUqdXYwLnggKyB2KnV2MS54ICsgdyp1djIueDtcblx0XHR1di55ID0gdSp1djAueSArIHYqdXYxLnkgKyB3KnV2Mi55O1xuXHRcdHJldHVybiB1djtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIF9wVGVzdFJlbmRlcmFibGVDb2xsaXNpb24ocmVuZGVyYWJsZTpSZW5kZXJhYmxlQmFzZSwgcGlja2luZ0NvbGxpc2lvblZPOlBpY2tpbmdDb2xsaXNpb25WTywgc2hvcnRlc3RDb2xsaXNpb25EaXN0YW5jZTpudW1iZXIpOmJvb2xlYW5cblx0e1xuXHRcdHRocm93IG5ldyBBYnN0cmFjdE1ldGhvZEVycm9yKCk7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBzZXRMb2NhbFJheShsb2NhbFBvc2l0aW9uOlZlY3RvcjNELCBsb2NhbERpcmVjdGlvbjpWZWN0b3IzRClcblx0e1xuXHRcdHRoaXMucmF5UG9zaXRpb24gPSBsb2NhbFBvc2l0aW9uO1xuXHRcdHRoaXMucmF5RGlyZWN0aW9uID0gbG9jYWxEaXJlY3Rpb247XG5cdH1cblxuXHQvKipcblx0ICogVGVzdHMgYSA8Y29kZT5CaWxsYm9hcmQ8L2NvZGU+IG9iamVjdCBmb3IgYSBjb2xsaXNpb24gd2l0aCB0aGUgcGlja2luZyByYXkuXG5cdCAqXG5cdCAqIEBwYXJhbSBiaWxsYm9hcmQgVGhlIGJpbGxib2FyZCBpbnN0YW5jZSB0byBiZSB0ZXN0ZWQuXG5cdCAqIEBwYXJhbSBwaWNraW5nQ29sbGlzaW9uVk8gVGhlIGNvbGxpc2lvbiBvYmplY3QgdXNlZCB0byBzdG9yZSB0aGUgY29sbGlzaW9uIHJlc3VsdHNcblx0ICogQHBhcmFtIHNob3J0ZXN0Q29sbGlzaW9uRGlzdGFuY2UgVGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIHNob3J0ZXN0IGRpc3RhbmNlIHRvIGEgZGV0ZWN0ZWQgY29sbGlzaW9uIGFsb25nIHRoZSByYXkuXG5cdCAqIEBwYXJhbSBmaW5kQ2xvc2VzdFxuXHQgKi9cblx0cHVibGljIHRlc3RCaWxsYm9hcmRDb2xsaXNpb24oYmlsbGJvYXJkOkJpbGxib2FyZCwgcGlja2luZ0NvbGxpc2lvblZPOlBpY2tpbmdDb2xsaXNpb25WTywgc2hvcnRlc3RDb2xsaXNpb25EaXN0YW5jZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLnNldExvY2FsUmF5KHBpY2tpbmdDb2xsaXNpb25WTy5sb2NhbFJheVBvc2l0aW9uLCBwaWNraW5nQ29sbGlzaW9uVk8ubG9jYWxSYXlEaXJlY3Rpb24pO1xuXHRcdHBpY2tpbmdDb2xsaXNpb25WTy5tYXRlcmlhbE93bmVyID0gbnVsbDtcblxuXHRcdGlmICh0aGlzLl9wVGVzdFJlbmRlcmFibGVDb2xsaXNpb24oPFJlbmRlcmFibGVCYXNlPiB0aGlzLl9iaWxsYm9hcmRSZW5kZXJhYmxlUG9vbC5nZXRJdGVtKGJpbGxib2FyZCksIHBpY2tpbmdDb2xsaXNpb25WTywgc2hvcnRlc3RDb2xsaXNpb25EaXN0YW5jZSkpIHtcblx0XHRcdHNob3J0ZXN0Q29sbGlzaW9uRGlzdGFuY2UgPSBwaWNraW5nQ29sbGlzaW9uVk8ucmF5RW50cnlEaXN0YW5jZTtcblxuXHRcdFx0cGlja2luZ0NvbGxpc2lvblZPLm1hdGVyaWFsT3duZXIgPSBiaWxsYm9hcmQ7XG5cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUZXN0cyBhIDxjb2RlPk1lc2g8L2NvZGU+IG9iamVjdCBmb3IgYSBjb2xsaXNpb24gd2l0aCB0aGUgcGlja2luZyByYXkuXG5cdCAqXG5cdCAqIEBwYXJhbSBtZXNoIFRoZSBtZXNoIGluc3RhbmNlIHRvIGJlIHRlc3RlZC5cblx0ICogQHBhcmFtIHBpY2tpbmdDb2xsaXNpb25WTyBUaGUgY29sbGlzaW9uIG9iamVjdCB1c2VkIHRvIHN0b3JlIHRoZSBjb2xsaXNpb24gcmVzdWx0c1xuXHQgKiBAcGFyYW0gc2hvcnRlc3RDb2xsaXNpb25EaXN0YW5jZSBUaGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgc2hvcnRlc3QgZGlzdGFuY2UgdG8gYSBkZXRlY3RlZCBjb2xsaXNpb24gYWxvbmcgdGhlIHJheS5cblx0ICogQHBhcmFtIGZpbmRDbG9zZXN0XG5cdCAqL1xuXHRwdWJsaWMgdGVzdE1lc2hDb2xsaXNpb24obWVzaDpNZXNoLCBwaWNraW5nQ29sbGlzaW9uVk86UGlja2luZ0NvbGxpc2lvblZPLCBzaG9ydGVzdENvbGxpc2lvbkRpc3RhbmNlOm51bWJlciwgZmluZENsb3Nlc3Q6Ym9vbGVhbik6Ym9vbGVhblxuXHR7XG5cdFx0dGhpcy5zZXRMb2NhbFJheShwaWNraW5nQ29sbGlzaW9uVk8ubG9jYWxSYXlQb3NpdGlvbiwgcGlja2luZ0NvbGxpc2lvblZPLmxvY2FsUmF5RGlyZWN0aW9uKTtcblx0XHRwaWNraW5nQ29sbGlzaW9uVk8ubWF0ZXJpYWxPd25lciA9IG51bGw7XG5cblx0XHR2YXIgc3ViTWVzaDpJU3ViTWVzaDtcblxuXHRcdHZhciBsZW46bnVtYmVyID0gbWVzaC5zdWJNZXNoZXMubGVuZ3RoO1xuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxlbjsgKytpKSB7XG5cdFx0XHRzdWJNZXNoID0gbWVzaC5zdWJNZXNoZXNbaV07XG5cblx0XHRcdGlmICh0aGlzLl9wVGVzdFJlbmRlcmFibGVDb2xsaXNpb24oPFJlbmRlcmFibGVCYXNlPiB0aGlzLl9zdWJNZXNoUmVuZGVyYWJsZVBvb2wuZ2V0SXRlbShzdWJNZXNoKSwgcGlja2luZ0NvbGxpc2lvblZPLCBzaG9ydGVzdENvbGxpc2lvbkRpc3RhbmNlKSkge1xuXHRcdFx0XHRzaG9ydGVzdENvbGxpc2lvbkRpc3RhbmNlID0gcGlja2luZ0NvbGxpc2lvblZPLnJheUVudHJ5RGlzdGFuY2U7XG5cblx0XHRcdFx0cGlja2luZ0NvbGxpc2lvblZPLm1hdGVyaWFsT3duZXIgPSBzdWJNZXNoO1xuXG5cdFx0XHRcdGlmICghZmluZENsb3Nlc3QpXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHBpY2tpbmdDb2xsaXNpb25WTy5tYXRlcmlhbE93bmVyICE9IG51bGw7XG5cdH1cbn1cblxuZXhwb3J0ID0gUGlja2luZ0NvbGxpZGVyQmFzZTsiXX0=