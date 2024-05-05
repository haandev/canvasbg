import { CanvasBG, StarField, MouseTracker, Constellation } from "canvasbg";

const bg = new CanvasBG(".bg-canvas")
  .use(new StarField(null, { velocity: 0.001, points: 150 })) //
  .use(new MouseTracker())
  .use(new Constellation());

bg.animate();

console.log(bg);
