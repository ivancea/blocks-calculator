import isNil from "lodash/isNil";
import { DivisionBlock } from "./calculator/blocks/division-block";
import { MaxBlock } from "./calculator/blocks/max-block";
import { SumBlock } from "./calculator/blocks/sum-block";
import { ValueBlock } from "./calculator/blocks/value-block";
import { darkPalette } from "./calculator/drawing/palettes/dark-palette";
import { showError, showInfo } from "./errors";
import { canvas } from "./html";
import { Connection } from "./lib/blocks/connection";
import { ExecutionContext } from "./lib/blocks/execution-context";
import { DrawingContext } from "./lib/drawing/drawing-context";
import { Position } from "./lib/drawing/position";
import { Program } from "./lib/program";

const program = new Program();

const aValueBlock = program.addBlock(new ValueBlock(50, new Position(50, 50)));
const bValueBlock = program.addBlock(new ValueBlock(15, new Position(50, 200)));
const sumBlock = program.addBlock(new SumBlock(new Position(400, 50)));
const divisionBlock = program.addBlock(
  new DivisionBlock(new Position(400, 200))
);
const maxBlock = program.addBlock(new MaxBlock(new Position(800, 100)));

program.addConnection(new Connection(aValueBlock, 0, sumBlock, 0));
program.addConnection(new Connection(bValueBlock, 0, sumBlock, 0));
program.addConnection(new Connection(aValueBlock, 0, divisionBlock, 0));
program.addConnection(new Connection(bValueBlock, 0, divisionBlock, 1));
program.addConnection(new Connection(sumBlock, 0, maxBlock, 0));
program.addConnection(new Connection(divisionBlock, 0, maxBlock, 0));

document.body.addEventListener("resize", draw);
draw();

function draw() {
  const executionContext = new ExecutionContext(1);

  const canvasContext = canvas.getContext("2d");

  if (isNil(canvasContext)) {
    showError("Canvas context is null");

    throw new Error("Canvas context is null");
  }

  const drawingContext = new DrawingContext(canvasContext, darkPalette);

  drawingContext.clear();

  for (const connection of program.connections) {
    drawingContext.drawLine(
      connection.inputBlock.getOutputPosition(connection.inputIndex),
      connection.outputBlock.getInputPosition(connection.outputIndex),
      drawingContext.palette.connection
    );
  }

  for (const block of program.blocks) {
    let text = `[${block.name}]`;

    block.outputTypes.forEach((outputType, index) => {
      text +=
        `\n - ${outputType.label}: ` +
        `${String(block.getOutput(index, executionContext))}`;
    });

    showInfo(text);

    block.draw(drawingContext, executionContext);
  }
}
