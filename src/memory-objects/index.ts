import type { MemoryObjectRegistrar } from "./types";
import tomasMemory from "./memory-tomas";
// Add new participant scripts here by importing and pushing to the array.
const registrars: MemoryObjectRegistrar[] = [
    tomasMemory,
];

export default registrars;
