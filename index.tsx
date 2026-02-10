
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';

console.log("Iniciando renderização da aplicação...");

const container = document.getElementById('root');
if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Aplicação renderizada com sucesso.");
  } catch (error) {
    console.error("Erro ao renderizar a aplicação:", error);
    container.innerHTML = `<div style="padding: 20px; color: red;">Erro ao carregar aplicação. Verifique o console.</div>`;
  }
} else {
  console.error("Elemento root não encontrado!");
}
