import axios from 'axios';

export const notinatim = axios.create({
  baseURL: 'https://nominatim.openstreetmap.org',
  params: {
    format: 'json',
  },
});

export const notinatimSearch = async (q) => {
  const result = await notinatim.get('/search', {
    params: {
      q: q,
    },
  });

  return result?.data;
};

export const notinatimReverse = async (lat, lon) => {
  const result = await notinatim.get('/reverse', {
    params: {
      lat,
      lon,
    },
  });
  return result?.data;
};
