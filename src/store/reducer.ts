import {createReducer} from '@reduxjs/toolkit';
import {
  changeCity,
  fetchOffers,
  fillCityOffersList, getOfferInfo, sendReview,
  setAuthStatus, setError,
  setIsFetchOffers,
  setSortOption
} from './actions.ts';
import {CityName} from '../internal/enums/city-name-enum.tsx';
import {CityOfferListType} from '../internal/types/city-offer-list-type.tsx';
import {SortOption} from '../internal/enums/sort-option-enum.tsx';
import {Cities} from '../constants';
import {AuthStatus} from '../internal/enums/auth-status-enum.tsx';
import {addFavouriteAction, getOfferInfoAction} from './api-actions.ts';

export const InitialCityState: CityOfferListType = {
  city: {
    name: CityName.Paris,
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      zoom: 10
    }
  },
  offers: [],
  favoriteOffers: [],
  sortOption: SortOption.Popular,
  authStatus: AuthStatus.Unknown,
  isFetchOffers: false,
  isFetchSingleOffer: false,
  error: null,
  currentOffer: {
    offerInfo: null,
    nearestOffers: [],
    reviews: [],
  },
};

export const reducer = createReducer(InitialCityState, (builder) => {
  builder
    .addCase(changeCity, (state, action) => {
      state.city.name = action.payload;
      const location = Cities.find((elem) => elem.name === state.city.name)?.location;
      if (location) {
        state.city.location = location;
      }
    })
    .addCase(fillCityOffersList, (state, action) => {
      state.offers = action.payload;
    })
    .addCase(setSortOption, (state, { payload }) => {
      state.sortOption = payload;
    })
    .addCase(fetchOffers, (state, {payload}) => {
      state.offers = payload;
    })
    .addCase(getOfferInfo, (state, { payload }) => {
      state.currentOffer = { ...payload };
    })
    .addCase(sendReview, (state, { payload }) => {
      state.currentOffer.reviews = [...state.currentOffer.reviews, payload];
    })
    .addCase(setAuthStatus, (state, action) => {
      state.authStatus = action.payload;
    })
    .addCase(setIsFetchOffers, (state, action) => {
      state.isFetchOffers = action.payload;
    })
    .addCase(setError, (state, action) => {
      state.error = action.payload;
    })
    .addCase(getOfferInfoAction.pending, (state) => {
      state.error = null;
      state.isFetchSingleOffer = true;
    })
    .addCase(getOfferInfoAction.fulfilled, (state, action) => {
      state.isFetchSingleOffer = false;
      state.error = null;
      const { offerInfo, nearestOffers, reviews } = action.payload;
      state.currentOffer.offerInfo = offerInfo;
      state.currentOffer.nearestOffers = nearestOffers;
      state.currentOffer.reviews = reviews;
    })
    .addCase(getOfferInfoAction.rejected, (state, action) => {
      state.isFetchSingleOffer = false;
      state.error = action.payload as string;
    })
    .addCase(addFavouriteAction.fulfilled, (state, action) => {
      state.offers = state.offers.map((offer) => {
        if (offer.id !== action.payload.id) {
          return offer;
        }
        return {...offer, isFavorite: action.payload.isFavorite};
      });
      if (state.currentOffer.offerInfo?.id === action.payload.id) {
        state.currentOffer.offerInfo.isFavorite = action.payload.isFavorite;
      }
    });
});
