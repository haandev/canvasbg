import { Delaunay } from "d3-delaunay";
import { CanvasBG } from "../canvas-bg";
import { Particle } from "../types";

/**
 * Represents a constellation displayed on a canvas.
 * Extends the CanvasBG class to inherit base canvas background functionality.
 *
 * @remarks Constellation is dependent on the StarField and MouseTracker classes.
 * To use the Constellation class, you must first initialize the StarField and MouseTracker on same context.
 *
 * @example
 * // Create a Constellation instance with a canvas selector
 * const constellation = new Constellation('#myCanvas');
 *
 * // Use previously created CanvasBG instance
 * const mainCanvas = new CanvasBG();
 * const constellation = new Constellation(mainCanvas);
 *
 * // Chain with previously created CanvasBG instance
 * const bg = new CanvasBG()
 *   .use(new StarField())
 *   .use(new MouseTracker())
 *   .use(new Constellation());
 */
export class Constellation extends CanvasBG {
  private getDistance(point: Delaunay.Point) {
    const mousePosition = this.store.mousePosition as [number, number];
    return Math.sqrt(
      (point[0] - mousePosition[0]) ** 2 + (point[1] - mousePosition[1]) ** 2
    );
  }
  protected draw() {
    if (!this.ctx) throw new Error("Canvas context not initialized");
    if (!this.store.dots)
      throw new Error(
        "Dots not initialized at store, use StarField or similar class to initialize it"
      );
    if (!this.store.mousePosition)
      throw new Error(
        "Mouse position not initialized at store, use MouseTracker to initialize it"
      );

    const mousePosition = this.store.mousePosition as [number, number];
    const dots = this.store.dots as Particle[];
    if (dots.length < 5) return;
    const XYs = [
      mousePosition,
      ...(dots.map((point) => point.coordinate) as Delaunay.Point[]),
    ];

    const delaunay = Delaunay.from(XYs as Delaunay.Point[]);
    const triangleIndices = delaunay.triangles;

    for (let i = 0; i < triangleIndices.length; i += 3) {
      const alpha = 0.2 - this.getDistance(XYs[triangleIndices[i]]) / 1000;
      this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
      const p0 = XYs[triangleIndices[i]];
      const p1 = XYs[triangleIndices[i + 1]];
      const p2 = XYs[triangleIndices[i + 2]];
      this.ctx.beginPath();
      this.ctx.moveTo(p0[0], p0[1]);
      this.ctx.lineTo(p1[0], p1[1]);
      this.ctx.lineTo(p2[0], p2[1]);
      this.ctx.closePath();
      this.ctx.stroke();
    }
  }
}
