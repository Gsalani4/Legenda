import React, { useMemo, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from './ui/button';
import { initUpload, uploadChunk } from '../services/uploadApi';

const CHUNK_SIZE = 1024 * 1024; // 1MB

const ChunkedImageUploader = ({ value, onChange, disabled }) => {
  const images = value || [];
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(null);

  const canAddMore = images.length < 10;

  const accept = useMemo(() => 'image/*', []);

  const handleFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList).slice(0, 10 - images.length);

    setUploading(true);
    try {
      for (const file of files) {
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
        const init = await initUpload({ filename: file.name, totalChunks });
        if (!init.success) throw new Error('init failed');

        setProgress({ filename: file.name, current: 0, total: totalChunks });

        for (let i = 0; i < totalChunks; i += 1) {
          const start = i * CHUNK_SIZE;
          const end = Math.min(start + CHUNK_SIZE, file.size);
          const blob = file.slice(start, end);

          const resp = await uploadChunk({ uploadId: init.upload_id, index: i, blob });
          if (!resp.success) throw new Error('chunk failed');

          setProgress({ filename: file.name, current: i + 1, total: totalChunks });

          if (resp.done && resp.url) {
            onChange([...(images), resp.url]);
          }
        }
      }
    } finally {
      setUploading(false);
      setProgress(null);
    }
  };

  const removeAt = (idx) => {
    onChange(images.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm text-gray-300">Resimler (Max 10) ({images.length}/10)</label>
        <div className="relative">
          <input
            type="file"
            multiple
            accept={accept}
            disabled={disabled || uploading || !canAddMore}
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <Button type="button" variant="outline" disabled={disabled || uploading || !canAddMore}>
            <Upload className="w-4 h-4 mr-2" />
            Cihazdan Seç
          </Button>
        </div>
      </div>

      {progress && (
        <div className="text-xs text-gray-400">
          Yükleniyor: {progress.filename} ({progress.current}/{progress.total})
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((img, idx) => (
            <div key={img + idx} className="relative group">
              <img src={img} alt={`${idx + 1}`} className="w-full h-20 object-cover rounded" />
              <button
                type="button"
                onClick={() => removeAt(idx)}
                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChunkedImageUploader;
