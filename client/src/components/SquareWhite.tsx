// src/components/SquareWhite.tsx
import React from 'react';

const SquareWhite: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ backgroundColor: '#f0d9b5', width: '100%', height: '100%' }}>
      {children}
    </div>
  );
};

export default SquareWhite;
