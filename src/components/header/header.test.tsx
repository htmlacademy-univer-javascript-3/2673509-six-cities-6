import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Header } from './header';
import { AuthStatus } from '../../internal/enums/auth-status-enum';
import { AppRouteEnum } from '../../internal/enums/app-route-enum';
import { Offer } from '../../internal/types/offer-type';
import { PlaceType } from '../../internal/enums/place-type-enum';
import { CityName } from '../../internal/enums/city-name-enum';

const mockDispatch = vi.fn();

vi.mock('../../store/api-actions', () => ({
  logoutAction: vi.fn(() => ({
    type: 'user/logout',
  })),
}));

vi.mock('../logo/logo', () => ({
  Logo: () => <div data-testid="logo">Logo Component</div>,
}));

const mockOffers: Offer[] = [
  {
    id: '1',
    title: 'Beautiful apartment',
    type: PlaceType.Apartment,
    price: 120,
    city: {
      name: CityName.Paris,
      location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
    },
    location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
    isFavorite: true,
    isBookmarked: true,
    isPremium: false,
    rating: 4.5,
    previewImage: 'https://example.com/image.jpg',
  },
  {
    id: '2',
    title: 'Nice house',
    type: PlaceType.House,
    price: 200,
    city: {
      name: CityName.Paris,
      location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
    },
    location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
    isFavorite: true,
    isBookmarked: true,
    isPremium: false,
    rating: 4.8,
    previewImage: 'https://example.com/image2.jpg',
  },
  {
    id: '3',
    title: 'Cozy room',
    type: PlaceType.Room,
    price: 80,
    city: {
      name: CityName.Paris,
      location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
    },
    location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
    isFavorite: false,
    isBookmarked: false,
    isPremium: false,
    rating: 4.0,
    previewImage: 'https://example.com/image3.jpg',
  },
];

const renderWithProviders = (
  authStatus: AuthStatus = AuthStatus.Auth,
  offers: Offer[] = mockOffers
) => {
  const mockStore = configureStore({
    reducer: {
      offers: () => offers,
      authStatus: () => authStatus,
    },
  });

  mockStore.dispatch = mockDispatch;

  return render(
    <Provider store={mockStore}>
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    </Provider>
  );
};

describe('Header Component', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });

  describe('Rendering', () => {
    it('should render header element', () => {
      const { container } = renderWithProviders();

      const header = container.querySelector('header.header');
      expect(header).toBeInTheDocument();
    });

    it('should render Logo component', () => {
      renderWithProviders();

      expect(screen.getByTestId('logo')).toBeInTheDocument();
    });

    it('should render navigation', () => {
      const { container } = renderWithProviders();

      const nav = container.querySelector('nav.header__nav');
      expect(nav).toBeInTheDocument();
    });
  });

  describe('Authentication - Authorized user', () => {
    it('should display user email when authorized', () => {
      renderWithProviders(AuthStatus.Auth);

      expect(screen.getByText('Oliver.conner@gmail.com')).toBeInTheDocument();
    });

    it('should display favorites count when authorized', () => {
      renderWithProviders(AuthStatus.Auth, mockOffers);

      const favoriteCount = screen.getByText('2');
      expect(favoriteCount).toBeInTheDocument();
      expect(favoriteCount).toHaveClass('header__favorite-count');
    });

    it('should display link to favorites page when authorized', () => {
      renderWithProviders(AuthStatus.Auth);

      const favoritesLink = screen.getByText('Oliver.conner@gmail.com').closest('a');
      expect(favoritesLink).toHaveAttribute('href', AppRouteEnum.FavoritesPage);
    });

    it('should display Sign out link when authorized', () => {
      renderWithProviders(AuthStatus.Auth);

      expect(screen.getByText('Sign out')).toBeInTheDocument();
    });

    it('should display avatar wrapper when authorized', () => {
      const { container } = renderWithProviders(AuthStatus.Auth);

      const avatarWrapper = container.querySelector('.header__avatar-wrapper');
      expect(avatarWrapper).toBeInTheDocument();
    });

    it('should render correct favorites count with zero favorites', () => {
      const offersWithoutFavorites = mockOffers.map((offer) => ({
        ...offer,
        isFavorite: false,
      }));

      renderWithProviders(AuthStatus.Auth, offersWithoutFavorites);

      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  describe('Authentication - Not authorized user', () => {
    it('should not display user email when not authorized', () => {
      renderWithProviders(AuthStatus.NoAuth);

      expect(screen.queryByText('Oliver.conner@gmail.com')).not.toBeInTheDocument();
    });

    it('should not display favorites count when not authorized', () => {
      const { container } = renderWithProviders(AuthStatus.NoAuth);

      const favoriteCount = container.querySelector('.header__favorite-count');
      expect(favoriteCount).not.toBeInTheDocument();
    });

    it('should not display link to favorites page when not authorized', () => {
      renderWithProviders(AuthStatus.NoAuth);

      const favoritesLink = screen.queryByText('Oliver.conner@gmail.com');
      expect(favoritesLink).not.toBeInTheDocument();
    });

    it('should display Sign in link when not authorized', () => {
      renderWithProviders(AuthStatus.NoAuth);

      expect(screen.getByText('Sign in')).toBeInTheDocument();
    });

    it('should have correct link to login page when not authorized', () => {
      renderWithProviders(AuthStatus.NoAuth);

      const signInLink = screen.getByText('Sign in').closest('a');
      expect(signInLink).toHaveAttribute('href', AppRouteEnum.LoginPage);
    });

    it('should not display avatar wrapper when not authorized', () => {
      const { container } = renderWithProviders(AuthStatus.NoAuth);

      const avatarWrapper = container.querySelector('.header__avatar-wrapper');
      expect(avatarWrapper).not.toBeInTheDocument();
    });
  });

  describe('User interactions', () => {
    it('should dispatch logoutAction when clicking Sign out', async () => {
      const user = userEvent.setup();
      const { logoutAction } = await import('../../store/api-actions/api-actions.ts');

      renderWithProviders(AuthStatus.Auth);

      const signOutLink = screen.getByText('Sign out').closest('a');

      await act(async () => {
        await user.click(signOutLink!);
      });

      expect(logoutAction).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalled();
    });

    it('should prevent default navigation when clicking Sign out', async () => {
      const user = userEvent.setup();
      renderWithProviders(AuthStatus.Auth);

      const signOutLink = screen.getByText('Sign out').closest('a');
      expect(signOutLink).toHaveAttribute('href', AppRouteEnum.MainPage);

      await act(async () => {
        await user.click(signOutLink!);
      });

      expect(mockDispatch).toHaveBeenCalled();
    });

    it('should navigate to favorites page when clicking on user profile', () => {
      renderWithProviders(AuthStatus.Auth);

      const profileLink = screen.getByText('Oliver.conner@gmail.com').closest('a');
      expect(profileLink).toHaveAttribute('href', AppRouteEnum.FavoritesPage);
    });
  });

  describe('CSS classes', () => {
    it('should have correct CSS classes for authorized user profile link', () => {
      const { container } = renderWithProviders(AuthStatus.Auth);

      const profileLink = container.querySelector('.header__nav-link--profile');
      expect(profileLink).toBeInTheDocument();
      expect(profileLink).toHaveClass('header__nav-link', 'header__nav-link--profile');
    });

    it('should have correct CSS class for user nav item', () => {
      const { container } = renderWithProviders(AuthStatus.Auth);

      const userNavItem = container.querySelector('.header__nav-item.user');
      expect(userNavItem).toBeInTheDocument();
    });

    it('should have correct CSS classes for sign out span', () => {
      const { container } = renderWithProviders(AuthStatus.Auth);

      const signOutSpan = container.querySelector('.header__signout');
      expect(signOutSpan).toBeInTheDocument();
      expect(signOutSpan).toHaveTextContent('Sign out');
    });
  });

  describe('Unknown auth status', () => {
    it('should display Sign in when auth status is Unknown', () => {
      renderWithProviders(AuthStatus.Unknown);

      expect(screen.getByText('Sign in')).toBeInTheDocument();
      expect(screen.queryByText('Oliver.conner@gmail.com')).not.toBeInTheDocument();
    });
  });

  describe('Favorites counting', () => {
    it('should count only favorite offers', () => {
      const mixedOffers: Offer[] = [
        { ...mockOffers[0], isFavorite: true },
        { ...mockOffers[1], isFavorite: false },
        { ...mockOffers[2], isFavorite: true },
      ];

      renderWithProviders(AuthStatus.Auth, mixedOffers);

      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('should display 0 when no favorites', () => {
      renderWithProviders(AuthStatus.Auth, []);

      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });
});
