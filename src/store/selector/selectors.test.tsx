import { describe, it, expect, beforeEach } from 'vitest';
import {
  selectCurrentOffer,
  selectOfferInfo,
  selectNearbyOffers,
  selectReviews,
} from './selectors';
import { State } from '../index';
import { DetailedOffer } from '../../internal/types/detailed-offer-type';
import { Offer } from '../../internal/types/offer-type';
import { ReviewType } from '../../internal/types/review-type';
import { CityName } from '../../internal/enums/city-name-enum';
import { PlaceType } from '../../internal/enums/place-type-enum';
import { AuthStatus } from '../../internal/enums/auth-status-enum';
import { SortOption } from '../../internal/enums/sort-option-enum';

const mockDetailedOffer: DetailedOffer = {
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
  isPremium: true,
  rating: 4.5,
  description: 'A wonderful apartment in Paris',
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

const mockNearbyOffer: Offer = {
  id: '2',
  title: 'Nearby apartment',
  type: PlaceType.Apartment,
  price: 100,
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
  rating: 4.0,
  previewImage: 'https://example.com/image.jpg',
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

const createMockState = (
  offerInfo: DetailedOffer | null = mockDetailedOffer,
  nearestOffers: Offer[] = [mockNearbyOffer],
  reviews: ReviewType[] = [mockReview]
): State =>
  ({
    city: {
      name: CityName.Paris,
      location: {
        latitude: 48.8566,
        longitude: 2.3522,
        zoom: 10,
      },
    },
    offers: [],
    sortOption: SortOption.Popular,
    authStatus: AuthStatus.NoAuth,
    favoriteOffers: [],
    isFetchOffers: false,
    isFetchSingleOffer: false,
    error: null,
    currentOffer: {
      offerInfo,
      nearestOffers,
      reviews,
    },
  }) as State;

describe('Redux Selectors', () => {
  let mockState: State;

  beforeEach(() => {
    mockState = createMockState();
  });

  describe('selectCurrentOffer', () => {
    it('should select currentOffer from state', () => {
      const result = selectCurrentOffer(mockState);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('offerInfo');
      expect(result).toHaveProperty('nearestOffers');
      expect(result).toHaveProperty('reviews');
    });

    it('should return currentOffer object', () => {
      const result = selectCurrentOffer(mockState);

      expect(result.offerInfo).toEqual(mockDetailedOffer);
      expect(result.nearestOffers).toEqual([mockNearbyOffer]);
      expect(result.reviews).toEqual([mockReview]);
    });

    it('should return the same reference for same state', () => {
      const result1 = selectCurrentOffer(mockState);
      const result2 = selectCurrentOffer(mockState);

      expect(result1).toBe(result2);
    });

    it('should handle null offerInfo', () => {
      const stateWithNull = createMockState(null, [], []);
      const result = selectCurrentOffer(stateWithNull);

      expect(result.offerInfo).toBeNull();
    });

    it('should handle empty arrays', () => {
      const stateWithEmpty = createMockState(mockDetailedOffer, [], []);
      const result = selectCurrentOffer(stateWithEmpty);

      expect(result.nearestOffers).toEqual([]);
      expect(result.reviews).toEqual([]);
    });
  });

  describe('selectOfferInfo', () => {
    it('should select offerInfo from currentOffer', () => {
      const result = selectOfferInfo(mockState);

      expect(result).toEqual(mockDetailedOffer);
    });

    it('should return null when offerInfo is null', () => {
      const stateWithNull = createMockState(null, [], []);
      const result = selectOfferInfo(stateWithNull);

      expect(result).toBeNull();
    });

    it('should return offer with all properties', () => {
      const result = selectOfferInfo(mockState);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('bedrooms');
      expect(result).toHaveProperty('goods');
      expect(result).toHaveProperty('host');
      expect(result).toHaveProperty('maxAdults');
      expect(result).toHaveProperty('images');
    });

    it('should memoize result for same state', () => {
      const result1 = selectOfferInfo(mockState);
      const result2 = selectOfferInfo(mockState);

      expect(result1).toBe(result2);
    });

    it('should return new result when offerInfo changes', () => {
      const result1 = selectOfferInfo(mockState);

      const newOffer = { ...mockDetailedOffer, title: 'New Title' };
      const newState = createMockState(newOffer, [mockNearbyOffer], [mockReview]);
      const result2 = selectOfferInfo(newState);

      expect(result1).not.toBe(result2);
      expect(result2?.title).toBe('New Title');
    });

    it('should not recompute if other parts of state change', () => {
      const result1 = selectOfferInfo(mockState);

      // Изменяем другую часть state, но не currentOffer
      const newState = {
        ...mockState,
        sortOption: SortOption.PriceHighToLow,
      } as State;

      const result2 = selectOfferInfo(newState);

      expect(result1).toBe(result2);
    });
  });

  describe('selectNearbyOffers', () => {
    it('should select nearestOffers from currentOffer', () => {
      const result = selectNearbyOffers(mockState);

      expect(result).toEqual([mockNearbyOffer]);
    });

    it('should return empty array when no nearby offers', () => {
      const stateWithEmpty = createMockState(mockDetailedOffer, [], [mockReview]);
      const result = selectNearbyOffers(stateWithEmpty);

      expect(result).toEqual([]);
    });

    it('should return all nearby offers', () => {
      const nearbyOffers = [
        mockNearbyOffer,
        { ...mockNearbyOffer, id: '3', title: 'Another nearby' },
        { ...mockNearbyOffer, id: '4', title: 'Third nearby' },
      ];
      const stateWithMultiple = createMockState(
        mockDetailedOffer,
        nearbyOffers,
        [mockReview]
      );
      const result = selectNearbyOffers(stateWithMultiple);

      expect(result).toHaveLength(3);
      expect(result).toEqual(nearbyOffers);
    });

    it('should memoize result for same state', () => {
      const result1 = selectNearbyOffers(mockState);
      const result2 = selectNearbyOffers(mockState);

      expect(result1).toBe(result2);
    });

    it('should return new result when nearestOffers change', () => {
      const result1 = selectNearbyOffers(mockState);

      const newNearbyOffers = [
        { ...mockNearbyOffer, title: 'Updated nearby' },
      ];
      const newState = createMockState(
        mockDetailedOffer,
        newNearbyOffers,
        [mockReview]
      );
      const result2 = selectNearbyOffers(newState);

      expect(result1).not.toBe(result2);
      expect(result2[0].title).toBe('Updated nearby');
    });
  });

  describe('selectReviews', () => {
    it('should select reviews from currentOffer', () => {
      const result = selectReviews(mockState);

      expect(result).toEqual([mockReview]);
    });

    it('should return empty array when no reviews', () => {
      const stateWithEmpty = createMockState(
        mockDetailedOffer,
        [mockNearbyOffer],
        []
      );
      const result = selectReviews(stateWithEmpty);

      expect(result).toEqual([]);
    });

    it('should return all reviews', () => {
      const reviews = [
        mockReview,
        { ...mockReview, id: '2', comment: 'Another review', rating: 4 },
        { ...mockReview, id: '3', comment: 'Third review', rating: 3 },
      ];
      const stateWithMultiple = createMockState(
        mockDetailedOffer,
        [mockNearbyOffer],
        reviews
      );
      const result = selectReviews(stateWithMultiple);

      expect(result).toHaveLength(3);
      expect(result).toEqual(reviews);
    });

    it('should memoize result for same state', () => {
      const result1 = selectReviews(mockState);
      const result2 = selectReviews(mockState);

      expect(result1).toBe(result2);
    });

    it('should return new result when reviews change', () => {
      const result1 = selectReviews(mockState);

      const newReviews = [{ ...mockReview, comment: 'Updated review' }];
      const newState = createMockState(
        mockDetailedOffer,
        [mockNearbyOffer],
        newReviews
      );
      const result2 = selectReviews(newState);

      expect(result1).not.toBe(result2);
      expect(result2[0].comment).toBe('Updated review');
    });
  });

  describe('Selectors Integration', () => {
    it('should work together correctly', () => {
      const currentOffer = selectCurrentOffer(mockState);
      const offerInfo = selectOfferInfo(mockState);
      const nearbyOffers = selectNearbyOffers(mockState);
      const reviews = selectReviews(mockState);

      expect(currentOffer.offerInfo).toBe(offerInfo);
      expect(currentOffer.nearestOffers).toBe(nearbyOffers);
      expect(currentOffer.reviews).toBe(reviews);
    });

    it('should maintain consistency across selectors', () => {
      const offerInfo = selectOfferInfo(mockState);
      const nearbyOffers = selectNearbyOffers(mockState);
      const reviews = selectReviews(mockState);

      expect(offerInfo).toEqual(mockDetailedOffer);
      expect(nearbyOffers).toEqual([mockNearbyOffer]);
      expect(reviews).toEqual([mockReview]);
    });

    it('should handle complete state changes', () => {
      const newDetailedOffer = { ...mockDetailedOffer, title: 'New offer' };
      const newNearby = [{ ...mockNearbyOffer, id: '5' }];
      const newReviews = [{ ...mockReview, id: '6' }];

      const newState = createMockState(newDetailedOffer, newNearby, newReviews);

      expect(selectOfferInfo(newState)).toBe(newDetailedOffer);
      expect(selectNearbyOffers(newState)).toBe(newNearby);
      expect(selectReviews(newState)).toBe(newReviews);
    });
  });

  describe('Memoization Performance', () => {
    it('should not recompute selectOfferInfo on unrelated state changes', () => {
      const result1 = selectOfferInfo(mockState);

      const stateWithDifferentAuth = {
        ...mockState,
        authStatus: AuthStatus.Auth,
      } as State;

      const result2 = selectOfferInfo(stateWithDifferentAuth);

      expect(result1).toBe(result2);
    });

    it('should not recompute selectNearbyOffers on unrelated state changes', () => {
      const result1 = selectNearbyOffers(mockState);

      const stateWithDifferentSort = {
        ...mockState,
        sortOption: SortOption.TopRatedFirst,
      } as State;

      const result2 = selectNearbyOffers(stateWithDifferentSort);

      expect(result1).toBe(result2);
    });

    it('should not recompute selectReviews on unrelated state changes', () => {
      const result1 = selectReviews(mockState);

      const stateWithDifferentOffers = {
        ...mockState,
        offers: [mockNearbyOffer],
      } as State;

      const result2 = selectReviews(stateWithDifferentOffers);

      expect(result1).toBe(result2);
    });
  });
});
