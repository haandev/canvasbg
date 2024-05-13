# CanvasBG 0.0.5

A powerful TypeScript library for creating interactive canvas backgrounds.

## Features

- **CanvasBG Base Class**: Extendable base class for creating canvas backgrounds.
- **StarField Class**: Generate a star field background with customizable options.
- **Constellation Class**: Display constellations on the canvas based on provided data.
- **MouseTracker Class**: Track the mouse position on the canvas.

## Installation

```bash
npm install @haandev/canvasbg
```

## Usage

```typescript
import { CanvasBG, StarField, Constellation } from "@haandev/canvasbg";

// Create a canvas element or select an existing one
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

// Create a CanvasBG instance and set up a star field background
const bg = new CanvasBG(canvas);
const starField = new StarField();
bg.use(starField);

// Display constellations on the star field background
const constellation = new Constellation();
bg.use(constellation);

// Start the animation loop
bg.animate();
```

## Documentation

For detailed usage instructions and API reference, please refer to the Documentation. https://haandev.github.io/canvasbg/

## Examples
For examples on how to use CanvasBG, please refer to the Examples. https://canvasbg.vercel.app/

## Contributing

Contributions are welcome! Please read the Contribution Guide for details.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
