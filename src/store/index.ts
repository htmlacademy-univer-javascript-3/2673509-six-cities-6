import { configureStore } from '@reduxjs/toolkit';
import { reducer } from './reducer/reducer.ts';
import { createAPI } from '../api/api.ts';

export const api = createAPI();
export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: api,
      },
    }),
});

export type AppDispatch = typeof store.dispatch;
export type State = ReturnType<typeof store.getState>;
