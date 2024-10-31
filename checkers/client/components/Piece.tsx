// src/components/Piece.tsx

import React from 'react';
import { PlayerColor } from '../types';

interface PieceProps {
  color: PlayerColor;
}

const Piece: React.FC<PieceProps> = ({ color }) => (
  <div className={`piece ${color}`}></div>
);

export default Piece;
