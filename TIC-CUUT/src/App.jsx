import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import NavBar from './components/layout/NavBar';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <NavBar />
        
        <main className="flex-grow flex flex-col">
          <AppRoutes />
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}