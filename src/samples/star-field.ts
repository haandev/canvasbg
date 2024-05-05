import { CanvasBG } from "../canvas-bg";
import { Particle } from "../types";

/**
 * Represents a star field background displayed on a canvas.
 * Extends the CanvasBG class to inherit base canvas background functionality.
 * @example
 * ```typescript
 * // Create a StarField instance with a canvas selector
 * const starField = new StarField('#myCanvas');
 *
 * // Use previously created CanvasBG instance
 * const mainCanvas = new CanvasBG();
 * const starField = new StarField(mainCanvas);
 *
 * // Chain with previously created CanvasBG instance
 * const bg = new CanvasBG()
 *   .use(new StarField());
 *
 * ```
 *
 * Configuration options:
 * - `velocity` - The velocity of the stars. Default is `0.001` .
 * - `points` - The number of points to display. Default is `150`.
 *
 * @example
 * // Create a StarField instance with configuration options
 * const starField = new StarField('#myCanvas', { velocity: 0.002, points: 200 });
 *
 * // Chain a StarField instance with configuration options using a previously created CanvasBG instance
 * const bg = new CanvasBG()
 *   .use(new StarField(null, { velocity: 0.002, points: 200 }));
 *
 */
export class StarField extends CanvasBG {
  private velocity: number = 0;
  private initializePoints(pointCount: number) {
    const size = this.store.size as { width: number; height: number };
    for (let i = 0; i < pointCount; i++) {
      const dots = this.store.dots as Particle[];
      dots.push({
        coordinate: [
          Math.random() * (size.width + 500) - 250,
          Math.random() * (size.height + 500) - 250,
        ],
        scale: 0.2 + Math.random() * (1 - 0.2),
      });
    }
  }
  private updatePoints() {
    const dots = this.store.dots as Particle[];
    const size = this.store.size as { width: number; height: number };
    this.velocity = this.velocity || 0;
    dots.forEach((point: Particle) => {
      point.scale += this.velocity;
      point.coordinate[0] +=
        (point.coordinate[0] - size.width / 2) * point.scale * this.velocity;
      point.coordinate[1] +=
        (point.coordinate[1] - size.width / 2) * point.scale * this.velocity;

      if (point.coordinate[0] < 0 || point.coordinate[0] > size.width) {
        point.coordinate[0] = Math.random() * (size.width + 500) - 250;
        point.coordinate[1] = Math.random() * (size.height + 500) - 250;
        point.scale = 0.2 + Math.random() * (1 - 0.2);
      }
    });
  }
  private drawPoints() {
    const dots = this.store.dots as Particle[];
    dots.forEach((point) => {
      if (!this.ctx) return;
      this.ctx.beginPath();
      this.ctx.fillStyle = `rgba(255, 255, 255, 1)`;
      this.ctx.arc(
        point.coordinate[0],
        point.coordinate[1],
        point.scale,
        0,
        Math.PI * 2
      );
      this.ctx.fill();
    });
  }
  protected init(): void {
    this.velocity = 0.001;
    this.store.dots = [];
    this.initializePoints((this.config?.points as number) || 150);
  }
  protected draw() {
    super.draw();
    this.updatePoints();
    this.drawPoints();
  }
}
