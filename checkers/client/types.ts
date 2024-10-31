// src/types.ts

export type PlayerColor = 'black' | 'white';

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  from: Position;
  to: Position;
}
