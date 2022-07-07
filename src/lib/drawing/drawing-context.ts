import { Palette } from "./palette";
import { Position } from "./position";

export class DrawingContext {
  public readonly context: CanvasRenderingContext2D;
  public readonly palette: Palette;

  constructor(context: CanvasRenderingContext2D, palette: Palette) {
    this.context = context;
    this.palette = palette;
  }

  public clear(): void {
    this.context.fillStyle = this.palette.background;
    this.context.rect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height
    );
    this.context.fill();
  }

  public drawRectangle(
    position: Position,
    width: number,
    height: number,
    borderColor: string,
    fillColor = "transparent"
  ): void {
    this.context.beginPath();
    this.context.fillStyle = fillColor;
    this.context.strokeStyle = borderColor;
    this.context.lineWidth = 2;
    this.context.rect(position.x, position.y, width, height);
    this.context.fill();
    this.context.stroke();
  }

  public drawCircle(
    position: Position,
    radius: number,
    borderColor: string,
    fillColor = "transparent"
  ): void {
    this.context.beginPath();
    this.context.fillStyle = fillColor;
    this.context.strokeStyle = borderColor;
    this.context.lineWidth = 2;
    this.context.arc(position.x, position.y, radius, 0, 2 * Math.PI);
    this.context.fill();
    this.context.stroke();
  }

  public drawLine(
    positionA: Position,
    positionB: Position,
    color: string
  ): void {
    this.context.lineWidth = 2;
    this.context.strokeStyle = color;
    this.context.beginPath();
    this.context.moveTo(positionA.x, positionA.y);
    this.context.lineTo(positionB.x, positionB.y);
    this.context.stroke();
  }

  public drawText(
    position: Position,
    text: string,
    color: string,
    maxWidth?: number
  ): void {
    this.context.font = "10px Arial";
    this.context.fillStyle = color;
    this.context.beginPath();
    this.context.fillText(text, position.x, position.y, maxWidth);
  }
}
