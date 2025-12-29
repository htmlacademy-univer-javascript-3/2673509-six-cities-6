import { PlaceType } from '../enums/place-type-enum.tsx';
import { CityName } from '../enums/city-name-enum.tsx';

export type Offer = {
  id: string;
  title: string;
  rating: number;
  type: PlaceType;
  price: number;
  previewImage: string;
  isPremium: boolean;
  isBookmarked: boolean;
  isFavorite: boolean;
  location: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
  city: {
    name: CityName;
    location: {
      latitude: number;
      longitude: number;
      zoom: number;
    };
  };
};
