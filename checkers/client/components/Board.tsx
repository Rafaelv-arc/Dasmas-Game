// src/components/Board.tsx

import React, { useState, useContext, useEffect } from 'react';
import Square from './Square';
import Piece from './Piece';
import WebSocketContext from '../context/WebSocketContext';
import { applyMove, isMoveValid } from '../utils/gameLogic';
import { Position, PlayerColor, Move } from '../types';

interface BoardProps {
  currentPlayer: PlayerColor;
  onTurnEnd: () => void;
}

// Função para inicializar o tabuleiro com peças nas posições iniciais
function createInitialBoard(): string[][] {
  const board = Array.from({ length: 8 }, () => Array(8).fill(''));
  for (let row = 0; row < 3; row++) {
    for (let col = (row + 1) % 2; col < 8; col += 2) {
      board[row][col] = 'black';
    }
  }
  for (let row = 5; row < 8; row++) {
    for (let col = (row + 1) % 2; col < 8; col += 2) {
      board[row][col] = 'white';
    }
  }
  return board;
}

const Board: React.FC<BoardProps> = ({ currentPlayer, onTurnEnd }) => {
  const [board, setBoard] = useState<string[][]>(createInitialBoard());
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
  const socket = useContext(WebSocketContext);

  const handleSquareClick = (row: number, col: number) => {
    if (selectedPiece) {
      const move: Move = { from: selectedPiece, to: { row, col } };
      if (isMoveValid(selectedPiece, { row, col }, board, currentPlayer)) {
        const newBoard = applyMove(move, board);
        setBoard(newBoard);
        setSelectedPiece(null);
        onTurnEnd();

        socket?.send(JSON.stringify(move));  // Enviar movimento para o servidor
      } else {
        setSelectedPiece(null);
      }
    } else if (board[row][col] === currentPlayer) {
      setSelectedPiece({ row, col });
    }
  };

  // Configurar o WebSocket para ouvir movimentos do oponente
  useEffect(() => {
    if (!socket) return;

    const handleMove = (event: MessageEvent) => {
      const move: Move = JSON.parse(event.data);
      const newBoard = applyMove(move, board);
      setBoard(newBoard);
      onTurnEnd();
    };

    socket.addEventListener('message', handleMove);

    // Remover o listener quando o componente for desmontado
    return () => {
      socket.removeEventListener('message', handleMove);
    };
  }, [socket, board, onTurnEnd]);

  return (
    <div className="board">
      {board.map((row, rowIndex) =>
        row.map((square, colIndex) => (
          <Square
            key={`${rowIndex}-${colIndex}`}
            black={(rowIndex + colIndex) % 2 === 1}
            onClick={() => handleSquareClick(rowIndex, colIndex)}
          >
            {square && <Piece color={square as PlayerColor} />}
          </Square>
        ))
      )}
    </div>
  );
};

export default Board;
