import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { MainEmptyPage } from './main-empty-page';
import { CityName } from '../../internal/enums/city-name-enum';
import { City } from '../../internal/types/city';
import * as hooks from '../../store/hooks/hooks.ts';
import * as actions from '../../store/actions/actions.ts';

vi.mock('../../components/header/header', () => ({
  Header: () => <div>Header</div>,
}));

vi.mock('../../store/hooks', () => ({
  useAppSelector: vi.fn(),
  useAppDispatch: vi.fn(),
}));

vi.mock('../../store/actions', () => ({
  changeCity: vi.fn(),
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

const mockDispatch = vi.fn();

const mockUseAppSelector = (currentCity: City) => {
  vi.mocked(hooks.useAppSelector).mockImplementation((selector) => {
    const state = {
      city: currentCity,
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

const renderWithProviders = (currentCity: City) => {
  mockUseAppSelector(currentCity);
  vi.mocked(hooks.useAppDispatch).mockReturnValue(mockDispatch);
  const store = createMockStore();

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <MainEmptyPage />
      </MemoryRouter>
    </Provider>
  );
};

describe('MainEmptyPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render Header component', () => {
    renderWithProviders(mockCityParis);

    expect(screen.getByText('Header')).toBeInTheDocument();
  });

  it('should render visually hidden Cities heading', () => {
    renderWithProviders(mockCityParis);

    const heading = screen.getByText('Cities');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('visually-hidden');
    expect(heading.tagName).toBe('H1');
  });

  it('should render no places message', () => {
    renderWithProviders(mockCityParis);

    const message = screen.getByText('No places to stay available');
    expect(message).toBeInTheDocument();
    expect(message.tagName).toBe('B');
  });

  it('should render all city links', () => {
    renderWithProviders(mockCityParis);

    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Amsterdam')).toBeInTheDocument();
    expect(screen.getByText('Cologne')).toBeInTheDocument();
    expect(screen.getByText('Brussels')).toBeInTheDocument();
    expect(screen.getByText('Hamburg')).toBeInTheDocument();
    expect(screen.getByText('Dusseldorf')).toBeInTheDocument();
  });

  it('should mark current city as active', () => {
    const { container } = renderWithProviders(mockCityParis);
    container.querySelector('.locations__item-link[href="/"]');
    const links = container.querySelectorAll('.locations__item-link');

    let parisLinkElement = null;
    links.forEach((link) => {
      if (link.textContent === 'Paris') {
        parisLinkElement = link;
      }
    });

    expect(parisLinkElement).toHaveClass('tabs__item--active');
  });

  it('should not mark non-current cities as active', () => {
    const { container } = renderWithProviders(mockCityParis);

    const links = container.querySelectorAll('.locations__item-link');

    let amsterdamLinkElement = null;
    links.forEach((link) => {
      if (link.textContent === 'Amsterdam') {
        amsterdamLinkElement = link;
      }
    });

    expect(amsterdamLinkElement).not.toHaveClass('tabs__item--active');
  });

  it('should dispatch changeCity action on city click', () => {
    renderWithProviders(mockCityParis);

    const amsterdamItem = screen.getByText('Amsterdam').closest('li');

    if (amsterdamItem) {
      fireEvent.click(amsterdamItem);
    }

    expect(mockDispatch).toHaveBeenCalled();
  });

  it('should call changeCity with correct city name on click', () => {
    const mockChangeCityAction = { type: 'CHANGE_CITY', payload: CityName.Amsterdam };
    vi.mocked(actions.changeCity).mockReturnValue(mockChangeCityAction as never);

    renderWithProviders(mockCityParis);

    const amsterdamItem = screen.getByText('Amsterdam').closest('li');

    if (amsterdamItem) {
      fireEvent.click(amsterdamItem);
    }

    expect(actions.changeCity).toHaveBeenCalledWith(CityName.Amsterdam);
  });

  it('should have correct page classes', () => {
    const { container } = renderWithProviders(mockCityParis);

    const pageDiv = container.querySelector('.page');
    expect(pageDiv).toHaveClass('page--gray', 'page--main');
  });

  it('should render main element with correct classes', () => {
    const { container } = renderWithProviders(mockCityParis);

    const main = container.querySelector('main');
    expect(main).toHaveClass('page__main', 'page__main--index', 'page__main--index-empty');
  });

  it('should render tabs section', () => {
    const { container } = renderWithProviders(mockCityParis);

    expect(container.querySelector('.tabs')).toBeInTheDocument();
  });

  it('should render locations section with container class', () => {
    const { container } = renderWithProviders(mockCityParis);

    const locationsSection = container.querySelector('.locations.container');
    expect(locationsSection).toBeInTheDocument();
    expect(locationsSection?.tagName).toBe('SECTION');
  });

  it('should render locations list', () => {
    const { container } = renderWithProviders(mockCityParis);

    const list = container.querySelector('.locations__list.tabs__list');
    expect(list).toBeInTheDocument();
    expect(list?.tagName).toBe('UL');
  });

  it('should render 6 location items', () => {
    const { container } = renderWithProviders(mockCityParis);

    const items = container.querySelectorAll('.locations__item');
    expect(items).toHaveLength(6);
  });

  it('should render cities container', () => {
    const { container } = renderWithProviders(mockCityParis);

    expect(container.querySelector('.cities')).toBeInTheDocument();
  });

  it('should render cities places container with empty class', () => {
    const { container } = renderWithProviders(mockCityParis);

    const placesContainer = container.querySelector('.cities__places-container');
    expect(placesContainer).toHaveClass('cities__places-container--empty', 'container');
  });

  it('should render no places section', () => {
    const { container } = renderWithProviders(mockCityParis);

    const noPlacesSection = container.querySelector('.cities__no-places');
    expect(noPlacesSection).toBeInTheDocument();
    expect(noPlacesSection?.tagName).toBe('SECTION');
  });

  it('should render status wrapper with tabs content class', () => {
    const { container } = renderWithProviders(mockCityParis);

    const statusWrapper = container.querySelector('.cities__status-wrapper.tabs__content');
    expect(statusWrapper).toBeInTheDocument();
  });

  it('should render cities right section', () => {
    const { container } = renderWithProviders(mockCityParis);

    expect(container.querySelector('.cities__right-section')).toBeInTheDocument();
  });

  it('should render all city links with correct href', () => {
    const { container } = renderWithProviders(mockCityParis);

    const links = container.querySelectorAll('.locations__item-link');
    links.forEach((link) => {
      expect(link).toHaveAttribute('href', '/');
    });
  });

  it('should render each city name inside span', () => {
    const { container } = renderWithProviders(mockCityParis);

    const spans = container.querySelectorAll('.locations__item-link span');
    expect(spans.length).toBeGreaterThan(0);
  });

  it('should have tabs__item class on all city links', () => {
    const { container } = renderWithProviders(mockCityParis);

    const links = container.querySelectorAll('.locations__item-link');
    links.forEach((link) => {
      expect(link).toHaveClass('tabs__item');
    });
  });

  it('should change active city when different city is selected', () => {
    renderWithProviders(mockCityAmsterdam);

    const { container } = render(
      <Provider store={createMockStore()}>
        <MemoryRouter>
          <MainEmptyPage />
        </MemoryRouter>
      </Provider>
    );

    mockUseAppSelector(mockCityAmsterdam);

    const links = container.querySelectorAll('.locations__item-link');
    let amsterdamLinkElement = null;
    links.forEach((link) => {
      if (link.textContent === 'Amsterdam') {
        amsterdamLinkElement = link;
      }
    });

    expect(amsterdamLinkElement).toBeTruthy();
  });
});
