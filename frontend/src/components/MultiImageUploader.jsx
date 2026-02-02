import React from 'react';
import ChunkedImageUploader from './ChunkedImageUploader';

const MultiImageUploader = ({ value, onChange, max = 5, disabled }) => {
  const arr = Array.isArray(value) ? value : [];
  const trimmed = arr.slice(0, max);

  return (
    <ChunkedImageUploader
      value={trimmed}
      disabled={disabled}
      onChange={(imgs) => onChange((imgs || []).slice(0, max))}
    />
  );
};

export default MultiImageUploader;
