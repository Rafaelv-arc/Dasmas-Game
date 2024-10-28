import WebSocket from 'ws';

const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (socket) => {
  console.log('Novo cliente conectado');

  socket.on('message', (message) => {
    console.log('Mensagem recebida:', message);
    // Aqui você pode processar a mensagem e responder
    socket.send('Mensagem recebida');
  });

  socket.on('close', () => {
    console.log('Cliente desconectado');
  });
});

console.log('Servidor WebSocket rodando na porta 8080');
