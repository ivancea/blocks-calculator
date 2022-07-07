import { Program } from "../program";
import { Block } from "./block";
import { ExecutionContext } from "./execution-context";

export class Connection {
  public program?: Program;

  public readonly inputBlock: Block;
  public readonly inputIndex: number;

  public readonly outputBlock: Block;
  public readonly outputIndex: number;

  constructor(
    inputBlock: Block,
    inputIndex: number,
    outputBlock: Block,
    outputIndex: number
  ) {
    this.inputBlock = inputBlock;
    this.inputIndex = inputIndex;
    this.outputBlock = outputBlock;
    this.outputIndex = outputIndex;
  }

  public getValue(context: ExecutionContext): unknown {
    return this.inputBlock.getOutput(this.inputIndex, context);
  }
}
