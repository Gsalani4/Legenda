import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    contact: {
      phone: '+995 500 88 30 88',
      email: 'info@legendacar.ge',
      address: 'თამაზ გამყრელიძის 19',
      working_hours: 'ორშ - შაბ 8.00 - 18.00'
    },
    social_media: {
      facebook: 'https://www.facebook.com/profile.php?id=61573020256578',
      instagram: 'https://www.instagram.com/legendacar/',
      whatsapp: 'https://wa.me/995598123456'
    },
    banner: {
      desktop_image_url: '',
      mobile_image_url: ''
    }
  });
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    try {
      const response = await axios.get(`${API_URL}/settings`);
      if (response.data.success) {
        setSettings(response.data.settings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const updateSettings = async (newSettings) => {
    try {
      const token = localStorage.getItem('admin_token');
      await axios.put(
        `${API_URL}/settings`,
        newSettings,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await loadSettings();
      return true;
    } catch (error) {
      console.error('Error updating settings:', error);
      return false;
    }
  };

  const value = {
    settings,
    loading,
    updateSettings,
    refreshSettings: loadSettings
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};