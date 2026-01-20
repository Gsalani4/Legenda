import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CarDetailPage from './pages/CarDetailPage';
import AdminPanel from './pages/AdminPanel';
import AdminSettingsPage from './pages/AdminSettingsPage';
import { Toaster } from './components/ui/sonner';
import { LanguageProvider } from './context/LanguageContext';
import { SettingsProvider } from './context/SettingsContext';

function App() {
  return (
    <LanguageProvider>
      <SettingsProvider>
        <div className="App min-h-screen flex flex-col">
          <BrowserRouter>
            <Header />
            <main className="flex-1 pt-[116px]">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/car/:id" element={<CarDetailPage />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/admin/settings" element={<AdminSettingsPage />} />
              </Routes>
            </main>
            <Footer />
            <Toaster />
          </BrowserRouter>
        </div>
      </SettingsProvider>
    </LanguageProvider>
  );
}

export default App;