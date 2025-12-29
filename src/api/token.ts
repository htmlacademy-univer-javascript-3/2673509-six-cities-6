import { API_TOKEN_KEY } from '../constants';
import { APIToken } from '../internal/types/api-token.tsx';

export const getAPIToken = (): APIToken => localStorage.getItem(API_TOKEN_KEY) || '';

export const setToken = (token: APIToken): void => {
  localStorage.setItem(API_TOKEN_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(API_TOKEN_KEY);
};
