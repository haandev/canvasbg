# CanvasBG

A powerful TypeScript library for creating interactive canvas backgrounds.

## Features

- **CanvasBG Base Class**: Extendable base class for creating canvas backgrounds.
- **StarField Class**: Generate a star field background with customizable options.
- **Constellation Class**: Display constellations on the canvas based on provided data.
- **MouseTracker Class**: Track the mouse position on the canvas.

## Installation

```bash
npm install canvas-bg
```

## Usage

```typescript
import { CanvasBG, StarField, Constellation } from "canvas-bg";

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

For detailed usage instructions and API reference, please refer to the Documentation.

## Contributing

Contributions are welcome! Please read the Contribution Guide for details.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
