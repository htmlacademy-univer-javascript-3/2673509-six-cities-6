import {Offer} from './offer-type.tsx';
import {Host} from './host-type.tsx';

export type DetailedOffer = Omit<Offer, 'previewImage'> & {
  description: string;
  bedrooms: number;
  goods: string[];
  host: Host;
  maxAdults: number;
  images: string[];
}
