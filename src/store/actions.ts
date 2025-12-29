import { createAction } from '@reduxjs/toolkit';
import { Offer } from '../internal/types/offer-type.tsx';
import { CityName } from '../internal/enums/city-name-enum.tsx';
import { SortOption } from '../internal/enums/sort-option-enum.tsx';
import { AuthStatus } from '../internal/enums/auth-status-enum.tsx';
import {ReviewType} from '../internal/types/review-type.tsx';
import {OfferInfo} from '../internal/types/offer-info.tsx';

export const fillCityOffersList = createAction<Offer[]>('FillCityOfferList');
export const changeCity = createAction<CityName>('ChangeCity');
export const setSortOption = createAction<SortOption>('SetSortOption');
export const setAuthStatus = createAction<AuthStatus>('SetAuthStatus');
export const setError = createAction<string | null>('SetError');
export const fetchOffers = createAction<Offer[]>('FetchOffers');
export const setIsFetchOffers = createAction<boolean>('SetIsFetchOffers');
export const redirectToRoute = createAction<string>('RedirectToRoute');
export const getOfferInfo = createAction<OfferInfo>('GetOfferInfo');
export const sendReview = createAction<ReviewType>('SendReview');
