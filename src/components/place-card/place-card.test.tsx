import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { PlaceCard } from './place-card';
import { Offer } from '../../internal/types/offer-type';
import { AuthStatus } from '../../internal/enums/auth-status-enum';
import { APIRoute } from '../../internal/enums/api-route-enum';
import { PlaceType } from '../../internal/enums/place-type-enum';
import { CityName } from '../../internal/enums/city-name-enum';

const mockNavigate = vi.fn();
const mockDispatch = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../store/api-actions', () => ({
  addFavouriteAction: vi.fn((params: { offerId: string; status: number }) => ({
    type: 'addFavourite',
    payload: params,
  })),
}));

interface RootState {
  authStatus: AuthStatus;
}

const renderWithProviders = (
  component: React.ReactElement,
  authStatus: AuthStatus = AuthStatus.Auth
) => {
  const mockStore = configureStore({
    reducer: {
      root: (state: RootState = { authStatus }, action: { type: string }) => {
        if (action.type) {
          return state;
        }
        return state;
      },
    },
  });

  mockStore.dispatch = mockDispatch;

  return render(
    <Provider store={mockStore}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe('PlaceCard Component', () => {
  const mockOffer: Offer = {
    id: '1',
    title: 'Beautiful apartment in city center',
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
    isPremium: true,
    rating: 4.5,
    previewImage: 'https://example.com/image.jpg',
  };

  beforeEach(() => {
    mockNavigate.mockClear();
    mockDispatch.mockClear();
  });

  describe('Rendering with different types', () => {
    it('should render default place card with correct classes', () => {
      const { container } = renderWithProviders(
        <PlaceCard offer={mockOffer} type="default" />
      );

      const article = container.querySelector('article');
      expect(article).toHaveClass('cities__card', 'place-card');
    });

    it('should render near places card with correct classes', () => {
      const { container } = renderWithProviders(
        <PlaceCard offer={mockOffer} type="near" />
      );

      const article = container.querySelector('article');
      expect(article).toHaveClass('near-places__card', 'place-card');
    });

    it('should render favorites card with correct classes', () => {
      const { container } = renderWithProviders(
        <PlaceCard offer={mockOffer} type="favorites" />
      );

      const article = container.querySelector('article');
      expect(article).toHaveClass('favorites__card', 'place-card');
    });
  });

  describe('Premium badge', () => {
    it('should display Premium badge when offer is premium', () => {
      renderWithProviders(<PlaceCard offer={mockOffer} type="default" />);

      expect(screen.getByText('Premium')).toBeInTheDocument();
    });

    it('should not display Premium badge when offer is not premium', () => {
      const nonPremiumOffer = { ...mockOffer, isPremium: false };
      renderWithProviders(<PlaceCard offer={nonPremiumOffer} type="default" />);

      expect(screen.queryByText('Premium')).not.toBeInTheDocument();
    });
  });

  describe('Image rendering', () => {
    it('should render image with correct src and alt', () => {
      renderWithProviders(<PlaceCard offer={mockOffer} type="default" />);

      const image = screen.getByAltText('Place image');
      expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    });

    it('should render image with default dimensions for default type', () => {
      renderWithProviders(<PlaceCard offer={mockOffer} type="default" />);

      const image = screen.getByAltText('Place image');
      expect(image).toHaveAttribute('width', '260');
      expect(image).toHaveAttribute('height', '200');
    });

    it('should render image with smaller dimensions for favorites type', () => {
      renderWithProviders(<PlaceCard offer={mockOffer} type="favorites" />);

      const image = screen.getByAltText('Place image');
      expect(image).toHaveAttribute('width', '150');
      expect(image).toHaveAttribute('height', '110');
    });

    it('should render correct image wrapper class for favorites', () => {
      const { container } = renderWithProviders(
        <PlaceCard offer={mockOffer} type="favorites" />
      );

      const wrapper = container.querySelector('.favorites__image-wrapper');
      expect(wrapper).toBeInTheDocument();
    });

    it('should render correct image wrapper class for default and near types', () => {
      const { container } = renderWithProviders(
        <PlaceCard offer={mockOffer} type="default" />
      );

      const wrapper = container.querySelector('.cities__image-wrapper');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Offer information', () => {
    it('should display offer title', () => {
      renderWithProviders(<PlaceCard offer={mockOffer} type="default" />);

      expect(screen.getByText('Beautiful apartment in city center')).toBeInTheDocument();
    });

    it('should display offer type', () => {
      renderWithProviders(<PlaceCard offer={mockOffer} type="default" />);

      expect(screen.getByText(PlaceType.Apartment)).toBeInTheDocument();
    });

    it('should display offer price', () => {
      renderWithProviders(<PlaceCard offer={mockOffer} type="default" />);

      expect(screen.getByText('120', { exact: false })).toBeInTheDocument();
      expect(screen.getByText('/\u00a0night')).toBeInTheDocument();
    });

    it('should render links with correct href', () => {
      const { container } = renderWithProviders(
        <PlaceCard offer={mockOffer} type="default" />
      );

      const links = container.querySelectorAll('a[href="/offer/1"]');
      expect(links).toHaveLength(2);
    });
  });

  describe('Rating', () => {
    it('should render rating with correct width percentage', () => {
      const { container } = renderWithProviders(
        <PlaceCard offer={mockOffer} type="default" />
      );

      const ratingSpan = container.querySelector('.place-card__stars span');
      expect(ratingSpan).toHaveStyle({ width: '100%' });
    });

    it('should render rating with 80% width for 4 stars', () => {
      const offer = { ...mockOffer, rating: 4 };
      const { container } = renderWithProviders(
        <PlaceCard offer={offer} type="default" />
      );

      const ratingSpan = container.querySelector('.place-card__stars span');
      expect(ratingSpan).toHaveStyle({ width: '80%' });
    });

    it('should render rating with 60% width for 3.2 stars', () => {
      const offer = { ...mockOffer, rating: 3.2 };
      const { container } = renderWithProviders(
        <PlaceCard offer={offer} type="default" />
      );

      const ratingSpan = container.querySelector('.place-card__stars span');
      expect(ratingSpan).toHaveStyle({ width: '60%' });
    });
  });

  describe('Bookmark button', () => {
    it('should render bookmark button', () => {
      renderWithProviders(<PlaceCard offer={mockOffer} type="default" />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(screen.getByText('To bookmarks')).toBeInTheDocument();
    });

    it('should not have active class when offer is not favorite', () => {
      const { container } = renderWithProviders(
        <PlaceCard offer={mockOffer} type="default" />
      );

      const button = container.querySelector('.place-card__bookmark-button');
      expect(button).not.toHaveClass('place-card__bookmark-button--active');
    });

    it('should have active class when offer is favorite', () => {
      const favoriteOffer = { ...mockOffer, isFavorite: true };
      const { container } = renderWithProviders(
        <PlaceCard offer={favoriteOffer} type="default" />
      );

      const button = container.querySelector('.place-card__bookmark-button');
      expect(button).toHaveClass('place-card__bookmark-button--active');
    });

    it('should dispatch addFavouriteAction when authenticated user clicks bookmark', async () => {
      const user = userEvent.setup();
      const { addFavouriteAction } = await import('../../store/api-actions/api-actions.ts');

      renderWithProviders(<PlaceCard offer={mockOffer} type="default" />, AuthStatus.Auth);

      const button = screen.getByRole('button');

      await act(async () => {
        await user.click(button);
      });

      expect(addFavouriteAction).toHaveBeenCalledWith({
        offerId: '1',
        status: 1,
      });
      expect(mockDispatch).toHaveBeenCalled();
    });

    it('should dispatch with status 0 when removing from favorites', async () => {
      const user = userEvent.setup();
      const favoriteOffer = { ...mockOffer, isFavorite: true };
      const { addFavouriteAction } = await import('../../store/api-actions/api-actions.ts');

      renderWithProviders(<PlaceCard offer={favoriteOffer} type="default" />, AuthStatus.Auth);

      const button = screen.getByRole('button');

      await act(async () => {
        await user.click(button);
      });

      expect(addFavouriteAction).toHaveBeenCalledWith({
        offerId: '1',
        status: 0,
      });
    });

    it('should navigate to login when unauthenticated user clicks bookmark', async () => {
      const user = userEvent.setup();

      renderWithProviders(<PlaceCard offer={mockOffer} type="default" />, AuthStatus.NoAuth);

      const button = screen.getByRole('button');

      await act(async () => {
        await user.click(button);
      });

      expect(mockNavigate).toHaveBeenCalledWith(APIRoute.Login);
    });
  });

  describe('SVG icons', () => {
    it('should render bookmark icon', () => {
      const { container } = renderWithProviders(
        <PlaceCard offer={mockOffer} type="default" />
      );

      const icon = container.querySelector('.place-card__bookmark-icon use');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('xlink:href', '#icon-bookmark');
    });
  });
});
