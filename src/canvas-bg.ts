import { CanvasSelector, ChildCanvasBG, Layer, LayerConfig, NotNullCanvasSelector } from "./types";

/**
 * Constructs a new CanvasBG instance.
 
 * @description The CanvasBG class is a base class for creating canvas backgrounds.
 * It provides a simple API for creating and managing canvas backgrounds.
 * The class can be extended to create custom canvas backgrounds.
 * @remarks CanvasBG instances can be chained together to create complex backgrounds.
 */
export class CanvasBG<Config = Record<string, unknown>> {
  /**
   * Gets the default alias for the CanvasBG class.
   */
  public readonly defaultAlias: string = "";

  private zIndexCounter = 0;
  protected canvas?: HTMLCanvasElement;
  protected ctx?: CanvasRenderingContext2D;

  protected _layers: Record<string, Layer> = {
    __main: { instance: this, config: { as: "__main", zIndex: 0 } },
  };

  /**
   * Gets the layers associated with the current CanvasBG instance.
   * The layers are stored as key-value pairs, where the key is the layer name
   * and the value is the associated CanvasBG instance.
   * the __main key is reserved for the main CanvasBG instance.
   * zIndex is used to sort the layers.
   *
   * @example
   * ```typescript
   * const bg = new CanvasBG(".bg-canvas")
   * .use(new StarField(null, { speed: { x: 0, y: 0, z: 0.001 }, points: 150 }))
   * .use(new MouseTracker(), { as: "mousetracker", zIndex:100}) // associate with a key
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
   *   .use(starField, { as: "starfield" })
   *   .use(mouseTracker, { as: "mousetracker" });
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
    this.bindContext(canvas, { as: "__main", zIndex: 0 });
  }

  private nextPossibleAlias(key?: string) {
    if (!key) return;
    let i = 1;
    let newKey = key;
    while (this.layers[newKey]) {
      newKey = `${key}${++i}`;
    }
    return newKey;
  }

  private bindContext(host: NotNullCanvasSelector, config: { as?: string; zIndex: number }) {
    if (typeof host === "string") {
      this.canvas = document.querySelector(host) as HTMLCanvasElement;
    } else if (host instanceof HTMLCanvasElement) {
      this.canvas = host;
    } else if (host instanceof CanvasBG) {
      if (this.layers.__main.instance !== this) {
        throw new Error("CanvasBG instance can only be associated with one parent");
      }
      this.canvas = host.canvas as HTMLCanvasElement;
      config = config || {};
      const className = this.constructor.name.toLowerCase();

      config.as =
        this.nextPossibleAlias(config.as) ||
        this.nextPossibleAlias(this.defaultAlias) ||
        this.nextPossibleAlias(className) ||
        className;

      this._size = host.size;
      delete this._layers.main;
      const { as, ..._config } = config;
      Object.assign(host.layers, {
        ...host.layers,
        [as]: { instance: this, config: _config },
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
    Object.values(this.layers)
      .sort((a, b) => a.config.zIndex - b.config.zIndex)
      .forEach((layer) => {
        layer.instance.draw?.();
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
   * .use(new StarField(null, { speed: { x: 0, y: 0, z: 0.001 }, points: 150 }))
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
  public use(canvasbg: ChildCanvasBG, config?: Partial<LayerConfig>) {
    const zIndex = config?.zIndex || this.zIndexCounter++;
    const as = config?.as;

    canvasbg.bindContext(this, { as, zIndex });
    return this;
  }


  /**
   * Gets the associated layer instance by name.
   * @param selector The layer name or ChildCanvasBG reference.
   * @returns The associated layer instance.
   */
  protected getLayerInstance(selector: ChildCanvasBG | string) {
    if (typeof selector === "string") {
      return this.layers[selector].instance;
    } else {
      return selector;
    }
  }
}
