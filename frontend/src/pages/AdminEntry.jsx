import React, { useEffect, useState } from 'react';
import AdminPanel from './AdminPanel';
import AuthPage from './AuthPage';

const AdminEntry = () => {
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('admin_token'));
  const [userToken, setUserToken] = useState(() => localStorage.getItem('user_token'));

  useEffect(() => {
    const onStorage = () => {
      setAdminToken(localStorage.getItem('admin_token'));
      setUserToken(localStorage.getItem('user_token'));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  if (adminToken) return <AdminPanel />;

  if (userToken) {
    window.location.href = '/user';
    return null;
  }

  return <AuthPage />;
};

export default AdminEntry;
