import { createContext, useState } from 'react';

export const SocketContext = createContext({});

export function SocketProvider({ children }) {
  const [PublicSocketIO, setPublicSocketIO] = useState(null);

  return (
    <SocketContext.Provider value={{ PublicSocketIO, setPublicSocketIO }}>
      {children}
    </SocketContext.Provider>
  );
}
