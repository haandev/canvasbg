import { Delaunay } from "d3-delaunay";
import { CanvasBG } from "../canvas-bg";
import { CanvasSelector, ChildCanvasBG, Particle } from "../types";

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
export type ConstellationConfig = {
  mousetracker: ChildCanvasBG | string;
  starfield: ChildCanvasBG | string;
};
export class Constellation extends CanvasBG<ConstellationConfig> {
  private dots: Particle[] = [];
  private mousePosition: [number, number] = [0, 0];

  constructor(
    canvas: CanvasSelector,
    config: {
      mousetracker: ChildCanvasBG | string;
      starfield: ChildCanvasBG | string;
    }
  ) {
    super(canvas, config);
  }
  init() {
    super.init();

    let starfield;
    if (typeof this.config.starfield === "string") {
      starfield = this.layers[this.config.starfield];
    } else {
      starfield = this.config.starfield;
    }
    if ("dots" in starfield) {
      this.dots = starfield.dots as Particle[];
    }

    let mousetracker;
    if (typeof this.config.mousetracker === "string") {
      mousetracker = this.layers[this.config.mousetracker];
    } else {
      mousetracker = this.config.mousetracker;
    }
    if ("mousePosition" in mousetracker) {
      this.mousePosition = mousetracker.mousePosition as [number, number];
    }
  }
  private getDistance(point: Delaunay.Point) {
    const mousePosition = this.mousePosition as [number, number];
    return Math.sqrt(
      (point[0] - mousePosition[0]) ** 2 + (point[1] - mousePosition[1]) ** 2
    );
  }
  protected draw() {
    if (!this.ctx) throw new Error("Canvas context not initialized");

    // Check if dots and mouse position are initialized
    if (!this.dots)
      throw new Error(
        "Dots not initialized at store, use StarField or similar class to initialize it"
      );
    if (!this.mousePosition)
      throw new Error(
        "Mouse position not initialized at store, use MouseTracker to initialize it"
      );

    //circle around mouse
    this.ctx.beginPath();
    this.ctx.fillStyle = "white";
    this.ctx.arc(
      this.mousePosition[0],
      this.mousePosition[1],
      2,
      0,
      Math.PI * 2
    );
    this.ctx.fill();

    const dots = this.dots as Particle[];
    if (dots.length < 5) return;
    const XYs = [
      this.mousePosition,
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
