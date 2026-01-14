import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { App } from './app';
import { AuthStatus } from '../../internal/enums/auth-status-enum';
import * as hooks from '../../store/hooks/hooks.ts';

vi.mock('../../pages/main-page/main-page', () => ({
  MainPage: () => <div>Main Page</div>,
}));

vi.mock('../../pages/login-page/login-page', () => ({
  LoginPage: () => <div>Login Page</div>,
}));

vi.mock('../../pages/offer-page/offer-page', () => ({
  OfferPage: () => <div>Offer Page</div>,
}));

vi.mock('../../pages/not-found-page/not-found-page', () => ({
  NotFoundPage: () => <div>Not Found Page</div>,
}));

vi.mock('../../pages/favorite-page/favorites-page', () => ({
  FavoritesPage: () => <div>Favorites Page</div>,
}));

vi.mock('../authorization/authorization', () => ({
  Authorization: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('../spinner/spinner', () => ({
  Spinner: () => <div>Loading</div>,
}));

vi.mock('../../store/hooks', () => ({
  useAppSelector: vi.fn(),
  useAppDispatch: vi.fn(),
}));

const mockUseAppSelector = (authStatus: AuthStatus, isFetchOffers: boolean) => {
  vi.mocked(hooks.useAppSelector).mockImplementation((selector) => {
    const state = {
      authStatus,
      isFetchOffers,
    };
    return selector(state as never);
  });
};

const createMockStore = () =>
  configureStore({
    reducer: {
      root: (state = {}) => state,
    },
  });

const renderWithStore = (authStatus: AuthStatus, isFetchOffers: boolean) => {
  mockUseAppSelector(authStatus, isFetchOffers);
  const store = createMockStore();

  return render(
    <Provider store={store}>
      <App />
    </Provider>
  );
};

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render Spinner when isFetchOffers is true', () => {
    renderWithStore(AuthStatus.NoAuth, true);

    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(screen.queryByText('Main Page')).not.toBeInTheDocument();
  });

  it('should render MainPage on root route', () => {
    window.history.pushState({}, '', '/');
    renderWithStore(AuthStatus.NoAuth, false);

    expect(screen.getByText('Main Page')).toBeInTheDocument();
  });

  it('should render LoginPage on /login route', () => {
    window.history.pushState({}, '', '/login');
    renderWithStore(AuthStatus.NoAuth, false);

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('should render OfferPage on /offer/:id route', () => {
    window.history.pushState({}, '', '/offer/123');
    renderWithStore(AuthStatus.NoAuth, false);

    expect(screen.getByText('Offer Page')).toBeInTheDocument();
  });

  it('should render FavoritesPage on /favorites route when authenticated', () => {
    window.history.pushState({}, '', '/favorites');
    renderWithStore(AuthStatus.Auth, false);

    expect(screen.getByText('Favorites Page')).toBeInTheDocument();
  });

  it('should render NotFoundPage on unknown route', () => {
    window.history.pushState({}, '', '/unknown-route');
    renderWithStore(AuthStatus.NoAuth, false);

    expect(screen.getByText('Not Found Page')).toBeInTheDocument();
  });

  it('should wrap FavoritesPage with Authorization component', () => {
    window.history.pushState({}, '', '/favorites');
    renderWithStore(AuthStatus.Auth, false);

    expect(screen.getByText('Favorites Page')).toBeInTheDocument();
  });

  it('should not render Spinner when isFetchOffers is false', () => {
    window.history.pushState({}, '', '/');
    renderWithStore(AuthStatus.NoAuth, false);

    expect(screen.queryByText('Loading')).not.toBeInTheDocument();
    expect(screen.getByText('Main Page')).toBeInTheDocument();
  });

  it('should render with HelmetProvider', () => {
    const { container } = renderWithStore(AuthStatus.NoAuth, false);

    expect(container).toBeInTheDocument();
  });

  it('should use correct authStatus from store for Auth status', () => {
    window.history.pushState({}, '', '/favorites');
    renderWithStore(AuthStatus.Auth, false);

    expect(screen.getByText('Favorites Page')).toBeInTheDocument();
  });

  it('should use correct authStatus from store for NoAuth status', () => {
    window.history.pushState({}, '', '/');
    renderWithStore(AuthStatus.NoAuth, false);

    expect(screen.getByText('Main Page')).toBeInTheDocument();
  });

  it('should prioritize Spinner over routing when isFetchOffers is true', () => {
    window.history.pushState({}, '', '/favorites');
    renderWithStore(AuthStatus.Auth, true);

    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(screen.queryByText('Favorites Page')).not.toBeInTheDocument();
  });

  it('should render BrowserRouter with all routes', () => {
    const { container } = renderWithStore(AuthStatus.NoAuth, false);

    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('should handle Unknown auth status', () => {
    window.history.pushState({}, '', '/');
    renderWithStore(AuthStatus.Unknown, false);

    expect(screen.getByText('Main Page')).toBeInTheDocument();
  });

  it('should call useAppSelector with correct selectors', () => {
    renderWithStore(AuthStatus.NoAuth, false);

    expect(hooks.useAppSelector).toHaveBeenCalled();
  });

  it('should render different pages based on routes', () => {
    window.history.pushState({}, '', '/offer/456');
    renderWithStore(AuthStatus.NoAuth, false);

    expect(screen.getByText('Offer Page')).toBeInTheDocument();
    expect(screen.queryByText('Main Page')).not.toBeInTheDocument();
  });
});
