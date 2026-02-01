import React from 'react';
import { Helmet } from 'react-helmet-async';

const Seo = ({ title, description, image, url }) => {
  const safeTitle = title || 'LEGENDACAR';
  const safeDescription = description || '';

  return (
    <Helmet>
      <title>{safeTitle}</title>
      {safeDescription && <meta name="description" content={safeDescription} />}

      {/* Open Graph */}
      <meta property="og:title" content={safeTitle} />
      {safeDescription && <meta property="og:description" content={safeDescription} />}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:type" content="website" />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter */}
      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={safeTitle} />
      {safeDescription && <meta name="twitter:description" content={safeDescription} />}
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
};

export default Seo;
