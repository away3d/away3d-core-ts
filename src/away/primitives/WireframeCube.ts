﻿///<reference path="../_definitions.ts"/>

module away.primitives
{
	//TODO - convert to geometry primitive

	/**
	 * A WirefameCube primitive mesh.
	 */
	export class WireframeCube extends away.primitives.WireframePrimitiveBase
	{
		/**
		 * Creates a new WireframeCube object.
		 * @param width The size of the cube along its X-axis.
		 * @param height The size of the cube along its Y-axis.
		 * @param depth The size of the cube along its Z-axis.
		 * @param color The colour of the wireframe lines
		 * @param thickness The thickness of the wireframe lines
		 */
		constructor(width:number = 100, height:number = 100, depth:number = 100, color:number = 0xFFFFFF, thickness:number = 1)
		{
			super(color, thickness);

			this.width = width;
			this.height = height;
			this.depth = depth;
		}

		/**
		 * @inheritDoc
		 */
		public pBuildGeometry()
		{
			var v0:away.geom.Vector3D = new away.geom.Vector3D();
			var v1:away.geom.Vector3D = new away.geom.Vector3D();
			var hw:number = 0.5;
			var hh:number = 0.5;
			var hd:number = 0.5;

			v0.x = -hw;
			v0.y = hh;
			v0.z = -hd;
			v1.x = -hw;
			v1.y = -hh;
			v1.z = -hd;

			this.pUpdateOrAddSegment(0, v0, v1);
			v0.z = hd;
			v1.z = hd;
			this.pUpdateOrAddSegment(1, v0, v1);
			v0.x = hw;
			v1.x = hw;
			this.pUpdateOrAddSegment(2, v0, v1);
			v0.z = -hd;
			v1.z = -hd;
			this.pUpdateOrAddSegment(3, v0, v1);

			v0.x = -hw;
			v0.y = -hh;
			v0.z = -hd;
			v1.x = hw;
			v1.y = -hh;
			v1.z = -hd;
			this.pUpdateOrAddSegment(4, v0, v1);
			v0.y = hh;
			v1.y = hh;
			this.pUpdateOrAddSegment(5, v0, v1);
			v0.z = hd;
			v1.z = hd;
			this.pUpdateOrAddSegment(6, v0, v1);
			v0.y = -hh;
			v1.y = -hh;
			this.pUpdateOrAddSegment(7, v0, v1);

			v0.x = -hw;
			v0.y = -hh;
			v0.z = -hd;
			v1.x = -hw;
			v1.y = -hh;
			v1.z = hd;
			this.pUpdateOrAddSegment(8, v0, v1);
			v0.y = hh;
			v1.y = hh;
			this.pUpdateOrAddSegment(9, v0, v1);
			v0.x = hw;
			v1.x = hw;
			this.pUpdateOrAddSegment(10, v0, v1);
			v0.y = -hh;
			v1.y = -hh;
			this.pUpdateOrAddSegment(11, v0, v1);
		}
	}
}
