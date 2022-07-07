import { Block } from "./blocks/block";

export class InvalidInputValue extends Error {
  constructor(block: Block, index: number, value: unknown) {
    super(
      `Invalid input value ${String(value)} for block ${String(
        block.id
      )}, input ${index}`
    );
  }
}
