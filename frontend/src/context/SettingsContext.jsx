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
  contact: {},
  social_media: {},
  banner: {},
  hero: {}
});
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    try {
      const response = await axios.get(`${API_URL}/settings`);
      if (response.data.success) {
       const data = response.data.settings;
const backend = process.env.REACT_APP_BACKEND_URL;

if (data.banner && data.banner.desktop_image_url && data.banner.desktop_image_url.startsWith("/")) {
  data.banner.desktop_image_url = backend + data.banner.desktop_image_url;
}

if (data.banner && data.banner.mobile_image_url && data.banner.mobile_image_url.startsWith("/")) {
  data.banner.mobile_image_url = backend + data.banner.mobile_image_url;
}

if (data.hero?.desktop_images) {
  data.hero.desktop_images = data.hero.desktop_images.map(img =>
    img.startsWith('/') ? backend + img : img
  );
}

if (data.hero?.mobile_images) {
  data.hero.mobile_images = data.hero.mobile_images.map(img =>
    img.startsWith('/') ? backend + img : img
  );
}

setSettings(data);
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
