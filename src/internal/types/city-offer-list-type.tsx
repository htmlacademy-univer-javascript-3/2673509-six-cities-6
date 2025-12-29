import {City} from './city.tsx';
import {Offer} from './offer-type.tsx';
import {SortOption} from '../enums/sort-option-enum.tsx';
import {AuthStatus} from '../enums/auth-status-enum.tsx';
import {ReviewType} from './review-type.tsx';
import {DetailedOffer} from './detailed-offer-type.tsx';

export type CityOfferListType = {
  city: City;
  offers: Offer[];
  sortOption: SortOption;
  authStatus: AuthStatus;
  favoriteOffers: Offer[];
  isFetchOffers: boolean;
  isFetchSingleOffer: boolean;
  error: string | null;
  currentOffer: {
    offerInfo: DetailedOffer | null;
    nearestOffers: Offer[];
    reviews: ReviewType[];
  };
}
