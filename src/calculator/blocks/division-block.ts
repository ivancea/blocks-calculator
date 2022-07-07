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
  { label: "Numerator", type: new Set([CalculatorValueType.Number]) },
  { label: "Denominator", type: new Set([CalculatorValueType.Number]) },
];
const OUTPUT_TYPES: CalculatorOutputType = [
  { label: "Result", type: CalculatorValueType.Number },
  { label: "Integer result", type: CalculatorValueType.Number },
  { label: "Integer remainder", type: CalculatorValueType.Number },
];

export class DivisionBlock extends Block<[number, number, number]> {
  constructor(position: Position) {
    super("Division", INPUT_TYPES, OUTPUT_TYPES, position);
  }

  public computeOutputs(program: Program, context: ExecutionContext): void {
    const numerator = program
      .getConnectionsByOutput(this, 0)[0]
      .getValue(context);
    const denominator = program
      .getConnectionsByOutput(this, 1)[0]
      .getValue(context);

    if (typeof numerator !== "number") {
      throw new InvalidInputValue(this, 0, numerator);
    }
    if (typeof denominator !== "number") {
      throw new InvalidInputValue(this, 1, numerator);
    }

    const result = numerator / denominator;
    const integerResult = Math.floor(result);
    const integerRemainder = Math.floor(numerator % denominator);

    this.cachedOutputValues = [result, integerResult, integerRemainder];
  }
}
