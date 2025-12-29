import { useRef, useEffect } from 'react';
import {Icon, Marker} from 'leaflet';
import useMap from '../../hooks/use-map.tsx';
import { URL_MARKER_CURRENT, URL_MARKER_DEFAULT } from '../../constants';
import 'leaflet/dist/leaflet.css';
import {MapClasses} from '../../internal/enums/map-classes-enum.tsx';
import {City} from '../../internal/types/city.tsx';
import {Point} from '../../internal/types/point.tsx';
import {Offer} from '../../internal/types/offer-type.tsx';

const defaultCustomIcon = new Icon({
  iconUrl: URL_MARKER_DEFAULT,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const currentCustomIcon = new Icon({
  iconUrl: URL_MARKER_CURRENT,
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

type MapProps = {
  city: City;
  points: Point[] | Offer[];
  activeOfferId: string | undefined;
};

export function Map({ city, points, activeOfferId}: MapProps){
  const mapRef = useRef(null);
  const map = useMap(mapRef, city);

  useEffect(() => {
    if (map) {
      map.eachLayer((layer) => {
        if (layer.options.pane === 'markerPane') {
          map.removeLayer(layer);
        }
      });
      points.forEach((point) => {
        const marker = new Marker({
          lat: point.location.latitude,
          lng: point.location.longitude
        });

        marker
          .setIcon(
            point.id === activeOfferId
              ? currentCustomIcon
              : defaultCustomIcon
          )
          .addTo(map);
      });
    }
  }, [map, points, activeOfferId]);

  useEffect(() => {
    if (map) {
      map.flyTo([city.location.latitude, city.location.longitude], city.location.zoom);
    }
  }, [map, city]);

  return (
    <section
      className={MapClasses.SectionPropertyMapClass}
      ref={mapRef}
    >
    </section>
  );
}
