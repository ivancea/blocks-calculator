import isNil from "lodash/isNil";
import { DrawingContext } from "../drawing/drawing-context";
import { Position } from "../drawing/position";
import { Program } from "../program";
import { ExecutionContext } from "./execution-context";

export type InputTypes<T = string> = {
  label: string;
  type: Set<T>;
  multiple?: boolean;
}[];

export type OutputTypes<T = string> = {
  label: string;
  type: T;
}[];

export abstract class Block<Outputs extends unknown[] = unknown[]> {
  private program?: Program;
  public id?: number;
  public readonly name: string;

  /**
   * Input types. If it is a Set, it's a multi-input accepting the Set types.
   */
  public readonly inputTypes: InputTypes;
  public readonly outputTypes: OutputTypes;

  protected cachedExecutionId?: number;
  protected cachedOutputValues?: Outputs;

  public position: Position;

  constructor(
    name: string,
    inputTypes: InputTypes,
    outputTypes: OutputTypes,
    position: Position
  ) {
    this.name = name;
    this.inputTypes = inputTypes;
    this.outputTypes = outputTypes;
    this.position = position;
  }

  public setProgram(program: Program): void {
    this.program = program;
  }

  public getOutput(index: number, context: ExecutionContext): Outputs[number] {
    if (this.cachedExecutionId !== context.id) {
      if (isNil(this.program)) {
        throw new Error("Block is not part of a program");
      }

      if (context.visitedBlocks.has(this)) {
        throw new Error(
          `Circular dependency detected in block ${String(this.id)}`
        );
      }

      context.visitedBlocks.add(this);

      this.computeOutputs(this.program, context);

      this.cachedExecutionId = context.id;
    }

    const value = this.cachedOutputValues?.[index];

    if (isNil(value)) {
      throw new Error(
        `Output ${index} is not defined for block ${String(
          this.id
        )} in context ${context.id}`
      );
    }

    return value;
  }

  public abstract computeOutputs(
    program: Program,
    context: ExecutionContext
  ): void;

  public draw(
    drawingContext: DrawingContext,
    context?: ExecutionContext
  ): void {
    const [totalWidth, totalHeight] = this.getBlockSize();

    // Block
    drawingContext.drawRectangle(
      this.position,
      totalWidth,
      totalHeight,
      drawingContext.palette.blockBorder,
      drawingContext.palette.blockBackground
    );

    // Name
    drawingContext.drawText(
      this.position.add(5, 15),
      this.name,
      drawingContext.palette.blockText
    );

    const nameSeparatorHeight = 20;

    // Name separator
    drawingContext.drawLine(
      this.position.add(0, nameSeparatorHeight),
      this.position.add(totalWidth, nameSeparatorHeight),
      drawingContext.palette.blockBorder
    );

    // Inputs-Outputs separator
    drawingContext.drawLine(
      this.position.add(totalWidth / 2, nameSeparatorHeight),
      this.position.add(totalWidth / 2, totalHeight),
      drawingContext.palette.blockBorder
    );

    // Inputs
    this.inputTypes.forEach((inputType, index) => {
      drawingContext.drawText(
        this.position.add(5, nameSeparatorHeight + 15 + index * 20),
        inputType.label,
        drawingContext.palette.blockText,
        totalWidth / 2 - 10
      );

      drawingContext.drawCircle(
        this.getInputPosition(index),
        5,
        drawingContext.palette.connection,
        drawingContext.palette.connection
      );
    });

    // Outputs
    this.outputTypes.forEach((outputType, index) => {
      drawingContext.drawText(
        this.position.add(
          totalWidth / 2 + 5,
          nameSeparatorHeight + 15 + index * 20
        ),
        outputType.label,
        drawingContext.palette.blockText,
        totalWidth / 2 - 10
      );

      drawingContext.drawCircle(
        this.position.add(
          totalWidth + 10,
          nameSeparatorHeight + 10 + index * 20
        ),
        5,
        drawingContext.palette.connection,
        drawingContext.palette.connection
      );
    });

    // Output values
    if (!isNil(context)) {
      this.outputTypes.forEach((outputType, index) => {
        const value = this.getOutput(index, context);

        drawingContext.drawText(
          this.getOutputPosition(index).add(10, -5),
          String(value),
          drawingContext.palette.blockText
        );
      });
    }
  }

  public getBlockSize(): [number, number] {
    const totalWidth = 150;
    const totalHeight =
      20 + Math.max(this.inputTypes.length, this.outputTypes.length) * 20;

    return [totalWidth, totalHeight];
  }

  public getInputPosition(index: number): Position {
    return this.position.add(-10, 30 + index * 20);
  }

  public getOutputPosition(index: number): Position {
    return this.position.add(this.getBlockSize()[0] + 10, 30 + index * 20);
  }
}
