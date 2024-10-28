// src/components/GameRoom.tsx
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // URL do seu servidor

const GameRoom: React.FC = () => {
  const [players, setPlayers] = useState<string[]>([]);
  const [choice, setChoice] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    socket.emit('joinRoom', { roomId: 'room1' });

    socket.on('playersUpdate', (players: string[]) => {
      setPlayers(players);
    });

    socket.on('gameResult', (result: string) => {
      setResult(result);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleChoice = (choice: string) => {
    setChoice(choice);
    socket.emit('makeChoice', { choice });
  };

  const handleRetry = () => {
    setChoice(null);
    setResult(null);
  };

  return (
    <div>
      <h2>Players in Room: {players.join(', ')}</h2>
      {players.length < 2 ? (
        <p>Aguardando o segundo jogador...</p>
      ) : choice ? (
        <p>Você escolheu: {choice}</p>
      ) : (
        <div>
          <button onClick={() => handleChoice('rock')}>Pedra</button>
          <button onClick={() => handleChoice('paper')}>Papel</button>
          <button onClick={() => handleChoice('scissors')}>Tesoura</button>
        </div>
      )}
      {result && (
        <div>
          <h3>Resultado: {result}</h3>
          <button onClick={handleRetry}>Tentar Novamente</button>
        </div>
      )}
    </div>
  );
};

export default GameRoom;
