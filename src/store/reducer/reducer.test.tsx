import { describe, it, expect, beforeEach } from 'vitest';
import { reducer, InitialCityState } from './reducer';
import {
  changeCity,
  fillCityOffersList,
  setSortOption,
  fetchOffers,
  getOfferInfo,
  sendReview,
  setAuthStatus,
  setIsFetchOffers,
  setError,
} from '../actions/actions';
import { getOfferInfoAction, addFavouriteAction } from '../api-actions/api-actions';
import { CityName } from '../../internal/enums/city-name-enum';
import { SortOption } from '../../internal/enums/sort-option-enum';
import { AuthStatus } from '../../internal/enums/auth-status-enum';
import { PlaceType } from '../../internal/enums/place-type-enum';
import { Offer } from '../../internal/types/offer-type';
import { ReviewType } from '../../internal/types/review-type';
import { CityOfferListType } from '../../internal/types/city-offer-list-type';
import { DetailedOffer } from '../../internal/types/detailed-offer-type';

describe('Reducer', () => {
  let initialState: CityOfferListType;

  const mockOffer: Offer = {
    id: '1',
    title: 'Test Apartment',
    type: PlaceType.Apartment,
    price: 120,
    city: {
      name: CityName.Paris,
      location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
    },
    location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
    isFavorite: false,
    isBookmarked: false,
    isPremium: false,
    rating: 4.5,
    previewImage: 'https://example.com/image.jpg',
  };

  const mockDetailedOffer: DetailedOffer = {
    id: '1',
    title: 'Test Apartment',
    type: PlaceType.Apartment,
    price: 120,
    city: {
      name: CityName.Paris,
      location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
    },
    location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
    isFavorite: false,
    isBookmarked: false,
    isPremium: false,
    rating: 4.5,
    description: 'Great apartment in the city center',
    bedrooms: 2,
    goods: ['Wi-Fi', 'Kitchen', 'Washing machine'],
    host: {
      name: 'John Doe',
      avatarUrl: 'https://example.com/avatar.jpg',
      isPro: true,
    },
    maxAdults: 4,
    images: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
  };

  const mockReview: ReviewType = {
    id: '1',
    date: '2024-01-15',
    user: {
      name: 'John',
      avatarUrl: 'https://example.com/avatar.jpg',
      isPro: false,
    },
    comment: 'Great place!',
    rating: 5,
  };

  beforeEach(() => {
    initialState = { ...InitialCityState };
  });

  describe('Initial state', () => {
    it('should return initial state when called with undefined state', () => {
      const result = reducer(undefined, { type: 'UNKNOWN_ACTION' });

      expect(result).toEqual(InitialCityState);
    });

    it('should have correct initial values', () => {
      expect(InitialCityState.city.name).toBe(CityName.Paris);
      expect(InitialCityState.offers).toEqual([]);
      expect(InitialCityState.favoriteOffers).toEqual([]);
      expect(InitialCityState.sortOption).toBe(SortOption.Popular);
      expect(InitialCityState.authStatus).toBe(AuthStatus.Unknown);
      expect(InitialCityState.isFetchOffers).toBe(false);
      expect(InitialCityState.isFetchSingleOffer).toBe(false);
      expect(InitialCityState.error).toBe(null);
      expect(InitialCityState.currentOffer.offerInfo).toBe(null);
      expect(InitialCityState.currentOffer.nearestOffers).toEqual([]);
      expect(InitialCityState.currentOffer.reviews).toEqual([]);
    });
  });

  describe('changeCity action', () => {
    it('should change city name', () => {
      const action = changeCity(CityName.Amsterdam);
      const result = reducer(initialState, action);

      expect(result.city.name).toBe(CityName.Amsterdam);
    });

    it('should update city location when city exists in Cities', () => {
      const action = changeCity(CityName.Cologne);
      const result = reducer(initialState, action);

      expect(result.city.name).toBe(CityName.Cologne);
      expect(result.city.location).toBeDefined();
      expect(result.city.location.latitude).toBeDefined();
      expect(result.city.location.longitude).toBeDefined();
    });

    it('should handle all available cities', () => {
      const cities = [
        CityName.Paris,
        CityName.Cologne,
        CityName.Brussels,
        CityName.Amsterdam,
        CityName.Hamburg,
        CityName.Dusseldorf,
      ];

      cities.forEach((cityName) => {
        const action = changeCity(cityName);
        const result = reducer(initialState, action);

        expect(result.city.name).toBe(cityName);
        expect(result.city.location).toBeDefined();
      });
    });
  });

  describe('fillCityOffersList action', () => {
    it('should fill offers list', () => {
      const offers = [mockOffer];
      const action = fillCityOffersList(offers);
      const result = reducer(initialState, action);

      expect(result.offers).toEqual(offers);
      expect(result.offers).toHaveLength(1);
    });

    it('should replace existing offers', () => {
      const stateWithOffers = {
        ...initialState,
        offers: [mockOffer],
      };
      const newOffers = [
        { ...mockOffer, id: '2', title: 'New Apartment' },
        { ...mockOffer, id: '3', title: 'Another Apartment' },
      ];
      const action = fillCityOffersList(newOffers);
      const result = reducer(stateWithOffers, action);

      expect(result.offers).toEqual(newOffers);
      expect(result.offers).toHaveLength(2);
    });

    it('should handle empty offers array', () => {
      const stateWithOffers = {
        ...initialState,
        offers: [mockOffer],
      };
      const action = fillCityOffersList([]);
      const result = reducer(stateWithOffers, action);

      expect(result.offers).toEqual([]);
    });
  });

  describe('setSortOption action', () => {
    it('should set sort option to PriceLowToHigh', () => {
      const action = setSortOption(SortOption.PriceLowToHigh);
      const result = reducer(initialState, action);

      expect(result.sortOption).toBe(SortOption.PriceLowToHigh);
    });

    it('should set sort option to PriceHighToLow', () => {
      const action = setSortOption(SortOption.PriceHighToLow);
      const result = reducer(initialState, action);

      expect(result.sortOption).toBe(SortOption.PriceHighToLow);
    });

    it('should set sort option to TopRatedFirst', () => {
      const action = setSortOption(SortOption.TopRatedFirst);
      const result = reducer(initialState, action);

      expect(result.sortOption).toBe(SortOption.TopRatedFirst);
    });

    it('should set sort option to Popular', () => {
      const stateWithSort = {
        ...initialState,
        sortOption: SortOption.PriceLowToHigh,
      };
      const action = setSortOption(SortOption.Popular);
      const result = reducer(stateWithSort, action);

      expect(result.sortOption).toBe(SortOption.Popular);
    });
  });

  describe('fetchOffers action', () => {
    it('should fetch and set offers', () => {
      const offers = [mockOffer];
      const action = fetchOffers(offers);
      const result = reducer(initialState, action);

      expect(result.offers).toEqual(offers);
    });

    it('should handle multiple offers', () => {
      const offers = [
        mockOffer,
        { ...mockOffer, id: '2', title: 'Second Apartment' },
        { ...mockOffer, id: '3', title: 'Third Apartment' },
      ];
      const action = fetchOffers(offers);
      const result = reducer(initialState, action);

      expect(result.offers).toHaveLength(3);
      expect(result.offers).toEqual(offers);
    });
  });

  describe('getOfferInfo action', () => {
    it('should set current offer info', () => {
      const offerData = {
        offerInfo: mockDetailedOffer,
        nearestOffers: [],
        reviews: [],
      };
      const action = getOfferInfo(offerData);
      const result = reducer(initialState, action);

      expect(result.currentOffer).toEqual(offerData);
      expect(result.currentOffer.offerInfo).toEqual(mockDetailedOffer);
    });

    it('should set offer with nearest offers and reviews', () => {
      const offerData = {
        offerInfo: mockDetailedOffer,
        nearestOffers: [{ ...mockOffer, id: '2' }],
        reviews: [mockReview],
      };
      const action = getOfferInfo(offerData);
      const result = reducer(initialState, action);

      expect(result.currentOffer.nearestOffers).toHaveLength(1);
      expect(result.currentOffer.reviews).toHaveLength(1);
    });

    it('should replace existing current offer', () => {
      const existingOffer = {
        offerInfo: mockDetailedOffer,
        nearestOffers: [{ ...mockOffer, id: '2' }],
        reviews: [mockReview],
      };
      const stateWithOffer = {
        ...initialState,
        currentOffer: existingOffer,
      };
      const newOfferData = {
        offerInfo: { ...mockDetailedOffer, id: '3', title: 'New Offer' },
        nearestOffers: [],
        reviews: [],
      };
      const action = getOfferInfo(newOfferData);
      const result = reducer(stateWithOffer, action);

      expect(result.currentOffer).toEqual(newOfferData);
    });
  });

  describe('sendReview action', () => {
    it('should add review to current offer', () => {
      const action = sendReview(mockReview);
      const result = reducer(initialState, action);

      expect(result.currentOffer.reviews).toHaveLength(1);
      expect(result.currentOffer.reviews[0]).toEqual(mockReview);
    });

    it('should append review to existing reviews', () => {
      const existingReview = { ...mockReview, id: '0' };
      const stateWithReviews = {
        ...initialState,
        currentOffer: {
          ...initialState.currentOffer,
          reviews: [existingReview],
        },
      };
      const newReview = { ...mockReview, id: '1', comment: 'Another review' };
      const action = sendReview(newReview);
      const result = reducer(stateWithReviews, action);

      expect(result.currentOffer.reviews).toHaveLength(2);
      expect(result.currentOffer.reviews[1]).toEqual(newReview);
    });
  });

  describe('setAuthStatus action', () => {
    it('should set auth status to Auth', () => {
      const action = setAuthStatus(AuthStatus.Auth);
      const result = reducer(initialState, action);

      expect(result.authStatus).toBe(AuthStatus.Auth);
    });

    it('should set auth status to NoAuth', () => {
      const action = setAuthStatus(AuthStatus.NoAuth);
      const result = reducer(initialState, action);

      expect(result.authStatus).toBe(AuthStatus.NoAuth);
    });
  });

  describe('setIsFetchOffers action', () => {
    it('should set isFetchOffers to true', () => {
      const action = setIsFetchOffers(true);
      const result = reducer(initialState, action);

      expect(result.isFetchOffers).toBe(true);
    });

    it('should set isFetchOffers to false', () => {
      const stateWithFetch = {
        ...initialState,
        isFetchOffers: true,
      };
      const action = setIsFetchOffers(false);
      const result = reducer(stateWithFetch, action);

      expect(result.isFetchOffers).toBe(false);
    });
  });

  describe('setError action', () => {
    it('should set error message', () => {
      const errorMessage = 'Failed to load data';
      const action = setError(errorMessage);
      const result = reducer(initialState, action);

      expect(result.error).toBe(errorMessage);
    });

    it('should clear error by setting null', () => {
      const stateWithError = {
        ...initialState,
        error: 'Some error',
      };
      const action = setError(null);
      const result = reducer(stateWithError, action);

      expect(result.error).toBe(null);
    });
  });

  describe('getOfferInfoAction.pending', () => {
    it('should set loading state', () => {
      const action = { type: getOfferInfoAction.pending.type };
      const result = reducer(initialState, action);

      expect(result.isFetchSingleOffer).toBe(true);
      expect(result.error).toBe(null);
    });
  });

  describe('getOfferInfoAction.fulfilled', () => {
    it('should set offer info on success', () => {
      const payload = {
        offerInfo: mockDetailedOffer,
        nearestOffers: [{ ...mockOffer, id: '2' }],
        reviews: [mockReview],
      };
      const action = {
        type: getOfferInfoAction.fulfilled.type,
        payload,
      };
      const result = reducer(initialState, action);

      expect(result.isFetchSingleOffer).toBe(false);
      expect(result.error).toBe(null);
      expect(result.currentOffer.offerInfo).toEqual(mockDetailedOffer);
      expect(result.currentOffer.nearestOffers).toHaveLength(1);
      expect(result.currentOffer.reviews).toHaveLength(1);
    });
  });

  describe('getOfferInfoAction.rejected', () => {
    it('should set error on failure', () => {
      const errorMessage = 'Failed to load offer';
      const action = {
        type: getOfferInfoAction.rejected.type,
        payload: errorMessage,
      };
      const result = reducer(initialState, action);

      expect(result.isFetchSingleOffer).toBe(false);
      expect(result.error).toBe(errorMessage);
    });
  });

  describe('addFavouriteAction.fulfilled', () => {
    it('should update offer favorite status in offers list', () => {
      const stateWithOffers = {
        ...initialState,
        offers: [mockOffer],
      };
      const action = {
        type: addFavouriteAction.fulfilled.type,
        payload: { id: '1', isFavorite: true },
      };
      const result = reducer(stateWithOffers, action);

      expect(result.offers[0].isFavorite).toBe(true);
    });

    it('should update offer favorite status in nearest offers', () => {
      const stateWithNearestOffers = {
        ...initialState,
        currentOffer: {
          ...initialState.currentOffer,
          nearestOffers: [mockOffer],
        },
      };
      const action = {
        type: addFavouriteAction.fulfilled.type,
        payload: { id: '1', isFavorite: true },
      };
      const result = reducer(stateWithNearestOffers, action);

      expect(result.currentOffer.nearestOffers[0].isFavorite).toBe(true);
    });

    it('should update current offer info favorite status', () => {
      const stateWithCurrentOffer = {
        ...initialState,
        currentOffer: {
          ...initialState.currentOffer,
          offerInfo: mockDetailedOffer,
        },
      };
      const action = {
        type: addFavouriteAction.fulfilled.type,
        payload: { id: '1', isFavorite: true },
      };
      const result = reducer(stateWithCurrentOffer, action);

      expect(result.currentOffer.offerInfo?.isFavorite).toBe(true);
    });

    it('should toggle favorite status from true to false', () => {
      const favoriteOffer = { ...mockOffer, isFavorite: true };
      const stateWithFavorite = {
        ...initialState,
        offers: [favoriteOffer],
      };
      const action = {
        type: addFavouriteAction.fulfilled.type,
        payload: { id: '1', isFavorite: false },
      };
      const result = reducer(stateWithFavorite, action);

      expect(result.offers[0].isFavorite).toBe(false);
    });

    it('should not update offers with different ids', () => {
      const offer1 = { ...mockOffer, id: '1' };
      const offer2 = { ...mockOffer, id: '2', isFavorite: false };
      const stateWithMultipleOffers = {
        ...initialState,
        offers: [offer1, offer2],
      };
      const action = {
        type: addFavouriteAction.fulfilled.type,
        payload: { id: '1', isFavorite: true },
      };
      const result = reducer(stateWithMultipleOffers, action);

      expect(result.offers[0].isFavorite).toBe(true);
      expect(result.offers[1].isFavorite).toBe(false);
    });
  });

  describe('Unknown actions', () => {
    it('should return current state for unknown action', () => {
      const action = { type: 'UNKNOWN_ACTION', payload: 'test' };
      const result = reducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });
});
