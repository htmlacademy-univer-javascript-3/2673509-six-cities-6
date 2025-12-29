import { CityName } from '../enums/city-name-enum.tsx';
import { Location } from './location.tsx';

export type City = {
  name: CityName;
  location: Location;
};
