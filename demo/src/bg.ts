import {
  CanvasBG,
  StarField,
  MouseTracker,
  Constellation,
} from "@haandev/canvasbg";
//} from "../../src";

const bg = new CanvasBG(".bg-canvas")
  .use(new MouseTracker())
  .use(new StarField(null, { speed: { x: 0, y: 1, z: 0 }, feed: "top", points: 150 }), { as: "starfield" })
  .use(new StarField(null, { speed: { x: 0, y: 0.5, z: 0 }, points: 500, alpha: 0.5, feed: "top" }), { as: "sf" })
  .use(new Constellation(null, { starfield: "starfield", mousetracker: "mousetracker" }));

bg.animate();
