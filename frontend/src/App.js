import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CarDetailPage from './pages/CarDetailPage';
import AdminEntry from './pages/AdminEntry';
import AdminPanel from './pages/AdminPanel';
import AdminSettingsPage from './pages/AdminSettingsPage';
import PendingListingsPage from './pages/PendingListingsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import UserPanel from './pages/UserPanel';
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
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/car/:id" element={<CarDetailPage />} />
                <Route path="/admin" element={<AdminEntry />} />
                <Route path="/admin/settings" element={<AdminSettingsPage />} />
                <Route path="/admin/pending" element={<PendingListingsPage />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/user" element={<UserPanel />} />
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