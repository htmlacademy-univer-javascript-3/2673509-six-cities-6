import {ReviewType} from './review-type.tsx';
import {Offer} from './offer-type.tsx';
import {DetailedOffer} from './detailed-offer-type.tsx';

export type OfferInfo = {
  offerInfo: DetailedOffer;
  nearestOffers: Offer[];
  reviews: ReviewType[];
};
