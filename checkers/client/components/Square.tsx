// src/components/Square.tsx

import React from 'react';

interface SquareProps {
  black: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}

const Square: React.FC<SquareProps> = ({ black, onClick, children }) => (
  <div className={`square ${black ? 'black' : 'white'}`} onClick={onClick}>
    {children}
  </div>
);

export default Square;
