// src/components/SquareBlack.tsx
import React from 'react';
import '../styles/styles.css'; // Importar CSS

const SquareBlack: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <div className="square-black">{children}</div>;
};

export default SquareBlack;
