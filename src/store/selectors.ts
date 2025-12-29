import {State} from './index.ts';
import {createSelector} from '@reduxjs/toolkit';

export const selectCurrentOffer = (state: State) => state.currentOffer;
export const selectOfferInfo = createSelector(selectCurrentOffer, (currentOffer) => currentOffer.offerInfo);
export const selectNearbyOffers = createSelector(selectCurrentOffer, (currentOffer) => currentOffer.nearestOffers);
export const selectReviews = createSelector(selectCurrentOffer, (currentOffer) => currentOffer.reviews);
