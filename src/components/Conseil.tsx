// src/components/Conseil.tsx
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'; // Importando Socket
import '../styles/styles.css';
import SquareBlack from './SquareBlack';
import SquareWhite from './SquareWhite';
import PartieBlack from './PartieBlack';
import PartieWhite from './PartieWhite';

type Position = [number, number];

interface Players {
  player1: string;
  player2: string;
}

const Conseil: React.FC = () => {
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
  const [availableMoves, setAvailableMoves] = useState<Position[]>([]);
  const [pieces, setPieces] = useState<{ black: Position[]; white: Position[] }>({
    black: [
      [0, 1], [0, 3], [0, 5], [0, 7],
      [1, 0], [1, 2], [1, 4], [1, 6],
      [2, 1], [2, 3], [2, 5], [2, 7]
    ],
    white: [
      [5, 0], [5, 2], [5, 4], [5, 6],
      [6, 1], [6, 3], [6, 5], [6, 7],
      [7, 0], [7, 2], [7, 4], [7, 6]
    ]
  });
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null); // Ajuste aqui
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const newSocket = io('http://localhost:3000'); // URL do servidor
    setSocket(newSocket);

    // Ouvir eventos do servidor
    newSocket.on('playersUpdate', (players: Players) => {
      console.log('Jogadores:', players);
    });

    newSocket.on('gameResult', (result: string) => {
      setMessage(`Resultado do jogo: ${result}`);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  function getAvailableMoves(position: Position): Position[] {
    const [row, col] = position;

    const potentialMoves: Position[] = [
      [row - 1, col - 1],
      [row - 1, col + 1],
      [row + 1, col - 1],
      [row + 1, col + 1]
    ];

    return potentialMoves.filter(([r, c]) =>
      r >= 0 && r < 8 &&
      c >= 0 && c < 8 &&
      (r + c) % 2 === 1 &&
      !isSquareOccupied([r, c])
    );
  }

  function isSquareOccupied(position: Position): boolean {
    return (
      pieces.black.some(([r, c]) => r === position[0] && c === position[1]) ||
      pieces.white.some(([r, c]) => r === position[0] && c === position[1])
    );
  }

  const handleClick = (row: number, col: number) => {
    if (selectedPiece) {
      const isMoveValid = availableMoves.some(
        ([r, c]) => r === row && c === col
      );

      if (isMoveValid) {
        const isWhitePiece = pieces.white.some(
          ([r, c]) => r === selectedPiece[0] && c === selectedPiece[1]
        );

        // Atualizar posição da peça no estado
        setPieces((prev) => ({
          ...prev,
          white: isWhitePiece
            ? prev.white.map((pos) =>
                pos[0] === selectedPiece[0] && pos[1] === selectedPiece[1]
                  ? [row, col]
                  : pos
              )
            : prev.white,
          black: !isWhitePiece
            ? prev.black.map((pos) =>
                pos[0] === selectedPiece[0] && pos[1] === selectedPiece[1]
                  ? [row, col]
                  : pos
              )
            : prev.black
        }));

        // Resetar peça selecionada
        setSelectedPiece(null);
        setAvailableMoves([]);
      }
    } else if (isSquareOccupied([row, col])) {
      const isWhitePiece = pieces.white.some(([r, c]) => r === row && c === col);

      if (isWhitePiece) {
        setSelectedPiece([row, col]);
        setAvailableMoves(getAvailableMoves([row, col]));
      } else {
        alert("Não é a sua vez ou você selecionou uma peça inválida!");
      }
    }
  };

  const squares = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const isBlackSquare = (row + col) % 2 === 1;
      const hasBlackPiece = pieces.black.some(([r, c]) => r === row && c === col);
      const hasWhitePiece = pieces.white.some(([r, c]) => r === row && c === col);

      const piece = hasBlackPiece ? <PartieBlack /> : hasWhitePiece ? <PartieWhite /> : null;
      const isSelected = selectedPiece && selectedPiece[0] === row && selectedPiece[1] === col;
      const isAvailableMove = availableMoves.some(([r, c]) => r === row && c === col);

      const square = isBlackSquare ? (
        <button
          key={`${row}-${col}`}
          onClick={() => handleClick(row, col)}
          style={{
            border: isSelected ? '2px solid green' : isAvailableMove ? '2px dashed blue' : 'none',
            padding: '10px',
            cursor: 'pointer'
          }}
        >
          <SquareBlack>{piece}</SquareBlack>
        </button>
      ) : (
        <button
          key={`${row}-${col}`}
          onClick={() => handleClick(row, col)}
          style={{
            border: isSelected ? '2px solid green' : 'none',
            padding: '10px',
            cursor: 'pointer'
          }}
        >
          <SquareWhite>{piece}</SquareWhite> {/* Passando o piece para SquareWhite */}
        </button>
      );
      squares.push(square);
    }
  }

  return (
    <div>
      <div className="conseil">{squares}</div>
      <div className="message">{message}</div>
    </div>
  );
};

export default Conseil;
