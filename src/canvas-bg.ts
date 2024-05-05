import { CanvasSelector, ChildCanvasBG, NotNullCanvasSelector } from "./types";

/**
 * Constructs a new CanvasBG instance.
 
 * @description The CanvasBG class is a base class for creating canvas backgrounds.
 * It provides a simple API for creating and managing canvas backgrounds.
 * The class can be extended to create custom canvas backgrounds.
 * @remarks CanvasBG instances can be chained together to create complex backgrounds.
 */
export class CanvasBG {
  protected canvas?: HTMLCanvasElement;
  protected ctx?: CanvasRenderingContext2D;

  /**
   * Represents the store for the canvas background.
   * The store is a key-value store that can be used to store and retrieve data.
   * The store is shared across all instances of the CanvasBG or extended class.
   *
   * When overriding the init method in a ChildCanvasBG class, create a new key on this field
   * if there is shared data that will be used across different instances. For example:
   * - MouseTracker class stores mouse positions here.
   * - Base CanvasBG class stores canvas width and height here.
   * - StarField class stores star positions here (consumed by Constellation).
   *
   * Values created here will remain standalone when used independently.
   * However, when used in a chained or bound context, they will be merged
   * with the main instance and share the same reference.
   */

  protected store: Record<string, unknown> = {
    size: { width: 0, height: 0 },
  };

  private boundBackgrounds: ChildCanvasBG[] = [];
  private animationCallbacks = [] as (() => void)[];

  protected config?: Record<string, unknown>;

  /**
   * @param canvas The canvas element, selector, or ChildCanvasBG.
   * @param config Optional configuration options.
   * @example
   * ```typescript
   * // Create a CanvasBG instance with a canvas element
   * const canvasBG = new CanvasBG(document.getElementById('myCanvas'));
   *
   * // Create a CanvasBG instance with a canvas selector
   * const canvasBG = new CanvasBG('#myCanvas');
   *
   * // Create a CanvasBG instance with another CanvasBG instance
   * const mainCanvas = new CanvasBG();
   * const childCanvasBG = new CanvasBG(mainCanvas);
   * ```
   *
   * @remarks If you are extending the CanvasBG class with a subclass, make sure to call
   * the superclass constructor using `super()` within the constructor of the subclass.
   */
  constructor(canvas?: CanvasSelector, config?: Record<string, any>) {
    if (!canvas) return;
    this.config = config;
    this.bindContext(canvas);
  }

  private bindContext(host: NotNullCanvasSelector) {
    if (typeof host === "string") {
      this.canvas = document.querySelector(host) as HTMLCanvasElement;
    } else if (host instanceof HTMLCanvasElement) {
      this.canvas = host;
    } else if (host instanceof CanvasBG) {
      this.canvas = host.canvas as HTMLCanvasElement;
      Object.assign(host.store, { ...host.store, ...this.store });
      this.store = host.store;
      this.store.size = host.store.size;
      host.boundBackgrounds.push(this);
    } else {
      throw new Error("Invalid canvas selector");
    }
    this.init();

    if (host) {
      const size = this.store.size as { width: number; height: number };
      size.width = this.canvas.clientWidth;
      size.height = this.canvas.clientHeight;
      this.initializeCanvas();
      this.initResizeListener();
    }
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.addAnimationCallback(this.draw.bind(this));
  }
  private initResizeListener() {
    window.addEventListener("resize", () => {
      if (!this.canvas) return;
      const size = this.store.size as { width: number; height: number };
      size.width = this.canvas.clientWidth;
      size.height = this.canvas.clientHeight;
      this.initializeCanvas();
    });
  }
  private callAnimationCallbacks() {
    this.animationCallbacks.forEach((callback) => callback());
    this.boundBackgrounds.forEach((bg) => {
      bg.callAnimationCallbacks?.();
    });
  }
  private addAnimationCallback(callback: () => void) {
    setTimeout(() => {
      this.animationCallbacks.push(callback);
    }, 10);
  }
  private initializeCanvas() {
    if (!this.canvas) throw new Error("Canvas not initialized");
    const size = this.store.size as { width: number; height: number };
    this.canvas.width = size.width;
    this.canvas.height = size.height;
  }

  /**
   * Initializes the canvas.
   * Override this method to initialize your class after binding with a canvas context.
   * For example, you can add mouse listeners for any DOM element like windows or canvas itself,
   * and add shapes, stars, dots, lines, etc.
   */
  protected init() {
    // Override this method to initialize the listeners
  }

  /**
   * Draws on the canvas.
   * Override this method to draw on the canvas.
   * @remarks Do not clear the canvas or call requestAnimationFrame() here; it will be handled automatically.
   * Instead, draw one frame of your canvas during the override.
   */
  protected draw() {
    // Override this method to draw on the canvas
  }
  /**
   * Initiates the animation loop for the canvas.
   * This method clears the canvas, calls the draw method to draw one frame,
   * and schedules the next frame using requestAnimationFrame().
   * You can override the draw method to customize drawing behavior.
   * Make sure to call this method after binding the canvas context.
   * @example
   * const bg = new CanvasBG(".bg-canvas")
   * .use(new StarField(null, { velocity: 0.001, points: 150 })) //
   * .use(new MouseTracker())
   * .use(new Constellation());
   * bg.animate();
   * @remarks Don't override this method; it is used internally to bind the context.
   */
  public animate() {
    if (!this.ctx) throw new Error("Canvas context not initialized");
    const size = this.store.size as { width: number; height: number };
    this.ctx.clearRect(0, 0, size.width, size.height);
    this.callAnimationCallbacks();
    requestAnimationFrame(() => this.animate());
  }

  /**
   * Associates the current CanvasBG instance with another CanvasBG instance.
   * This method binds the current instance with the provided `canvasbg` instance,
   * allowing the current instance to inherit properties and functionality
   * from the provided instance.
   * 
   * (see {@link animate}() method for a complete example) 
   * @param canvasbg The CanvasBG instance to be associated with.
   * @returns The current CanvasBG instance after association.
   * @remarks Don't override this method; it is used internally to bind the context.
   */
  public use(canvasbg: ChildCanvasBG) {
    canvasbg.bindContext(this);
    return this;
  }
}
