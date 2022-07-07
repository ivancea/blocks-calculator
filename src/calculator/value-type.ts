import { InputTypes, OutputTypes } from "../lib/blocks/block";

export enum CalculatorValueType {
  Number = "number",
}

export type CalculatorInputType = InputTypes<CalculatorValueType>;
export type CalculatorOutputType = OutputTypes<CalculatorValueType>;
