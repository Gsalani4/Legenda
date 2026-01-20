import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

export const initUpload = async ({ filename, totalChunks }) => {
  const form = new FormData();
  form.append('filename', filename);
  form.append('total_chunks', String(totalChunks));

  const res = await axios.post(`${API_URL}/uploads/init`, form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const uploadChunk = async ({ uploadId, index, blob }) => {
  const form = new FormData();
  form.append('upload_id', uploadId);
  form.append('index', String(index));
  form.append('chunk', blob, 'chunk');

  const res = await axios.post(`${API_URL}/uploads/chunk`, form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};
