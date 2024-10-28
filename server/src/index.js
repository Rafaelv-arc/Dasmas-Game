const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const rooms = {}; // Objeto para armazenar salas e jogadores

io.on('connection', (socket) => {
  let currentRoomId = null;

  socket.on('joinRoom', ({ roomId }) => {
    if (!rooms[roomId]) {
      rooms[roomId] = { players: [], choices: {} }; // Cria uma nova sala se não existir
    }

    if (rooms[roomId].players.length < 2) {
      rooms[roomId].players.push(socket.id);
      currentRoomId = roomId;
      socket.join(roomId);
      io.to(roomId).emit('playersUpdate', rooms[roomId].players);

      if (rooms[roomId].players.length === 2) {
        io.to(roomId).emit('gameStart', 'Ambos os jogadores estão prontos!');
      }
    } else {
      socket.emit('roomFull', 'A sala está cheia.'); // Mensagem se a sala já tiver 2 jogadores
    }
  });

  socket.on('makeChoice', ({ choice }) => {
    if (currentRoomId && rooms[currentRoomId]) {
      rooms[currentRoomId].choices[socket.id] = choice;

      if (Object.keys(rooms[currentRoomId].choices).length === 2) {
        const result = determineWinner(rooms[currentRoomId].choices);
        io.to(currentRoomId).emit('gameResult', result);
        // Reiniciar escolhas para a próxima rodada
        rooms[currentRoomId].choices = {};
      }
    }
  });

  socket.on('disconnect', () => {
    if (currentRoomId && rooms[currentRoomId]) {
      // Remove o jogador da sala
      rooms[currentRoomId].players = rooms[currentRoomId].players.filter(id => id !== socket.id);
      io.to(currentRoomId).emit('playersUpdate', rooms[currentRoomId].players);
    }
  });
});

// Função para determinar o vencedor
function determineWinner(choices) {
  const [player1Choice, player2Choice] = Object.values(choices);

  if (player1Choice === player2Choice) {
    return 'Empate!';
  }

  if (
    (player1Choice === 'pedra' && player2Choice === 'tesoura') ||
    (player1Choice === 'papel' && player2Choice === 'pedra') ||
    (player1Choice === 'tesoura' && player2Choice === 'papel')
  ) {
    return 'Jogador 1 venceu!';
  } else {
    return 'Jogador 2 venceu!';
  }
}

// Defina uma rota para verificar se o servidor está funcionando
app.get('/', (req, res) => {
  res.send('Servidor rodando');
});

// Inicie o servidor
server.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
