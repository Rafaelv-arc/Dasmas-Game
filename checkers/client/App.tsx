// src/App.tsx

import React from 'react';
import Game from './components/Game';
import { WebSocketProvider } from './context/WebSocketContext';
import './styles/App.css';

const App: React.FC = () => (
  <WebSocketProvider>
    <Game />
  </WebSocketProvider>
);

export default App;
