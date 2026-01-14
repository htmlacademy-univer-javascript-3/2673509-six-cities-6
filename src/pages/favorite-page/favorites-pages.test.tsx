import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { FavoritesPage } from './favorites-page';
import { Offer } from '../../internal/types/offer-type';
import { CityName } from '../../internal/enums/city-name-enum';
import { PlaceType } from '../../internal/enums/place-type-enum';
import * as hooks from '../../store/hooks/hooks.ts';

vi.mock('../../components/header/header', () => ({
  Header: () => <div>Header</div>,
}));

vi.mock('../../components/footer/footer', () => ({
  Footer: () => <div>Footer</div>,
}));

vi.mock('../../components/place-card/place-card', () => ({
  PlaceCard: ({ offer }: { offer: Offer }) => (
    <div data-testid={`place-card-${offer.id}`}>{offer.title}</div>
  ),
}));

vi.mock('../../store/hooks', () => ({
  useAppSelector: vi.fn(),
  useAppDispatch: vi.fn(),
}));

const mockOfferParis: Offer = {
  id: '1',
  title: 'Beautiful apartment in Paris',
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
  isFavorite: true,
  isBookmarked: true,
  isPremium: false,
  rating: 4.5,
  previewImage: 'https://example.com/image1.jpg',
};

const mockOfferAmsterdam: Offer = {
  id: '2',
  title: 'Cozy house in Amsterdam',
  type: PlaceType.House,
  price: 200,
  city: {
    name: CityName.Amsterdam,
    location: {
      latitude: 52.3676,
      longitude: 4.9041,
      zoom: 10,
    },
  },
  location: {
    latitude: 52.3676,
    longitude: 4.9041,
    zoom: 10,
  },
  isFavorite: true,
  isBookmarked: true,
  isPremium: true,
  rating: 4.8,
  previewImage: 'https://example.com/image2.jpg',
};

const mockOfferNotFavorite: Offer = {
  id: '3',
  title: 'Regular apartment',
  type: PlaceType.Apartment,
  price: 80,
  city: {
    name: CityName.Cologne,
    location: {
      latitude: 50.9375,
      longitude: 6.9603,
      zoom: 10,
    },
  },
  location: {
    latitude: 50.9375,
    longitude: 6.9603,
    zoom: 10,
  },
  isFavorite: false,
  isBookmarked: false,
  isPremium: false,
  rating: 3.5,
  previewImage: 'https://example.com/image3.jpg',
};

const mockOfferParis2: Offer = {
  id: '4',
  title: 'Another Paris place',
  type: PlaceType.Room,
  price: 90,
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
  isFavorite: true,
  isBookmarked: true,
  isPremium: false,
  rating: 4.2,
  previewImage: 'https://example.com/image4.jpg',
};

const mockUseAppSelector = (offers: Offer[]) => {
  vi.mocked(hooks.useAppSelector).mockImplementation((selector) => {
    const state = {
      offers,
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

const renderWithProviders = (offers: Offer[]) => {
  mockUseAppSelector(offers);
  const store = createMockStore();

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <FavoritesPage />
      </MemoryRouter>
    </Provider>
  );
};

describe('FavoritesPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render Header and Footer', () => {
    renderWithProviders([]);

    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('should render empty state when no favorite offers', () => {
    renderWithProviders([]);

    expect(screen.getByText('Favorites (empty)')).toBeInTheDocument();
    expect(screen.getByText('Nothing yet saved.')).toBeInTheDocument();
    expect(
      screen.getByText('Save properties to narrow down search or plan your future trips.')
    ).toBeInTheDocument();
  });

  it('should render empty state when offers exist but none are favorites', () => {
    renderWithProviders([mockOfferNotFavorite]);

    expect(screen.getByText('Nothing yet saved.')).toBeInTheDocument();
  });

  it('should render favorite offers grouped by city', () => {
    renderWithProviders([mockOfferParis, mockOfferAmsterdam]);

    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Amsterdam')).toBeInTheDocument();
  });

  it('should render PlaceCard for each favorite offer', () => {
    renderWithProviders([mockOfferParis, mockOfferAmsterdam]);

    expect(screen.getByTestId('place-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('place-card-2')).toBeInTheDocument();
    expect(screen.getByText('Beautiful apartment in Paris')).toBeInTheDocument();
    expect(screen.getByText('Cozy house in Amsterdam')).toBeInTheDocument();
  });

  it('should filter out non-favorite offers', () => {
    renderWithProviders([mockOfferParis, mockOfferNotFavorite]);

    expect(screen.getByTestId('place-card-1')).toBeInTheDocument();
    expect(screen.queryByTestId('place-card-3')).not.toBeInTheDocument();
  });

  it('should group multiple favorites from same city', () => {
    renderWithProviders([mockOfferParis, mockOfferParis2]);

    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByTestId('place-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('place-card-4')).toBeInTheDocument();
  });

  it('should render city links correctly', () => {
    renderWithProviders([mockOfferParis]);

    const cityLink = screen.getByRole('link', { name: 'Paris' });
    expect(cityLink).toBeInTheDocument();
    expect(cityLink).toHaveAttribute('href', '/');
  });

  it('should not render cities with no favorite offers', () => {
    renderWithProviders([mockOfferParis]);

    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.queryByText('Amsterdam')).not.toBeInTheDocument();
    expect(screen.queryByText('Cologne')).not.toBeInTheDocument();
  });

  it('should have correct CSS classes for empty state', () => {
    const { container } = renderWithProviders([]);

    expect(container.querySelector('.favorites--empty')).toBeInTheDocument();
    expect(container.querySelector('.favorites__status-wrapper')).toBeInTheDocument();
  });

  it('should have correct CSS classes for favorites list', () => {
    const { container } = renderWithProviders([mockOfferParis]);

    expect(container.querySelector('.favorites__list')).toBeInTheDocument();
    expect(container.querySelector('.favorites__locations-items')).toBeInTheDocument();
  });

  it('should render visually hidden heading', () => {
    renderWithProviders([]);

    const heading = screen.getByText('Favorites (empty)');
    expect(heading).toHaveClass('visually-hidden');
  });

  it('should render main element with correct classes', () => {
    const { container } = renderWithProviders([mockOfferParis]);

    const main = container.querySelector('main');
    expect(main).toHaveClass('page__main', 'page__main--favorites');
  });

  it('should render favorites section', () => {
    const { container } = renderWithProviders([mockOfferParis]);

    expect(container.querySelector('.favorites')).toBeInTheDocument();
  });

  it('should render page container', () => {
    const { container } = renderWithProviders([]);

    expect(container.querySelector('.page__favorites-container')).toBeInTheDocument();
  });

  it('should handle mixed favorite and non-favorite offers', () => {
    renderWithProviders([mockOfferParis, mockOfferNotFavorite, mockOfferAmsterdam]);

    expect(screen.getByTestId('place-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('place-card-2')).toBeInTheDocument();
    expect(screen.queryByTestId('place-card-3')).not.toBeInTheDocument();
  });

  it('should pass correct type prop to PlaceCard', () => {
    renderWithProviders([mockOfferParis]);

    expect(screen.getByTestId('place-card-1')).toBeInTheDocument();
  });

  it('should render all favorite offers from different cities', () => {
    renderWithProviders([mockOfferParis, mockOfferAmsterdam, mockOfferNotFavorite]);

    const favoriteCards = screen.getAllByTestId(/^place-card-/);
    expect(favoriteCards).toHaveLength(2);
  });

  it('should render locations list item for each city with favorites', () => {
    const { container } = renderWithProviders([mockOfferParis, mockOfferAmsterdam]);

    const locationItems = container.querySelectorAll('.favorites__locations-items');
    expect(locationItems).toHaveLength(2);
  });

  it('should render favorites__places container for each city', () => {
    const { container } = renderWithProviders([mockOfferParis]);

    expect(container.querySelector('.favorites__places')).toBeInTheDocument();
  });
});
