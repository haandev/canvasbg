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
  protected init() {
    super.init();
    window.addEventListener("mousemove", (e) => {
      if (!this.canvas) return;
      const mousePosition = this.store.mousePosition as [number, number];
      mousePosition[0] = e.clientX - this.canvas.offsetLeft;
      mousePosition[1] = e.clientY - this.canvas.offsetTop;
    });
    this.store.mousePosition = [0, 0];
  }
  protected draw() {
    if (!this.ctx) throw new Error("Canvas context not initialized");
    const mousePosition = this.store.mousePosition as [number, number];
    this.ctx.beginPath();
    this.ctx.fillStyle = "white";
    this.ctx.arc(mousePosition[0], mousePosition[1], 2, 0, Math.PI * 2);
    this.ctx.fill();
  }
}
