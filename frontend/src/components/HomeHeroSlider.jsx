import React, { useEffect, useMemo, useState } from 'react';
import { useSettings } from '../context/SettingsContext';

const INTERVAL_MS = 6000;

const Slider = ({ images, heightClass }) => {
  const safeImages = useMemo(() => (images || []).filter(Boolean).slice(0, 5), [images]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (safeImages.length <= 1) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % safeImages.length);
    }, INTERVAL_MS);
    return () => clearInterval(t);
  }, [safeImages.length]);

  if (safeImages.length === 0) return null;

  return (
    <div className={`relative overflow-hidden w-full ${heightClass}`}>
      <div
        className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {safeImages.map((src, i) => (
          <img
            key={`${src}-${i}`}
            src={src}
            alt="Hero"
            className="w-full h-full object-cover flex-shrink-0"
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
        ))}
      </div>

      {/* Subtle overlay (5%) so text sits on top without killing the image */}
      <div className="absolute inset-0 bg-black/[0.05]" />
    </div>
  );
};

const HomeHeroSlider = () => {
  const { settings } = useSettings();

  const desktop = settings?.hero?.desktop_images || [];
  const mobile = settings?.hero?.mobile_images || [];

  if ((!desktop || desktop.length === 0) && (!mobile || mobile.length === 0)) return null;

  return (
    <>
      <div className="hidden sm:block">
        <Slider images={desktop} heightClass="h-[160px]" />
      </div>
      <div className="block sm:hidden">
        <Slider images={mobile} heightClass="h-[140px]" />
      </div>
    </>
  );
};

export default HomeHeroSlider;
