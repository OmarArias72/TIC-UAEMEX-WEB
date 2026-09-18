import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Componentes estructurales de Layout
import NavBar from './components/layout/NavBar';
import Footer from './components/layout/Footer';

// Módulo de Enrutamiento Centralizado
import AppRoutes from './routes/AppRoutes';

import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <div className="flex flex-col min-h-screen bg-slate-50">
        <NavBar />

        <main className="flex-grow flex flex-col">
          <AppRoutes />
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}