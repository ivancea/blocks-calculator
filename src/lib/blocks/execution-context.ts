import { Block } from "./block";

export class ExecutionContext {
  public readonly id: number;
  public readonly visitedBlocks: Set<Block> = new Set<Block>();

  constructor(id: number) {
    this.id = id;
  }
}
