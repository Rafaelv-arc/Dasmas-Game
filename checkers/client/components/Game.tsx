// src/components/Game.tsx

import React, { useState } from 'react';
import Board from './Board';
import { PlayerColor } from '../types';

const Game: React.FC = () => {
  const [currentPlayer, setCurrentPlayer] = useState<PlayerColor>('white');

  const switchPlayer = () => setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');

  return (
    <div className="game">
      <h2>Jogo de Damas - Jogador Atual: {currentPlayer}</h2>
      <Board currentPlayer={currentPlayer} onTurnEnd={switchPlayer} />
    </div>
  );
};

export default Game;
