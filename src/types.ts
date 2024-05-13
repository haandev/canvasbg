import { Delaunay } from "d3-delaunay";
import { CanvasBG } from "./canvas-bg";

/**
 * Represents a canvas or a subclass of CanvasBG.
 */
export type ChildCanvasBG<T extends CanvasBG<any> = CanvasBG<any>> = T;

/**
 * Represents a layer for the CanvasBG instance.
 */
export type Layer = { config: Omit<LayerConfig, "as">; instance: ChildCanvasBG };

/**
 * Represents a configuration object for a CanvasBG layer.
 */
export type LayerConfig = { as: string; zIndex: number };

/**
 * Represents a valid canvas selector.
 */
export type CanvasSelector = NotNullCanvasSelector | null | undefined;

/**
 * Represents a canvas selector that is not null or undefined.
 */
export type NotNullCanvasSelector = HTMLCanvasElement | string | ChildCanvasBG;

/**
 * Represents a 2D point. Used in  StarField (see: {@link StarField})
 */
export type Particle = {
  coordinate: Delaunay.Point;
  scale: number;
};
