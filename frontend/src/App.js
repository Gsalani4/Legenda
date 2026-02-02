import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
// (removed) SiteTopBanner – replaced by Home hero slider
import Footer from './components/Footer';
import { useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CarDetailPage from './pages/CarDetailPage';
import AdminEntry from './pages/AdminEntry';
import AdminPanel from './pages/AdminPanel';
import AdminSettingsPage from './pages/AdminSettingsPage';
import PendingListingsPage from './pages/PendingListingsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminUserDetailPage from './pages/AdminUserDetailPage';
import AdminListingsActivePage from './pages/AdminListingsActivePage';
import AdminListingsArchivedPage from './pages/AdminListingsArchivedPage';
import UserPanel from './pages/UserPanel';
import { Toaster } from './components/ui/sonner';
import { LanguageProvider } from './context/LanguageContext';
import { SettingsProvider } from './context/SettingsContext';

function AppLayout() {
  const location = useLocation();
  const _isHome = location.pathname === '/';

  return (
    <>
      <Header transparent={false} />
      <main className="flex-1">
        <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/car/:id" element={<CarDetailPage />} />
                <Route path="/admin" element={<AdminEntry />} />
                <Route path="/admin/settings" element={<AdminSettingsPage />} />
                <Route path="/admin/pending" element={<PendingListingsPage />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/admin/users/:id" element={<AdminUserDetailPage />} />
                <Route path="/admin/listings/active" element={<AdminListingsActivePage />} />
                <Route path="/admin/listings/archived" element={<AdminListingsArchivedPage />} />
                <Route path="/user" element={<UserPanel />} />
        </Routes>
      </main>
      <Footer />
      <Toaster />
    </>
  );
}

function App() {
  return (
    <LanguageProvider>
      <SettingsProvider>
        <div className="App min-h-screen flex flex-col">
          <BrowserRouter>
            <AppLayout />
          </BrowserRouter>
        </div>
      </SettingsProvider>
    </LanguageProvider>
  );
}

export default App;