import { useEffect, useRef, useState } from 'react';
import ReactMapGL, { Layer, Marker, Source } from 'react-map-gl';

const MapBox = ({ points, route }) => {
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 11,
    longitude: 108,
    zoom: 13,
  });
  const mapRef = useRef();

  useEffect(() => {
    let tempPoints = points?.filter((point) => point);
    let lons = tempPoints?.map((point) => point.lon);
    let lats = tempPoints?.map((point) => point.lat);

    lats &&
      lons &&
      lats.length > 0 &&
      lons.length > 0 &&
      mapRef?.current?.fitBounds(
        [
          { lat: Math.min(...lats), lon: Math.min(...lons) },
          { lat: Math.max(...lats), lon: Math.max(...lons) },
        ],
        {
          padding: 40,
          duration: 1000,
        }
      );
  }, [points]);

  return (
    <ReactMapGL
      ref={mapRef}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_API}
      initialViewState={{ ...viewport }}
      onViewportChange={(viewport) => setViewport({ viewport })}
      attributionControl={false}
    >
      {points?.map(
        (point) =>
          point && <Marker latitude={point.lat} longitude={point.lon} />
      )}

      {route && (
        <Source
          id="polylineLayer"
          type="geojson"
          data={{ type: 'Feature', properties: {}, ...route }}
        >
          <Layer
            id="lineLayer"
            type="line"
            source="my-data"
            layout={{
              'line-join': 'round',
              'line-cap': 'round',
            }}
            paint={{
              'line-color': 'red',
              'line-width': 2,
            }}
          />
        </Source>
      )}
    </ReactMapGL>
  );
};

export default MapBox;
