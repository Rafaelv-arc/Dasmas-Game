// server.js

const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });
const games = new Map(); // Armazena partidas com dois jogadores conectados

server.on('connection', (socket) => {
  let gameRoom = null;

  // Encontrar ou criar uma sala de jogo
  for (const [room, players] of games.entries()) {
    if (players.length < 2) {
      players.push(socket);
      gameRoom = room;
      break;
    }
  }

  if (!gameRoom) {
    gameRoom = `room-${games.size + 1}`;
    games.set(gameRoom, [socket]);
  }

  // Notificar o jogador que ele está esperando por um oponente
  if (games.get(gameRoom).length === 1) {
    socket.send(JSON.stringify({ type: 'info', message: 'Esperando oponente...' }));
  } else {
    // Notificar ambos os jogadores que a partida começou
    games.get(gameRoom).forEach(player => 
      player.send(JSON.stringify({ type: 'info', message: 'O jogo começou!' }))
    );
  }

  // Lidar com mensagens de movimento dos jogadores
  socket.on('message', (data) => {
    const move = JSON.parse(data);
    
    // Enviar o movimento para o oponente
    const players = games.get(gameRoom);
    players.forEach(player => {
      if (player !== socket) {
        player.send(JSON.stringify({ type: 'move', ...move }));
      }
    });
  });

  // Remover jogador da sala ao desconectar
  socket.on('close', () => {
    const players = games.get(gameRoom);
    const updatedPlayers = players.filter(player => player !== socket);

    if (updatedPlayers.length === 0) {
      games.delete(gameRoom); // Remove sala vazia
    } else {
      games.set(gameRoom, updatedPlayers);
    }
  });
});

console.log('Servidor WebSocket rodando na porta 8080');
