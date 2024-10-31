// src/context/WebSocketContext.tsx

import React, { createContext, useEffect, useState } from 'react';

const WebSocketContext = createContext<WebSocket | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080'); // Atualize para o URL do WebSocket em produção
    setSocket(ws);

    ws.onopen = () => console.log('Conectado ao WebSocket');
    ws.onclose = () => setSocket(null);

    return () => ws.close();
  }, []);

  return <WebSocketContext.Provider value={socket}>{children}</WebSocketContext.Provider>;
};

export default WebSocketContext;
