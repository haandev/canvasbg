import { CanvasSelector, ChildCanvasBG, NotNullCanvasSelector } from "./types";

/**
 * Constructs a new CanvasBG instance.
 
 * @description The CanvasBG class is a base class for creating canvas backgrounds.
 * It provides a simple API for creating and managing canvas backgrounds.
 * The class can be extended to create custom canvas backgrounds.
 * @remarks CanvasBG instances can be chained together to create complex backgrounds.
 */
export class CanvasBG<Config = Record<string, unknown>> {
  protected canvas?: HTMLCanvasElement;
  protected ctx?: CanvasRenderingContext2D;

  protected _layers: Record<string, ChildCanvasBG> = {
    __main: this,
  };

  /**
   * Gets the layers associated with the current CanvasBG instance.
   * The layers are stored as key-value pairs, where the key is the layer name
   * and the value is the associated CanvasBG instance.
   * the __main key is reserved for the main CanvasBG instance.
   *
   * @example
   * ```typescript
   * const bg = new CanvasBG(".bg-canvas")
   * .use(new StarField(null, { velocity: 0.001, points: 150 }))
   * .use(new MouseTracker(), "mousetracker") // associate with a key
   * .use(new Constellation()); // associate without a key (default key is the class name)
   * console.log(bg.layers.__main === bg); // true
   * ```
   * layers is always points same address on all siblings
   * @example
   * ```typescript
   * const mainCanvas = new CanvasBG();
   * const starField = new StarField(mainCanvas);
   * const mouseTracker = new MouseTracker(mainCanvas);
   * mainCanvas
   *   .use(starField, "starfield")
   *   .use(mouseTracker, "mousetracker");
   * console.log(mainCanvas.layers === starField.layers); // true
   *
   * @returns The layers associated with the current CanvasBG instance.
   * @remarks Do not modify this property directly; use the `use` method to associate layers.
   */
  public get layers() {
    return this._layers;
  }

  protected _size = { width: 0, height: 0 };
  public get size() {
    return this._size;
  }

  protected config: Config = {} as Config;

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
  constructor(canvas?: CanvasSelector, config?: Config) {
    if (config) this.config = config;
    if (!canvas) return;
    this.bindContext(canvas);
  }

  private bindContext(host: NotNullCanvasSelector, key?: string) {
    if (typeof host === "string") {
      this.canvas = document.querySelector(host) as HTMLCanvasElement;
    } else if (host instanceof HTMLCanvasElement) {
      this.canvas = host;
    } else if (host instanceof CanvasBG) {
      if (this.layers.__main !== this) {
        throw new Error("CanvasBG instance can only be associated with one parent");
      }
      this.canvas = host.canvas as HTMLCanvasElement;
      key = key || this.constructor.name.toLowerCase();
      this._size = host.size;
      delete this._layers.main;
      Object.assign(host.layers, {
        ...host.layers,
        [key]: this,
        ...this.layers,
      });
      this._layers = host.layers;
    } else {
      throw new Error("Invalid canvas selector");
    }
    this.init();

    if (host) {
      this.size.width = this.canvas.clientWidth;
      this.size.height = this.canvas.clientHeight;
      this.initializeCanvas();
      this.initResizeListener();
    }
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
  }
  private initResizeListener() {
    window.addEventListener("resize", () => {
      if (!this.canvas) return;
      this.size.width = this.canvas.clientWidth;
      this.size.height = this.canvas.clientHeight;
      this.initializeCanvas();
    });
  }
  private callAnimationCallbacks() {
    Object.values(this.layers).forEach((layer) => {
      layer.draw?.();
    });
  }
  private initializeCanvas() {
    if (!this.canvas) throw new Error("Canvas not initialized");
    this.canvas.width = this.size.width;
    this.canvas.height = this.size.height;
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
    this.ctx.clearRect(0, 0, this.size.width, this.size.height);
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
  public use(canvasbg: ChildCanvasBG, key?: string) {
    canvasbg.bindContext(this, key);
    return this;
  }
}
