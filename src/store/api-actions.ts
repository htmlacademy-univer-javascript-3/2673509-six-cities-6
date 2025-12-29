import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import {fetchOffers, redirectToRoute, sendReview, setAuthStatus, setError} from './actions.ts';
import {APIRoute} from '../internal/enums/api-route-enum.tsx';
import {setIsFetchOffers} from './actions.ts';
import {Offer} from '../internal/types/offer-type.tsx';
import {AuthStatus} from '../internal/enums/auth-status-enum.tsx';
import {AuthInfo} from '../internal/types/auth-info.tsx';
import {UserAuthInfo} from '../internal/types/user-auth-info.tsx';
import {removeToken, setToken} from '../api/token.ts';
import {AppRouteEnum} from '../internal/enums/app-route-enum.tsx';
import {DetailedOffer} from '../internal/types/detailed-offer-type.tsx';
import {ReviewType} from '../internal/types/review-type.tsx';
import {CommentInfo} from '../internal/types/comment-info.tsx';
import { AppDispatch, State } from './index.ts';

export const getOffers = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'offer/getOffers',
  async (_, { dispatch, extra: api }) => {
    dispatch(setIsFetchOffers(true));
    try {
      const response = await api.get<Offer[]>(APIRoute.Offers);
      dispatch(fetchOffers(response.data));
    } finally {
      dispatch(setIsFetchOffers(false));
    }
  }
);

export const getOfferInfoAction = createAsyncThunk<
  { offerInfo: DetailedOffer; nearestOffers: Offer[]; reviews: ReviewType[] }, // Определяем возвращаемый тип
  { id: string },
  {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
    rejectValue: string;
  }
>(
  'offer/getOfferInfoAction',
  async ({ id }, { extra: api, rejectWithValue }) => {
    try {
      const { data: offerInfo } = await api.get<DetailedOffer>(`${APIRoute.Offers}/${id}`);
      const { data: nearestOffers } = await api.get<Offer[]>(`${APIRoute.Offers}/${id}/nearby`);
      const { data: reviews } = await api.get<ReviewType[]>(`${APIRoute.Comments}/${id}`);
      return { offerInfo, nearestOffers, reviews };
    } catch (error) {
      return rejectWithValue('Offer not found');
    }
  }
);

export const sendReviewAction = createAsyncThunk<
  void,
  { comment: CommentInfo; id: string },
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>('review/sendReviewAction', async ({ comment, id }, { dispatch, extra: api }) => {
  const { data: review } = await api.post<ReviewType>(`${APIRoute.Comments}/${id}`,
    {
      comment: comment.comment,
      rating: comment.rating,
    });
  dispatch(sendReview(review));
});

export const addFavouriteAction = createAsyncThunk<DetailedOffer, {offerId: string | undefined; status: 0 | 1}, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'user/addFavourite',
  async ({offerId, status}, {extra: api}) => {
    const {data} = await api.post<DetailedOffer>(`/favorite/${offerId}/${status}`);
    return data;
  }
);

export const checkAuth = createAsyncThunk<
  void,
  undefined,
  {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }
>('user/checkAuth', async (_arg, { dispatch, extra: api }) => {
  try {
    await api.get(APIRoute.Login);
    dispatch(setAuthStatus(AuthStatus.Auth));
  } catch {
    dispatch(setAuthStatus(AuthStatus.NoAuth));
  }
});

export const loginAction = createAsyncThunk<
  void,
  AuthInfo,
  {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }
>('user/login', async (payload, { dispatch, extra: api }) => {
  const {
    data: { token },
  } = await api.post<UserAuthInfo>(APIRoute.Login, payload);
  setToken(token);
  dispatch(setAuthStatus(AuthStatus.Auth));
  dispatch(redirectToRoute(AppRouteEnum.MainPage));
});

export const logoutAction = createAsyncThunk<
  void,
  undefined,
  {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }
>('user/logout', async (_arg, { dispatch, extra: api }) => {
  await api.delete(APIRoute.Logout);
  removeToken();
  dispatch(setAuthStatus(AuthStatus.NoAuth));
  dispatch(redirectToRoute(AppRouteEnum.MainPage));
});

export const deleteError = createAsyncThunk<void, undefined, {dispatch: AppDispatch}>(
  'deleteError',
  (_arg, { dispatch }) => {
    setTimeout(() => dispatch(setError(null)), 2000);
  }
);
