export class Position {
  public readonly x: number;
  public readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public add(x: number, y: number): Position {
    return new Position(this.x + x, this.y + y);
  }
}
