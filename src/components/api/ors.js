import axios from 'axios';

export const orsDirection = axios.create({
  baseURL: 'http://localhost:8082',
});

export const getRoute = async (points) => {
  const result = await orsDirection.post(
    '/ors/v2/directions/driving-car/geojson',
    {
      coordinates: [
        ...points?.map((point) => [
          parseFloat(point?.lon),
          parseFloat(point?.lat),
        ]),
      ],
    }
  );
  return result?.data;
};
