import React, { createContext, useContext, useState } from 'react';

const DadosContext = createContext();

export function DadosProvider({ children }) {
  const [dados, setDados] = useState(null);
  return (
    <DadosContext.Provider value={{ dados, setDados }}>
      {children}
    </DadosContext.Provider>
  );
}

export function useDados() {
  return useContext(DadosContext);
}
