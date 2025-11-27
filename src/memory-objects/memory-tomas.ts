import type { MemoryObjectRegistrar } from "./types";

const tomasMemory: MemoryObjectRegistrar = (addMemoryObject) => {
  addMemoryObject({
    name: "Objeto de Tomás",
    modelPath: "/models/memory-objects/memory-tomas.glb",
    position: [-2, 1.5, -9],   // SAFE AREA – not touching Parthenon
    rotation: [0, 0, 0],
    scale: 0.002,
  });
};

export default tomasMemory;


