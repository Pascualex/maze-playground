import { Pair } from './Pair';

export enum Direction {
  Up,
  Right,
  Down,
  Left,
  None
}

export function getAllDirections(): Direction[] {
  return [
    Direction.Up,
    Direction.Right,
    Direction.Down,
    Direction.Left
  ];
}

export function getDirectionValue(direction: Direction): Pair {
  if (direction == Direction.Up) return new Pair(0, -1);
  else if (direction == Direction.Right) return new Pair(1, 0);
  else if (direction == Direction.Down) return new Pair(0, 1);
  else if (direction == Direction.Left) return new Pair(-1, 0);
  else return new Pair(0, 0);
}

export function invertDirection(direction: Direction): Direction {
  if (direction == Direction.Up) return Direction.Down
  else if (direction == Direction.Right) return Direction.Left;
  else if (direction == Direction.Down) return Direction.Up;
  else if (direction == Direction.Left) return Direction.Right;
  else return Direction.None;
}