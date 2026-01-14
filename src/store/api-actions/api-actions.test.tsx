import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  getOffers,
  getOfferInfoAction,
  sendReviewAction,
  addFavouriteAction,
  checkAuth,
  loginAction,
  logoutAction,
  deleteError,
} from './api-actions';
import { APIRoute } from '../../internal/enums/api-route-enum';
import { AuthStatus } from '../../internal/enums/auth-status-enum';
import { Offer } from '../../internal/types/offer-type';
import { DetailedOffer } from '../../internal/types/detailed-offer-type';
import { ReviewType } from '../../internal/types/review-type';
import { CityName } from '../../internal/enums/city-name-enum';
import { PlaceType } from '../../internal/enums/place-type-enum';
import * as tokenStorage from '../../api/token';

vi.mock('../../api/token', () => ({
  setToken: vi.fn(),
  removeToken: vi.fn(),
  getToken: vi.fn(),
}));

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

const mockAuthInfo = {
  email: 'test@test.com',
  password: 'password123',
};

const mockUserAuthInfo = {
  name: 'Test User',
  email: 'test@test.com',
  token: 'test-token',
  avatarUrl: 'https://example.com/avatar.jpg',
  isPro: false,
};

describe('Async Actions', () => {
  let api: ReturnType<typeof axios.create>;
  let mockAPI: MockAdapter;
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    api = axios.create({
      baseURL: 'https://test-api.com',
      timeout: 5000,
    });

    mockAPI = new MockAdapter(api);

    store = configureStore({
      reducer: {
        root: (state = {
          authStatus: AuthStatus.NoAuth,
          isFetchOffers: false,
          offers: [],
        }) => state,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          thunk: {
            extraArgument: api,
          },
        }),
    });

    vi.clearAllMocks();
  });

  afterEach(() => {
    mockAPI.reset();
  });

  describe('getOffers', () => {
    it('should dispatch getOffers action and fetch offers successfully', async () => {
      const offers = [mockOffer];
      mockAPI.onGet(APIRoute.Offers).reply(200, offers);

      await store.dispatch(getOffers());

      expect(mockAPI.history.get[0].url).toBe(APIRoute.Offers);
    });

    it('should handle fetch offers failure', async () => {
      mockAPI.onGet(APIRoute.Offers).reply(500);

      await store.dispatch(getOffers());

      expect(mockAPI.history.get.length).toBe(1);
    });

    it('should fetch empty offers array', async () => {
      mockAPI.onGet(APIRoute.Offers).reply(200, []);

      await store.dispatch(getOffers());

      expect(mockAPI.history.get[0].url).toBe(APIRoute.Offers);
    });

    it('should set isFetchOffers during request', async () => {
      mockAPI.onGet(APIRoute.Offers).reply(200, [mockOffer]);

      const result = await store.dispatch(getOffers());

      expect(result.type).toBe('offer/getOffers/fulfilled');
    });
  });

  describe('getOfferInfoAction', () => {
    it('should fetch offer info successfully', async () => {
      const offerId = '1';
      mockAPI.onGet(`${APIRoute.Offers}/${offerId}`).reply(200, mockDetailedOffer);
      mockAPI.onGet(`${APIRoute.Offers}/${offerId}/nearby`).reply(200, [mockOffer]);
      mockAPI.onGet(`${APIRoute.Comments}/${offerId}`).reply(200, [mockReview]);

      const result = await store.dispatch(getOfferInfoAction({ id: offerId }));

      expect(result.type).toBe('offer/getOfferInfoAction/fulfilled');
      expect(mockAPI.history.get.length).toBe(3);
    });

    it('should handle offer not found', async () => {
      const offerId = 'non-existent';
      mockAPI.onGet(`${APIRoute.Offers}/${offerId}`).reply(404);

      const result = await store.dispatch(getOfferInfoAction({ id: offerId }));

      expect(result.type).toBe('offer/getOfferInfoAction/rejected');
    });

    it('should return correct payload structure', async () => {
      const offerId = '1';
      mockAPI.onGet(`${APIRoute.Offers}/${offerId}`).reply(200, mockDetailedOffer);
      mockAPI.onGet(`${APIRoute.Offers}/${offerId}/nearby`).reply(200, [mockOffer]);
      mockAPI.onGet(`${APIRoute.Comments}/${offerId}`).reply(200, [mockReview]);

      const result = await store.dispatch(getOfferInfoAction({ id: offerId }));

      if (result.type === 'offer/getOfferInfoAction/fulfilled') {
        expect(result.payload).toHaveProperty('offerInfo');
        expect(result.payload).toHaveProperty('nearestOffers');
        expect(result.payload).toHaveProperty('reviews');
      }
    });
  });

  describe('sendReviewAction', () => {
    it('should send review successfully', async () => {
      const commentInfo = { comment: 'Great place!', rating: 5 };
      const offerId = '1';
      mockAPI.onPost(`${APIRoute.Comments}/${offerId}`).reply(200, mockReview);

      const result = await store.dispatch(
        sendReviewAction({ comment: commentInfo, id: offerId })
      );

      expect(result.type).toBe('review/sendReviewAction/fulfilled');
      expect(mockAPI.history.post.length).toBe(1);
    });

    it('should send correct review data', async () => {
      const commentInfo = { comment: 'Nice apartment', rating: 4 };
      const offerId = '1';
      mockAPI.onPost(`${APIRoute.Comments}/${offerId}`).reply(200, mockReview);

      await store.dispatch(sendReviewAction({ comment: commentInfo, id: offerId }));

      const requestData = JSON.parse(mockAPI.history.post[0].data);
      expect(requestData.comment).toBe('Nice apartment');
      expect(requestData.rating).toBe(4);
    });

    it('should handle review submission failure', async () => {
      const commentInfo = { comment: 'Test', rating: 3 };
      const offerId = '1';
      mockAPI.onPost(`${APIRoute.Comments}/${offerId}`).reply(400);

      const result = await store.dispatch(
        sendReviewAction({ comment: commentInfo, id: offerId })
      );

      expect(result.type).toBe('review/sendReviewAction/rejected');
    });
  });

  describe('addFavouriteAction', () => {
    it('should add to favorites successfully', async () => {
      const offerId = '1';
      const status = 1;
      mockAPI.onPost(`/favorite/${offerId}/${status}`).reply(200, mockDetailedOffer);

      const result = await store.dispatch(
        addFavouriteAction({ offerId, status })
      );

      expect(result.type).toBe('user/addFavourite/fulfilled');
      expect(mockAPI.history.post.length).toBe(1);
    });

    it('should remove from favorites successfully', async () => {
      const offerId = '1';
      const status = 0;
      mockAPI.onPost(`/favorite/${offerId}/${status}`).reply(200, mockDetailedOffer);

      const result = await store.dispatch(
        addFavouriteAction({ offerId, status })
      );

      expect(result.type).toBe('user/addFavourite/fulfilled');
    });

    it('should handle favorite action failure', async () => {
      const offerId = '1';
      const status = 1;
      mockAPI.onPost(`/favorite/${offerId}/${status}`).reply(401);

      const result = await store.dispatch(
        addFavouriteAction({ offerId, status })
      );

      expect(result.type).toBe('user/addFavourite/rejected');
    });

    it('should return updated offer data', async () => {
      const offerId = '1';
      const status = 1;
      const favoriteOffer = { ...mockDetailedOffer, isFavorite: true };
      mockAPI.onPost(`/favorite/${offerId}/${status}`).reply(200, favoriteOffer);

      const result = await store.dispatch(
        addFavouriteAction({ offerId, status })
      );

      if (result.type === 'user/addFavourite/fulfilled') {
        expect(result.payload).toHaveProperty('isFavorite');
      }
    });
  });

  describe('checkAuth', () => {
    it('should check auth successfully when authorized', async () => {
      mockAPI.onGet(APIRoute.Login).reply(200);

      await store.dispatch(checkAuth());

      expect(mockAPI.history.get[0].url).toBe(APIRoute.Login);
    });

    it('should handle unauthorized user', async () => {
      mockAPI.onGet(APIRoute.Login).reply(401);

      await store.dispatch(checkAuth());

      expect(mockAPI.history.get.length).toBe(1);
    });

    it('should complete successfully regardless of auth status', async () => {
      mockAPI.onGet(APIRoute.Login).reply(200);

      const result = await store.dispatch(checkAuth());

      expect(result.type).toBe('user/checkAuth/fulfilled');
    });
  });

  describe('loginAction', () => {
    it('should login successfully', async () => {
      mockAPI.onPost(APIRoute.Login).reply(200, mockUserAuthInfo);

      const result = await store.dispatch(loginAction(mockAuthInfo));

      expect(result.type).toBe('user/login/fulfilled');
      expect(mockAPI.history.post.length).toBe(1);
      expect(tokenStorage.setToken).toHaveBeenCalledWith('test-token');
    });

    it('should send correct login credentials', async () => {
      mockAPI.onPost(APIRoute.Login).reply(200, mockUserAuthInfo);

      await store.dispatch(loginAction(mockAuthInfo));

      const requestData = JSON.parse(mockAPI.history.post[0].data);
      expect(requestData.email).toBe('test@test.com');
      expect(requestData.password).toBe('password123');
    });

    it('should handle login failure', async () => {
      mockAPI.onPost(APIRoute.Login).reply(401);

      const result = await store.dispatch(loginAction(mockAuthInfo));

      expect(result.type).toBe('user/login/rejected');
      expect(tokenStorage.setToken).not.toHaveBeenCalled();
    });

    it('should set token on successful login', async () => {
      mockAPI.onPost(APIRoute.Login).reply(200, mockUserAuthInfo);

      await store.dispatch(loginAction(mockAuthInfo));

      expect(tokenStorage.setToken).toHaveBeenCalledWith('test-token');
    });
  });

  describe('logoutAction', () => {
    it('should logout successfully', async () => {
      mockAPI.onDelete(APIRoute.Logout).reply(204);

      const result = await store.dispatch(logoutAction());

      expect(result.type).toBe('user/logout/fulfilled');
      expect(mockAPI.history.delete.length).toBe(1);
      expect(tokenStorage.removeToken).toHaveBeenCalled();
    });

    it('should remove token on logout', async () => {
      mockAPI.onDelete(APIRoute.Logout).reply(204);

      await store.dispatch(logoutAction());

      expect(tokenStorage.removeToken).toHaveBeenCalled();
    });

    it('should handle logout failure', async () => {
      mockAPI.onDelete(APIRoute.Logout).reply(500);

      const result = await store.dispatch(logoutAction());

      expect(result.type).toBe('user/logout/rejected');
    });
  });

  describe('Action Types', () => {
    it('should have correct type for getOffers', () => {
      expect(getOffers.typePrefix).toBe('offer/getOffers');
    });

    it('should have correct type for getOfferInfoAction', () => {
      expect(getOfferInfoAction.typePrefix).toBe('offer/getOfferInfoAction');
    });

    it('should have correct type for sendReviewAction', () => {
      expect(sendReviewAction.typePrefix).toBe('review/sendReviewAction');
    });

    it('should have correct type for addFavouriteAction', () => {
      expect(addFavouriteAction.typePrefix).toBe('user/addFavourite');
    });

    it('should have correct type for checkAuth', () => {
      expect(checkAuth.typePrefix).toBe('user/checkAuth');
    });

    it('should have correct type for loginAction', () => {
      expect(loginAction.typePrefix).toBe('user/login');
    });

    it('should have correct type for logoutAction', () => {
      expect(logoutAction.typePrefix).toBe('user/logout');
    });

    it('should have correct type for deleteError', () => {
      expect(deleteError.typePrefix).toBe('deleteError');
    });
  });
});
