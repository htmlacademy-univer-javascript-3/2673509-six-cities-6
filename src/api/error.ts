import {store} from '../store';
import {setError} from '../store/actions.ts';
import {deleteError} from '../store/api-actions.ts';

export interface ErrorResponse {
  type: string;
  message: string;
}

export const handleError = (errorMessage: string): void => {
  store.dispatch(setError(errorMessage));
  store.dispatch(deleteError());
};

export const isErrorStatus = (status: number) => status.toString().startsWith('4');
