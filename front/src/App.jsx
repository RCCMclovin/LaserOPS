import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota da tela de Login (Página Inicial) */}
        <Route path="/" element={<Login />} />

        {/* Rota do Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Rota de segurança: se o usuário digitar qualquer outra coisa, manda pro Login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;