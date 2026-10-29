import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import NavBar from './components/layout/NavBar';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';

import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 3000,
        }}
      />
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