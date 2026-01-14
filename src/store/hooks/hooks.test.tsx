import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from './hooks';

const mockReducer = (state = { value: 0 }, action: { type: string; payload?: number }) => {
  switch (action.type) {
    case 'INCREMENT':
      return { value: state.value + 1 };
    case 'SET_VALUE':
      return { value: action.payload || 0 };
    default:
      return state;
  }
};

const createWrapper = (initialState = { value: 0 }) => {
  const testStore = configureStore({
    reducer: mockReducer,
    preloadedState: initialState,
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={testStore}>{children}</Provider>;
  }

  Wrapper.displayName = 'TestWrapper';

  return Wrapper;
};

describe('Redux Hooks', () => {
  describe('useAppDispatch', () => {
    it('should return dispatch function', () => {
      const { result } = renderHook(() => useAppDispatch(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBeInstanceOf(Function);
    });

    it('should dispatch actions correctly', () => {
      const testStore = configureStore({
        reducer: mockReducer,
      });

      function Wrapper({ children }: { children: React.ReactNode }) {
        return <Provider store={testStore}>{children}</Provider>;
      }
      Wrapper.displayName = 'DispatchTestWrapper';

      const { result } = renderHook(() => useAppDispatch(), { wrapper: Wrapper });

      act(() => {
        result.current({ type: 'INCREMENT' });
      });

      expect(testStore.getState().value).toBe(1);
    });

    it('should dispatch multiple actions', () => {
      const testStore = configureStore({
        reducer: mockReducer,
      });

      function Wrapper({ children }: { children: React.ReactNode }) {
        return <Provider store={testStore}>{children}</Provider>;
      }
      Wrapper.displayName = 'MultipleDispatchTestWrapper';

      const { result } = renderHook(() => useAppDispatch(), { wrapper: Wrapper });

      act(() => {
        result.current({ type: 'INCREMENT' });
        result.current({ type: 'INCREMENT' });
        result.current({ type: 'INCREMENT' });
      });

      expect(testStore.getState().value).toBe(3);
    });

    it('should dispatch actions with payload', () => {
      const testStore = configureStore({
        reducer: mockReducer,
      });

      function Wrapper({ children }: { children: React.ReactNode }) {
        return <Provider store={testStore}>{children}</Provider>;
      }
      Wrapper.displayName = 'PayloadDispatchTestWrapper';

      const { result } = renderHook(() => useAppDispatch(), { wrapper: Wrapper });

      act(() => {
        result.current({ type: 'SET_VALUE', payload: 42 });
      });

      expect(testStore.getState().value).toBe(42);
    });
  });

  describe('useAppSelector', () => {
    it('should select state from store', () => {
      const { result } = renderHook(
        () => useAppSelector((state) => state.value),
        {
          wrapper: createWrapper({ value: 10 }),
        }
      );

      expect(result.current).toBe(10);
    });

    it('should select different initial state values', () => {
      const { result } = renderHook(
        () => useAppSelector((state) => state.value),
        {
          wrapper: createWrapper({ value: 100 }),
        }
      );

      expect(result.current).toBe(100);
    });

    it('should select specific state property', () => {
      const { result } = renderHook(
        () => useAppSelector((state) => state.value),
        {
          wrapper: createWrapper({ value: 25 }),
        }
      );

      expect(result.current).toBe(25);
    });

    it('should update when state changes', () => {
      const testStore = configureStore({
        reducer: mockReducer,
        preloadedState: { value: 0 },
      });

      function Wrapper({ children }: { children: React.ReactNode }) {
        return <Provider store={testStore}>{children}</Provider>;
      }
      Wrapper.displayName = 'UpdateTestWrapper';

      const { result } = renderHook(
        () => useAppSelector((state) => state.value),
        { wrapper: Wrapper }
      );

      expect(result.current).toBe(0);

      act(() => {
        testStore.dispatch({ type: 'INCREMENT' });
      });

      expect(result.current).toBe(1);
    });

    it('should handle multiple state updates', () => {
      const testStore = configureStore({
        reducer: mockReducer,
        preloadedState: { value: 0 },
      });

      function Wrapper({ children }: { children: React.ReactNode }) {
        return <Provider store={testStore}>{children}</Provider>;
      }
      Wrapper.displayName = 'MultipleUpdateTestWrapper';

      const { result } = renderHook(
        () => useAppSelector((state) => state.value),
        { wrapper: Wrapper }
      );

      act(() => {
        testStore.dispatch({ type: 'INCREMENT' });
      });
      expect(result.current).toBe(1);

      act(() => {
        testStore.dispatch({ type: 'INCREMENT' });
      });
      expect(result.current).toBe(2);

      act(() => {
        testStore.dispatch({ type: 'SET_VALUE', payload: 50 });
      });
      expect(result.current).toBe(50);
    });
  });

  describe('useAppDispatch and useAppSelector together', () => {
    it('should work together to dispatch and select state', () => {
      const testStore = configureStore({
        reducer: mockReducer,
        preloadedState: { value: 0 },
      });

      function Wrapper({ children }: { children: React.ReactNode }) {
        return <Provider store={testStore}>{children}</Provider>;
      }
      Wrapper.displayName = 'CombinedTestWrapper';

      const { result: dispatchResult } = renderHook(() => useAppDispatch(), {
        wrapper: Wrapper,
      });

      const { result: selectorResult } = renderHook(
        () => useAppSelector((state) => state.value),
        { wrapper: Wrapper }
      );

      expect(selectorResult.current).toBe(0);

      act(() => {
        dispatchResult.current({ type: 'INCREMENT' });
      });

      expect(selectorResult.current).toBe(1);
    });

    it('should handle complex state operations', () => {
      const testStore = configureStore({
        reducer: mockReducer,
        preloadedState: { value: 0 },
      });

      function Wrapper({ children }: { children: React.ReactNode }) {
        return <Provider store={testStore}>{children}</Provider>;
      }
      Wrapper.displayName = 'ComplexOperationsTestWrapper';

      const { result: dispatchResult } = renderHook(() => useAppDispatch(), {
        wrapper: Wrapper,
      });

      const { result: selectorResult } = renderHook(
        () => useAppSelector((state) => state.value),
        { wrapper: Wrapper }
      );

      act(() => {
        dispatchResult.current({ type: 'INCREMENT' });
        dispatchResult.current({ type: 'INCREMENT' });
        dispatchResult.current({ type: 'SET_VALUE', payload: 100 });
      });

      expect(selectorResult.current).toBe(100);
    });
  });

  describe('Type safety', () => {
    it('should provide typed dispatch', () => {
      const { result } = renderHook(() => useAppDispatch(), {
        wrapper: createWrapper(),
      });

      const dispatch = result.current;

      act(() => {
        dispatch({ type: 'INCREMENT' });
      });

      expect(dispatch).toBeInstanceOf(Function);
    });

    it('should provide typed selector', () => {
      const { result } = renderHook(
        () => useAppSelector((state) => state.value),
        {
          wrapper: createWrapper({ value: 42 }),
        }
      );

      expect(typeof result.current).toBe('number');
      expect(result.current).toBe(42);
    });
  });

  describe('Error handling', () => {
    it('should throw error when useAppDispatch is used outside Provider', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useAppDispatch());
      }).toThrow();

      consoleError.mockRestore();
    });

    it('should throw error when useAppSelector is used outside Provider', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useAppSelector((state) => state.value));
      }).toThrow();

      consoleError.mockRestore();
    });
  });
});
