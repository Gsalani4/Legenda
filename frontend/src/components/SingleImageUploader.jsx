import React from 'react';
import ChunkedImageUploader from './ChunkedImageUploader';

const SingleImageUploader = ({ value, onChange, disabled }) => {
  const arr = value ? [value] : [];
  return (
    <ChunkedImageUploader
      value={arr}
      disabled={disabled}
      onChange={(imgs) => onChange(imgs && imgs[0] ? imgs[0] : '')}
    />
  );
};

export default SingleImageUploader;
