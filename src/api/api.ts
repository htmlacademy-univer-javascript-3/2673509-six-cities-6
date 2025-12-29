import axios, {AxiosError, AxiosInstance } from 'axios';
import {getAPIToken} from './token.ts';
import {API_TIMEOUT, API_URL} from '../constants';
import {ErrorResponse, handleError, isErrorStatus} from './error.ts';


export const createAPI = (): AxiosInstance => {
  const api = axios.create({
    baseURL: API_URL,
    timeout: API_TIMEOUT,
  });
  api.interceptors.request.use((config) => {
    const apiToken = getAPIToken();
    if (apiToken && config.headers) {
      config.headers['X-Token'] = apiToken;
    }
    return config;
  });
  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ErrorResponse>) => {
      if (error.response && isErrorStatus(error.response.status)) {
        const { message } = error.response.data;
        handleError(message);
      }
      return Promise.reject(error);
    }
  );
  return api;
};
