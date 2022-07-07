import { Block } from "../../lib/blocks/block";
import { ExecutionContext } from "../../lib/blocks/execution-context";
import { Position } from "../../lib/drawing/position";
import { InvalidInputValue } from "../../lib/exceptions";
import { Program } from "../../lib/program";
import {
  CalculatorInputType,
  CalculatorOutputType,
  CalculatorValueType,
} from "../value-type";

const INPUT_TYPES: CalculatorInputType = [
  {
    label: "Inputs",
    type: new Set([CalculatorValueType.Number]),
    multiple: true,
  },
];
const OUTPUT_TYPES: CalculatorOutputType = [
  { label: "Max", type: CalculatorValueType.Number },
];

export class MaxBlock extends Block<[number]> {
  constructor(position: Position) {
    super("Max", INPUT_TYPES, OUTPUT_TYPES, position);
  }

  public computeOutputs(program: Program, context: ExecutionContext): void {
    const sum = program
      .getConnectionsByOutput(this, 0)
      .map((c, index) => {
        const value = c.getValue(context);

        if (typeof value !== "number") {
          throw new InvalidInputValue(this, index, value);
        }

        return value;
      })
      .reduce((a, b) => Math.max(a, b), -Infinity);

    this.cachedOutputValues = [sum];
  }
}
