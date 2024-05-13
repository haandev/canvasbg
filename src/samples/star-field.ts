import { CanvasBG } from "../canvas-bg";
import { CanvasSelector, Particle } from "../types";

export const mathRandBetween = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export type speedVector = { x: number; y: number; z: number };
export type StarFieldConfig = {
  speed?: speedVector;
  points?: number;
  alpha?: number;
  feed?: "top" | "bottom" | "left" | "right" | "anywhere";
};
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
 * - `speed` - The speed of the stars. Default is `0.001` .
 * - `points` - The number of points to display. Default is `150`.
 * - `alpha` - The global alpha value of the stars. Default is `1`.
 * - `feed` - The direction from which the stars will be fed. Default is `anywhere`.
 *
 * @example
 * // Create a StarField instance with configuration options
 * const starField = new StarField('#myCanvas', { speed: 0.002, points: 200 });
 *
 * // Chain a StarField instance with configuration options using a previously created CanvasBG instance
 * const bg = new CanvasBG()
 *   .use(new StarField(null, { speed: 0.002, points: 200 }));
 *
 */
export class StarField extends CanvasBG<StarFieldConfig> {
  public readonly defaultAlias = "starfield";

  private speed: speedVector = { x: 0, y: 0, z: 0 };

  public dots: Particle[] = [];
  constructor(canvas?: CanvasSelector, config?: StarFieldConfig) {
    super(canvas, config);
  }
  private initializePoints(pointCount: number) {
    for (let i = 0; i < pointCount; i++) {
      this.dots.push({
        coordinate: [Math.random() * (this.size.width + 500) - 250, Math.random() * (this.size.height + 500) - 250],
        scale: 0.2 + Math.random() * (1 - 0.2),
      });
    }
  }
  private updateParticles() {
    this.dots.forEach((point: Particle) => {
      point.scale += this.speed.z;
      //update x coordinate
      point.coordinate[0] +=
        (((point.coordinate[0] - this.size.width / 2) * point.scale) / 2) * this.speed.z +
        (this.speed.x * point.scale) / 1;

      //update y coordinate
      point.coordinate[1] +=
        (((point.coordinate[1] - this.size.height / 2) * point.scale) / 2) * this.speed.z +
        (this.speed.y * point.scale) / 1;

      //recreate point if it goes out of bounds
      if (
        point.coordinate[0] < 0 ||
        point.coordinate[0] > this.size.width + 250 ||
        point.coordinate[1] < 0 ||
        point.coordinate[1] > this.size.height
      ) {
        this.regenerateParticle(point);
      }
    });
  }
  private regenerateParticle(point: Particle) {
    const direction = this.config.feed || "anywhere";
    if (direction === "anywhere") {
      point.coordinate[0] = mathRandBetween(-250, this.size.width + 250);
      point.coordinate[1] = mathRandBetween(-250, this.size.height + 250);
      point.scale = mathRandBetween(0.2, 1);
    }
    if (direction === "top") {
      point.coordinate[0] = mathRandBetween(-250, this.size.width + 250);
      point.coordinate[1] = mathRandBetween(-250, 0);
      point.scale = mathRandBetween(0.2, 1);
    }
    if (direction === "bottom") {
      point.coordinate[0] = mathRandBetween(-250, this.size.width + 250);
      point.coordinate[1] = mathRandBetween(this.size.height, this.size.height + 250);
      point.scale = mathRandBetween(0.2, 1);
    }
    if (direction === "left") {
      point.coordinate[0] = mathRandBetween(-250, 0);
      point.coordinate[1] = mathRandBetween(-250, this.size.height + 250);
      point.scale = mathRandBetween(0.2, 1);
    }
    if (direction === "right") {
      point.coordinate[0] = mathRandBetween(this.size.width, this.size.width + 250);
      point.coordinate[1] = mathRandBetween(-250, this.size.height + 250);
      point.scale = mathRandBetween(0.2, 1);
    }
  }
  private drawParticles() {
    this.dots.forEach((point) => {
      if (!this.ctx) return;
      this.ctx.beginPath();
      const alpha = ((this.config.alpha || 1) * point.scale) / 2;
      this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      this.ctx.arc(point.coordinate[0], point.coordinate[1], point.scale, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }
  protected init(): void {
    this.speed = (this.config.speed as speedVector) || {
      x: 0,
      y: 0,
      z: 0.001,
    };
    this.initializePoints((this.config?.points as number) || 150);
  }
  protected draw() {
    super.draw();
    this.updateParticles();
    this.drawParticles();
  }
}
