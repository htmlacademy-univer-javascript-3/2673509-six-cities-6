import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { MainPage } from './main-page';
import { Offer } from '../../internal/types/offer-type';
import { City } from '../../internal/types/city';
import { CityName } from '../../internal/enums/city-name-enum';
import { PlaceType } from '../../internal/enums/place-type-enum';
import { SortOption } from '../../internal/enums/sort-option-enum';
import * as hooks from '../../store/hooks/hooks.ts';
import * as actions from '../../store/actions/actions.ts';

vi.mock('../../components/header/header', () => ({
  Header: () => <div>Header</div>,
}));

vi.mock('../../components/offers-list/offers-list', () => ({
  OffersList: ({ offers }: { offers: Offer[] }) => (
    <div data-testid="offers-list">Offers List: {offers.length}</div>
  ),
}));

vi.mock('../../components/map/map', () => ({
  Map: () => <div>Map</div>,
}));

vi.mock('../../components/city-list/city-list', () => ({
  CityList: () => <div>City List</div>,
}));

vi.mock('../../components/sort-options/sort-options', () => ({
  SortOptions: ({ onSortChange }: { onSortChange: (option: SortOption) => void }) => (
    <div data-testid="sort-options" onClick={() => onSortChange(SortOption.Popular)}>
      Sort Options
    </div>
  ),
}));

vi.mock('../main-empty-page/main-empty-page', () => ({
  MainEmptyPage: () => <div>Main Empty Page</div>,
}));

vi.mock('../../store/hooks', () => ({
  useAppSelector: vi.fn(),
  useAppDispatch: vi.fn(),
}));

vi.mock('../../store/actions', () => ({
  setSortOption: vi.fn(),
}));

const mockCityParis: City = {
  name: CityName.Paris,
  location: {
    latitude: 48.8566,
    longitude: 2.3522,
    zoom: 10,
  },
};

const mockCityAmsterdam: City = {
  name: CityName.Amsterdam,
  location: {
    latitude: 52.3676,
    longitude: 4.9041,
    zoom: 10,
  },
};

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
  isFavorite: false,
  isBookmarked: false,
  isPremium: false,
  rating: 4.5,
  previewImage: 'https://example.com/image1.jpg',
};

const mockOfferParis2: Offer = {
  id: '2',
  title: 'Cozy studio in Paris',
  type: PlaceType.Room,
  price: 80,
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
  rating: 4.2,
  previewImage: 'https://example.com/image2.jpg',
};

const mockOfferAmsterdam: Offer = {
  id: '3',
  title: 'Nice house in Amsterdam',
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
  isFavorite: false,
  isBookmarked: false,
  isPremium: false,
  rating: 4.8,
  previewImage: 'https://example.com/image3.jpg',
};

const mockDispatch = vi.fn();

const mockUseAppSelector = (offers: Offer[], city: City) => {
  vi.mocked(hooks.useAppSelector).mockImplementation((selector) => {
    const state = {
      offers,
      city,
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

const renderWithProviders = (offers: Offer[], city: City) => {
  mockUseAppSelector(offers, city);
  vi.mocked(hooks.useAppDispatch).mockReturnValue(mockDispatch);
  const store = createMockStore();

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <MainPage />
      </MemoryRouter>
    </Provider>
  );
};

describe('MainPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render Header component', () => {
    renderWithProviders([mockOfferParis], mockCityParis);

    expect(screen.getByText('Header')).toBeInTheDocument();
  });

  it('should render visually hidden Cities heading', () => {
    renderWithProviders([mockOfferParis], mockCityParis);

    const heading = screen.getByText('Cities');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('visually-hidden');
    expect(heading.tagName).toBe('H1');
  });

  it('should render visually hidden Places heading', () => {
    renderWithProviders([mockOfferParis], mockCityParis);

    const heading = screen.getByText('Places');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('visually-hidden');
    expect(heading.tagName).toBe('H2');
  });

  it('should render CityList component', () => {
    renderWithProviders([mockOfferParis], mockCityParis);

    expect(screen.getByText('City List')).toBeInTheDocument();
  });

  it('should render SortOptions component', () => {
    renderWithProviders([mockOfferParis], mockCityParis);

    expect(screen.getByTestId('sort-options')).toBeInTheDocument();
  });

  it('should render OffersList component', () => {
    renderWithProviders([mockOfferParis], mockCityParis);

    expect(screen.getByTestId('offers-list')).toBeInTheDocument();
  });

  it('should render Map component', () => {
    renderWithProviders([mockOfferParis], mockCityParis);

    expect(screen.getByText('Map')).toBeInTheDocument();
  });

  it('should display correct number of places for current city', () => {
    renderWithProviders([mockOfferParis, mockOfferParis2], mockCityParis);

    expect(screen.getByText('2 places to stay in Paris')).toBeInTheDocument();
  });

  it('should filter offers by current city', () => {
    renderWithProviders([mockOfferParis, mockOfferAmsterdam], mockCityParis);

    expect(screen.getByText('Offers List: 1')).toBeInTheDocument();
  });

  it('should show multiple offers for same city', () => {
    renderWithProviders([mockOfferParis, mockOfferParis2], mockCityParis);

    expect(screen.getByText('Offers List: 2')).toBeInTheDocument();
  });

  it('should show no offers when city has no places', () => {
    renderWithProviders([mockOfferAmsterdam], mockCityParis);

    expect(screen.getByText('0 places to stay in Paris')).toBeInTheDocument();
  });

  it('should dispatch setSortOption on sort change', () => {
    const mockSetSortOptionAction = { type: 'SET_SORT_OPTION', payload: SortOption.Popular };
    vi.mocked(actions.setSortOption).mockReturnValue(mockSetSortOptionAction as never);

    renderWithProviders([mockOfferParis], mockCityParis);

    const sortOptions = screen.getByTestId('sort-options');
    sortOptions.click();

    expect(mockDispatch).toHaveBeenCalled();
    expect(actions.setSortOption).toHaveBeenCalledWith(SortOption.Popular);
  });

  it('should have correct page classes', () => {
    const { container } = renderWithProviders([mockOfferParis], mockCityParis);

    const pageDiv = container.querySelector('.page');
    expect(pageDiv).toHaveClass('page--gray', 'page--main');
  });

  it('should render main element with correct classes when offers exist', () => {
    const { container } = renderWithProviders([mockOfferParis], mockCityParis);

    const main = container.querySelector('main');
    expect(main).toHaveClass('page__main', 'page__main--index');
    expect(main).not.toHaveClass('page__main--index-empty');
  });

  it('should add empty class to main when no offers for current city', () => {
    const { container } = renderWithProviders([mockOfferAmsterdam], mockCityParis);

    const main = container.querySelector('main');
    expect(main).toHaveClass('page__main', 'page__main--index', 'page__main--index-empty');
  });

  it('should render tabs section', () => {
    const { container } = renderWithProviders([mockOfferParis], mockCityParis);

    expect(container.querySelector('.tabs')).toBeInTheDocument();
  });

  it('should render locations section', () => {
    const { container } = renderWithProviders([mockOfferParis], mockCityParis);

    const locationsSection = container.querySelector('.locations.container');
    expect(locationsSection).toBeInTheDocument();
    expect(locationsSection?.tagName).toBe('SECTION');
  });

  it('should render cities container', () => {
    const { container } = renderWithProviders([mockOfferParis], mockCityParis);

    expect(container.querySelector('.cities')).toBeInTheDocument();
  });

  it('should render cities places container', () => {
    const { container } = renderWithProviders([mockOfferParis], mockCityParis);

    const placesContainer = container.querySelector('.cities__places-container.container');
    expect(placesContainer).toBeInTheDocument();
  });

  it('should render cities places section', () => {
    const { container } = renderWithProviders([mockOfferParis], mockCityParis);

    const placesSection = container.querySelector('.cities__places.places');
    expect(placesSection).toBeInTheDocument();
    expect(placesSection?.tagName).toBe('SECTION');
  });

  it('should render places found as bold text', () => {
    const { container } = renderWithProviders([mockOfferParis], mockCityParis);

    const placesFound = container.querySelector('.places__found');
    expect(placesFound).toBeInTheDocument();
    expect(placesFound?.tagName).toBe('B');
  });

  it('should render cities right section', () => {
    const { container } = renderWithProviders([mockOfferParis], mockCityParis);

    expect(container.querySelector('.cities__right-section')).toBeInTheDocument();
  });

  it('should render cities map section', () => {
    const { container } = renderWithProviders([mockOfferParis], mockCityParis);

    const mapSection = container.querySelector('.cities__map.map');
    expect(mapSection).toBeInTheDocument();
    expect(mapSection?.tagName).toBe('SECTION');
  });

  it('should update offers count when city changes', () => {
    renderWithProviders([mockOfferParis, mockOfferAmsterdam], mockCityAmsterdam);

    expect(screen.getByText('1 places to stay in Amsterdam')).toBeInTheDocument();
  });

  it('should memoize current city offers', () => {
    const { rerender } = renderWithProviders([mockOfferParis, mockOfferParis2], mockCityParis);

    expect(screen.getByText('2 places to stay in Paris')).toBeInTheDocument();

    rerender(
      <Provider store={createMockStore()}>
        <MemoryRouter>
          <MainPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('2 places to stay in Paris')).toBeInTheDocument();
  });

  it('should render empty array when no offers match city', () => {
    renderWithProviders([], mockCityParis);

    expect(screen.getByText('0 places to stay in Paris')).toBeInTheDocument();
  });
});
