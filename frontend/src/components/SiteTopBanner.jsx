import React from 'react';
import { useSettings } from '../context/SettingsContext';

const SiteTopBanner = () => {
  const { settings } = useSettings();
  const desktop = settings?.banner?.desktop_image_url;
  const mobile = settings?.banner?.mobile_image_url;

  if (!desktop && !mobile) return null;

  return (
    <div className="bg-black border-b border-gray-800">
      {mobile && (
        <img
          src={mobile}
          alt="Top banner"
          className="block sm:hidden w-full h-[60px] object-cover"
          loading="lazy"
          decoding="async"
        />
      )}
      {desktop && (
        <img
          src={desktop}
          alt="Top banner"
          className="hidden sm:block w-full h-[150px] object-cover"
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
};

export default SiteTopBanner;
