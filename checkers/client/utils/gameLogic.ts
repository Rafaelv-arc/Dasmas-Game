// src/utils/gameLogic.ts

import { Position, Move, PlayerColor } from '../types';

export function isMoveValid(from: Position, to: Position, board: string[][], currentPlayer: PlayerColor): boolean {
  // Adicione a lógica de validação do movimento, verificando regras específicas
  return true;
}

export function applyMove(move: Move, board: string[][]): string[][] {
  const newBoard = board.map(row => [...row]);
  const { from, to } = move;
  newBoard[to.row][to.col] = newBoard[from.row][from.col];
  newBoard[from.row][from.col] = '';
  return newBoard;
}
