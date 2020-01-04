import { Pair } from './Pair';

export enum Direction {
  None,
  Up,
  UpRight,
  Right,
  DownRight,
  Down,
  DownLeft,
  Left,
  UpLeft
}

export function getDirections(): Direction[] {
  return [
    Direction.Right,
    Direction.Left,
    Direction.Up,
    Direction.Down
  ];
}

export function getExtendedDirections(): Direction[] {
  return [
    Direction.Up,
    Direction.UpRight,
    Direction.Right,
    Direction.DownRight,
    Direction.Down,
    Direction.DownLeft,
    Direction.Left,
    Direction.UpLeft
  ];
}

export function getRandomizedDirections(): Direction[] {
  return shuffle([
    Direction.Up,
    Direction.Right,
    Direction.Down,
    Direction.Left
  ]);
}

export function getDirectionValue(direction: Direction): Pair {
  if (direction == Direction.Up) return new Pair(0, -1);
  else if (direction == Direction.UpRight) return new Pair(1, -1);
  else if (direction == Direction.Right) return new Pair(1, 0);
  else if (direction == Direction.DownRight) return new Pair(1, 1);
  else if (direction == Direction.Down) return new Pair(0, 1);
  else if (direction == Direction.DownLeft) return new Pair(-1, 1);
  else if (direction == Direction.Left) return new Pair(-1, 0);
  else if (direction == Direction.UpLeft) return new Pair(-1, -1);
  else return new Pair(0, 0);
}

export function invertDirection(direction: Direction): Direction {
  if (direction == Direction.Up) return Direction.Down
  else if (direction == Direction.UpRight) return Direction.DownLeft;
  else if (direction == Direction.Right) return Direction.Left;
  else if (direction == Direction.DownRight) return Direction.UpLeft;
  else if (direction == Direction.Down) return Direction.Up;
  else if (direction == Direction.DownLeft) return Direction.UpRight;
  else if (direction == Direction.Left) return Direction.Right;
  else if (direction == Direction.UpLeft) return Direction.DownRight;
  else return Direction.None;
}

function shuffle(array: Direction[]): Direction[] {
  for (let i: number = array.length - 1; i > 0; i--) {
      const j: number = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}