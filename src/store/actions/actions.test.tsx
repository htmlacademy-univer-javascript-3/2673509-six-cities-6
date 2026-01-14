import { describe, it, expect } from 'vitest';
import {
  fillCityOffersList,
  changeCity,
  setSortOption,
  setAuthStatus,
  setError,
  fetchOffers,
  setIsFetchOffers,
  redirectToRoute,
  getOfferInfo,
  sendReview,
} from './actions';
import { Offer } from '../../internal/types/offer-type';
import { CityName } from '../../internal/enums/city-name-enum';
import { SortOption } from '../../internal/enums/sort-option-enum';
import { AuthStatus } from '../../internal/enums/auth-status-enum';
import { PlaceType } from '../../internal/enums/place-type-enum';
import { ReviewType } from '../../internal/types/review-type';
import { OfferInfo } from '../../internal/types/offer-info';
import { DetailedOffer } from '../../internal/types/detailed-offer-type';

const mockOffer: Offer = {
  id: '1',
  title: 'Beautiful apartment',
  type: PlaceType.Apartment,
  price: 120,
  city: {
    name: CityName.Paris,
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      zoom: 10,
    },
  },
  location: {
    latitude: 48.8566,
    longitude: 2.3522,
    zoom: 10,
  },
  isFavorite: false,
  isBookmarked: false,
  isPremium: false,
  rating: 4.5,
  previewImage: 'https://example.com/image.jpg',
};

const mockDetailedOffer: DetailedOffer = {
  ...mockOffer,
  description: 'A wonderful apartment',
  bedrooms: 3,
  goods: ['Wi-Fi', 'Kitchen'],
  host: {
    name: 'John',
    avatarUrl: 'https://example.com/avatar.jpg',
    isPro: true,
  },
  maxAdults: 4,
  images: ['https://example.com/image1.jpg'],
};

const mockReview: ReviewType = {
  id: '1',
  date: '2023-10-15T10:00:00.000Z',
  user: {
    name: 'Alice',
    avatarUrl: 'https://example.com/alice.jpg',
    isPro: false,
  },
  comment: 'Great place!',
  rating: 5,
};

const mockOfferInfo: OfferInfo = {
  offerInfo: mockDetailedOffer,
  nearestOffers: [mockOffer],
  reviews: [mockReview],
};

describe('Redux Actions', () => {
  describe('fillCityOffersList', () => {
    it('should create action to fill city offers list', () => {
      const offers = [mockOffer];
      const expectedAction = {
        type: 'FillCityOfferList',
        payload: offers,
      };

      expect(fillCityOffersList(offers)).toEqual(expectedAction);
    });

    it('should create action with empty array', () => {
      const expectedAction = {
        type: 'FillCityOfferList',
        payload: [],
      };

      expect(fillCityOffersList([])).toEqual(expectedAction);
    });

    it('should create action with multiple offers', () => {
      const offers = [mockOffer, { ...mockOffer, id: '2' }];
      const expectedAction = {
        type: 'FillCityOfferList',
        payload: offers,
      };

      expect(fillCityOffersList(offers)).toEqual(expectedAction);
    });
  });

  describe('changeCity', () => {
    it('should create action to change city to Paris', () => {
      const expectedAction = {
        type: 'ChangeCity',
        payload: CityName.Paris,
      };

      expect(changeCity(CityName.Paris)).toEqual(expectedAction);
    });

    it('should create action to change city to Amsterdam', () => {
      const expectedAction = {
        type: 'ChangeCity',
        payload: CityName.Amsterdam,
      };

      expect(changeCity(CityName.Amsterdam)).toEqual(expectedAction);
    });

    it('should create action to change city to Cologne', () => {
      const expectedAction = {
        type: 'ChangeCity',
        payload: CityName.Cologne,
      };

      expect(changeCity(CityName.Cologne)).toEqual(expectedAction);
    });

    it('should create action to change city to Brussels', () => {
      const expectedAction = {
        type: 'ChangeCity',
        payload: CityName.Brussels,
      };

      expect(changeCity(CityName.Brussels)).toEqual(expectedAction);
    });

    it('should create action to change city to Hamburg', () => {
      const expectedAction = {
        type: 'ChangeCity',
        payload: CityName.Hamburg,
      };

      expect(changeCity(CityName.Hamburg)).toEqual(expectedAction);
    });

    it('should create action to change city to Dusseldorf', () => {
      const expectedAction = {
        type: 'ChangeCity',
        payload: CityName.Dusseldorf,
      };

      expect(changeCity(CityName.Dusseldorf)).toEqual(expectedAction);
    });
  });

  describe('setSortOption', () => {
    it('should create action to set Popular sort option', () => {
      const expectedAction = {
        type: 'SetSortOption',
        payload: SortOption.Popular,
      };

      expect(setSortOption(SortOption.Popular)).toEqual(expectedAction);
    });

    it('should create action to set PriceLowToHigh sort option', () => {
      const expectedAction = {
        type: 'SetSortOption',
        payload: SortOption.PriceLowToHigh,
      };

      expect(setSortOption(SortOption.PriceLowToHigh)).toEqual(expectedAction);
    });

    it('should create action to set PriceHighToLow sort option', () => {
      const expectedAction = {
        type: 'SetSortOption',
        payload: SortOption.PriceHighToLow,
      };

      expect(setSortOption(SortOption.PriceHighToLow)).toEqual(expectedAction);
    });

    it('should create action to set TopRatedFirst sort option', () => {
      const expectedAction = {
        type: 'SetSortOption',
        payload: SortOption.TopRatedFirst,
      };

      expect(setSortOption(SortOption.TopRatedFirst)).toEqual(expectedAction);
    });
  });

  describe('setAuthStatus', () => {
    it('should create action to set Auth status', () => {
      const expectedAction = {
        type: 'SetAuthStatus',
        payload: AuthStatus.Auth,
      };

      expect(setAuthStatus(AuthStatus.Auth)).toEqual(expectedAction);
    });

    it('should create action to set NoAuth status', () => {
      const expectedAction = {
        type: 'SetAuthStatus',
        payload: AuthStatus.NoAuth,
      };

      expect(setAuthStatus(AuthStatus.NoAuth)).toEqual(expectedAction);
    });

    it('should create action to set Unknown status', () => {
      const expectedAction = {
        type: 'SetAuthStatus',
        payload: AuthStatus.Unknown,
      };

      expect(setAuthStatus(AuthStatus.Unknown)).toEqual(expectedAction);
    });
  });

  describe('setError', () => {
    it('should create action to set error message', () => {
      const errorMessage = 'Something went wrong';
      const expectedAction = {
        type: 'SetError',
        payload: errorMessage,
      };

      expect(setError(errorMessage)).toEqual(expectedAction);
    });

    it('should create action to clear error (null)', () => {
      const expectedAction = {
        type: 'SetError',
        payload: null,
      };

      expect(setError(null)).toEqual(expectedAction);
    });

    it('should create action with empty string error', () => {
      const expectedAction = {
        type: 'SetError',
        payload: '',
      };

      expect(setError('')).toEqual(expectedAction);
    });
  });

  describe('fetchOffers', () => {
    it('should create action to fetch offers', () => {
      const offers = [mockOffer];
      const expectedAction = {
        type: 'FetchOffers',
        payload: offers,
      };

      expect(fetchOffers(offers)).toEqual(expectedAction);
    });

    it('should create action with empty offers array', () => {
      const expectedAction = {
        type: 'FetchOffers',
        payload: [],
      };

      expect(fetchOffers([])).toEqual(expectedAction);
    });

    it('should create action with multiple offers', () => {
      const offers = [mockOffer, { ...mockOffer, id: '2' }, { ...mockOffer, id: '3' }];
      const expectedAction = {
        type: 'FetchOffers',
        payload: offers,
      };

      expect(fetchOffers(offers)).toEqual(expectedAction);
    });
  });

  describe('setIsFetchOffers', () => {
    it('should create action to set isFetchOffers to true', () => {
      const expectedAction = {
        type: 'SetIsFetchOffers',
        payload: true,
      };

      expect(setIsFetchOffers(true)).toEqual(expectedAction);
    });

    it('should create action to set isFetchOffers to false', () => {
      const expectedAction = {
        type: 'SetIsFetchOffers',
        payload: false,
      };

      expect(setIsFetchOffers(false)).toEqual(expectedAction);
    });
  });

  describe('redirectToRoute', () => {
    it('should create action to redirect to main page', () => {
      const expectedAction = {
        type: 'RedirectToRoute',
        payload: '/',
      };

      expect(redirectToRoute('/')).toEqual(expectedAction);
    });

    it('should create action to redirect to login page', () => {
      const expectedAction = {
        type: 'RedirectToRoute',
        payload: '/login',
      };

      expect(redirectToRoute('/login')).toEqual(expectedAction);
    });

    it('should create action to redirect to favorites page', () => {
      const expectedAction = {
        type: 'RedirectToRoute',
        payload: '/favorites',
      };

      expect(redirectToRoute('/favorites')).toEqual(expectedAction);
    });

    it('should create action to redirect to offer page', () => {
      const expectedAction = {
        type: 'RedirectToRoute',
        payload: '/offer/123',
      };

      expect(redirectToRoute('/offer/123')).toEqual(expectedAction);
    });
  });

  describe('getOfferInfo', () => {
    it('should create action to get offer info', () => {
      const expectedAction = {
        type: 'GetOfferInfo',
        payload: mockOfferInfo,
      };

      expect(getOfferInfo(mockOfferInfo)).toEqual(expectedAction);
    });

    it('should create action with offer info containing empty arrays', () => {
      const emptyOfferInfo: OfferInfo = {
        offerInfo: mockDetailedOffer,
        nearestOffers: [],
        reviews: [],
      };
      const expectedAction = {
        type: 'GetOfferInfo',
        payload: emptyOfferInfo,
      };

      expect(getOfferInfo(emptyOfferInfo)).toEqual(expectedAction);
    });

    it('should create action with multiple nearby offers and reviews', () => {
      const fullOfferInfo: OfferInfo = {
        offerInfo: mockDetailedOffer,
        nearestOffers: [mockOffer, { ...mockOffer, id: '2' }],
        reviews: [mockReview, { ...mockReview, id: '2' }],
      };
      const expectedAction = {
        type: 'GetOfferInfo',
        payload: fullOfferInfo,
      };

      expect(getOfferInfo(fullOfferInfo)).toEqual(expectedAction);
    });
  });

  describe('sendReview', () => {
    it('should create action to send review', () => {
      const expectedAction = {
        type: 'SendReview',
        payload: mockReview,
      };

      expect(sendReview(mockReview)).toEqual(expectedAction);
    });

    it('should create action with different review data', () => {
      const anotherReview: ReviewType = {
        id: '2',
        date: '2023-11-20T15:30:00.000Z',
        user: {
          name: 'Bob',
          avatarUrl: 'https://example.com/bob.jpg',
          isPro: true,
        },
        comment: 'Nice place!',
        rating: 4,
      };
      const expectedAction = {
        type: 'SendReview',
        payload: anotherReview,
      };

      expect(sendReview(anotherReview)).toEqual(expectedAction);
    });

    it('should create action with low rating review', () => {
      const lowRatingReview: ReviewType = {
        ...mockReview,
        id: '3',
        rating: 1,
        comment: 'Not good',
      };
      const expectedAction = {
        type: 'SendReview',
        payload: lowRatingReview,
      };

      expect(sendReview(lowRatingReview)).toEqual(expectedAction);
    });
  });

  describe('Action Types', () => {
    it('should have correct action type for fillCityOffersList', () => {
      expect(fillCityOffersList.type).toBe('FillCityOfferList');
    });

    it('should have correct action type for changeCity', () => {
      expect(changeCity.type).toBe('ChangeCity');
    });

    it('should have correct action type for setSortOption', () => {
      expect(setSortOption.type).toBe('SetSortOption');
    });

    it('should have correct action type for setAuthStatus', () => {
      expect(setAuthStatus.type).toBe('SetAuthStatus');
    });

    it('should have correct action type for setError', () => {
      expect(setError.type).toBe('SetError');
    });

    it('should have correct action type for fetchOffers', () => {
      expect(fetchOffers.type).toBe('FetchOffers');
    });

    it('should have correct action type for setIsFetchOffers', () => {
      expect(setIsFetchOffers.type).toBe('SetIsFetchOffers');
    });

    it('should have correct action type for redirectToRoute', () => {
      expect(redirectToRoute.type).toBe('RedirectToRoute');
    });

    it('should have correct action type for getOfferInfo', () => {
      expect(getOfferInfo.type).toBe('GetOfferInfo');
    });

    it('should have correct action type for sendReview', () => {
      expect(sendReview.type).toBe('SendReview');
    });
  });
});
