import type { MemoryObjectRegistrar } from "./types";

const stewartMemory: MemoryObjectRegistrar = (addMemoryObject) => {
  addMemoryObject({
    name: "Stewart – Shiba Inu",
    modelPath: "/models/memory-objects/shiba_stewart.glb",
    position: [0, 2.5, 0],
    rotation: [0, Math.PI / 6, 0],
    scale: 6,
  });
};

export default stewartMemory;

