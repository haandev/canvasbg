import { CanvasBG } from "../canvas-bg";

/**
 * A class to track the mouse position on the canvas.
 *
 * @example
 * ```typescript
 * // Create a MouseTracker instance with a canvas selector
 * const mouseTracker = new MouseTracker(".bg-canvas")
 *
 * // Use previously created CanvasBG instance
 * const mainCanvas = new CanvasBG();
 * const mouseTracker = new MouseTracker(mainCanvas);
 *
 * // Chain with previously created CanvasBG instance
 * const bg = new CanvasBG()
 *  .use(new StarField())
 *  .use(new MouseTracker());
 * bg.animate();
 * ```
 */
export class MouseTracker extends CanvasBG {
  public readonly defaultAlias = "mousetracker";

  mousePosition: [number, number] = [0, 0];
  protected init() {
    super.init();
    window.addEventListener("mousemove", (e) => {
      if (!this.canvas) return;
      const mousePosition = this.mousePosition as [number, number];
      mousePosition[0] = e.clientX - this.canvas.offsetLeft;
      mousePosition[1] = e.clientY - this.canvas.offsetTop;
    });
    this.mousePosition = [0, 0];
  }
}
