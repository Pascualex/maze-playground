export class Pair {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export const Directions: Pair[] = [
  new Pair(0, -1),
  new Pair(1, 0),
  new Pair(0, 1),
  new Pair(-1, 0)
];