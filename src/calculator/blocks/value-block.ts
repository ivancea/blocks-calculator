import { Block } from "../../lib/blocks/block";
import { Position } from "../../lib/drawing/position";
import {
  CalculatorInputType,
  CalculatorOutputType,
  CalculatorValueType,
} from "../value-type";

const INPUT_TYPES: CalculatorInputType = [];
const OUTPUT_TYPES: CalculatorOutputType = [
  { label: "Value", type: CalculatorValueType.Number },
];

export class ValueBlock extends Block<[number]> {
  public readonly value: number;

  constructor(value: number, position: Position) {
    super(`Value: ${String(value)}`, INPUT_TYPES, OUTPUT_TYPES, position);
    this.value = value;
  }

  public computeOutputs(): void {
    this.cachedOutputValues = [this.value];
  }
}
