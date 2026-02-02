import React from 'react';
import { useSettings } from '../context/SettingsContext';

const SiteTopBanner = ({ overlapHeader = false }) => {
  const { settings } = useSettings();
  const desktop = settings?.banner?.desktop_image_url;
  const mobile = settings?.banner?.mobile_image_url;

  if (!desktop && !mobile) return null;

  const overlapClass = overlapHeader ? '-mt-[124px] sm:-mt-[93px]' : '';

  return (
    <div className={`border-b border-gray-800 ${overlapClass}`}>
      {mobile && (
        <img
          src={mobile}
          alt="Top banner"
          className="block sm:hidden w-full h-[84px] object-cover opacity-100"
          loading="lazy"
          decoding="async"
        />
      )}
      {desktop && (
        <img
          src={desktop}
          alt="Top banner"
          className="hidden sm:block w-full h-[125px] object-cover"
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
};

export default SiteTopBanner;
