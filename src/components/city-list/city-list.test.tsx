import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import { CityList } from './city-list';
import { CityName } from '../../internal/enums/city-name-enum';
import { City } from '../../internal/types/city';

const mockDispatch = vi.fn();

vi.mock('../../store/actions', () => ({
  changeCity: vi.fn((cityName: CityName) => ({
    type: 'city/changeCity',
    payload: cityName,
  })),
}));

const renderWithProviders = (
  component: React.ReactElement,
  currentCity: City
) => {
  const mockStore = configureStore({
    reducer: {
      city: () => currentCity,
    },
  });

  mockStore.dispatch = mockDispatch;

  return render(
    <Provider store={mockStore}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe('CityList Component', () => {
  const mockCities = [
    {
      name: CityName.Paris,
      location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
    },
    {
      name: CityName.Cologne,
      location: { latitude: 50.9308, longitude: 6.9385, zoom: 10 },
    },
    {
      name: CityName.Brussels,
      location: { latitude: 50.8467, longitude: 4.3525, zoom: 10 },
    },
    {
      name: CityName.Amsterdam,
      location: { latitude: 52.374, longitude: 4.8897, zoom: 10 },
    },
    {
      name: CityName.Hamburg,
      location: { latitude: 53.5507, longitude: 9.9929, zoom: 10 },
    },
    {
      name: CityName.Dusseldorf,
      location: { latitude: 51.2306, longitude: 6.7873, zoom: 10 },
    },
  ];

  const currentCity: City = {
    name: CityName.Paris,
    location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
  };

  beforeEach(async () => {
    mockDispatch.mockClear();
    const { changeCity } = await import('../../store/actions/actions.ts');
    vi.mocked(changeCity).mockClear();
  });

  describe('Rendering', () => {
    it('should render cities list', () => {
      const { container } = renderWithProviders(
        <CityList cities={mockCities} />,
        currentCity
      );

      const list = container.querySelector('.locations__list');
      expect(list).toBeInTheDocument();
    });

    it('should have correct CSS classes for list', () => {
      const { container } = renderWithProviders(
        <CityList cities={mockCities} />,
        currentCity
      );

      const list = container.querySelector('.locations__list');
      expect(list).toHaveClass('locations__list', 'tabs__list');
    });

    it('should render all cities', () => {
      renderWithProviders(<CityList cities={mockCities} />, currentCity);

      mockCities.forEach((city) => {
        expect(screen.getByText(city.name)).toBeInTheDocument();
      });
    });

    it('should render correct number of list items', () => {
      const { container } = renderWithProviders(
        <CityList cities={mockCities} />,
        currentCity
      );

      const items = container.querySelectorAll('.locations__item');
      expect(items).toHaveLength(mockCities.length);
    });
  });

  describe('Links', () => {
    it('should render links for all cities', () => {
      renderWithProviders(<CityList cities={mockCities} />, currentCity);

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(mockCities.length);
    });

    it('should have correct href for all links', () => {
      renderWithProviders(<CityList cities={mockCities} />, currentCity);

      const links = screen.getAllByRole('link');
      links.forEach((link) => {
        expect(link).toHaveAttribute('href', '/');
      });
    });

    it('should have correct CSS classes for links', () => {
      const { container } = renderWithProviders(
        <CityList cities={mockCities} />,
        currentCity
      );

      const links = container.querySelectorAll('.locations__item-link');
      links.forEach((link) => {
        expect(link).toHaveClass('locations__item-link', 'tabs__item');
      });
    });
  });

  describe('Active city', () => {
    it('should add active class to current city', () => {
      renderWithProviders(
        <CityList cities={mockCities}/>,
        currentCity
      );

      const parisLink = screen.getByText(CityName.Paris).parentElement;
      expect(parisLink).toHaveClass('tabs__item--active');
    });

    it('should not add active class to other cities', () => {
      renderWithProviders(
        <CityList cities={mockCities}/>,
        currentCity
      );

      const cologneLink = screen.getByText(CityName.Cologne).parentElement;
      expect(cologneLink).not.toHaveClass('tabs__item--active');

      const brusselsLink = screen.getByText(CityName.Brussels).parentElement;
      expect(brusselsLink).not.toHaveClass('tabs__item--active');
    });

    it('should change active city when different city is selected', () => {
      const amsterdamCity: City = {
        name: CityName.Amsterdam,
        location: { latitude: 52.374, longitude: 4.8897, zoom: 10 },
      };

      renderWithProviders(<CityList cities={mockCities} />, amsterdamCity);

      const amsterdamLink = screen.getByText(CityName.Amsterdam).parentElement;
      expect(amsterdamLink).toHaveClass('tabs__item--active');

      const parisLink = screen.getByText(CityName.Paris).parentElement;
      expect(parisLink).not.toHaveClass('tabs__item--active');
    });
  });

  describe('City selection', () => {
    it('should dispatch changeCity action when city is clicked', async () => {
      const { changeCity } = await import('../../store/actions/actions.ts');
      const { container } = renderWithProviders(
        <CityList cities={mockCities} />,
        currentCity
      );

      const cologneItem = container.querySelectorAll('.locations__item')[1];
      fireEvent.click(cologneItem);

      expect(changeCity).toHaveBeenCalledWith(CityName.Cologne);
      expect(mockDispatch).toHaveBeenCalled();
    });

    it('should dispatch changeCity with correct city name', async () => {
      const { changeCity } = await import('../../store/actions/actions.ts');
      const { container } = renderWithProviders(
        <CityList cities={mockCities} />,
        currentCity
      );

      const amsterdamItem = container.querySelectorAll('.locations__item')[3];
      fireEvent.click(amsterdamItem);

      expect(changeCity).toHaveBeenCalledWith(CityName.Amsterdam);
    });

    it('should handle multiple city selections', async () => {
      const { changeCity } = await import('../../store/actions/actions.ts');
      const { container } = renderWithProviders(
        <CityList cities={mockCities} />,
        currentCity
      );

      const items = container.querySelectorAll('.locations__item');

      fireEvent.click(items[1]); // Cologne
      expect(changeCity).toHaveBeenCalledWith(CityName.Cologne);

      fireEvent.click(items[2]); // Brussels
      expect(changeCity).toHaveBeenCalledWith(CityName.Brussels);

      fireEvent.click(items[3]); // Amsterdam
      expect(changeCity).toHaveBeenCalledWith(CityName.Amsterdam);

      expect(changeCity).toHaveBeenCalledTimes(3);
    });

    it('should allow clicking on current city', async () => {
      const { changeCity } = await import('../../store/actions/actions.ts');
      const { container } = renderWithProviders(
        <CityList cities={mockCities} />,
        currentCity
      );

      const parisItem = container.querySelectorAll('.locations__item')[0];
      fireEvent.click(parisItem);

      expect(changeCity).toHaveBeenCalledWith(CityName.Paris);
    });
  });

  describe('Empty cities list', () => {
    it('should render empty list when no cities provided', () => {
      const { container } = renderWithProviders(
        <CityList cities={[]} />,
        currentCity
      );

      const list = container.querySelector('.locations__list');
      expect(list).toBeInTheDocument();
      expect(list?.children).toHaveLength(0);
    });

    it('should not render any items when cities array is empty', () => {
      const { container } = renderWithProviders(
        <CityList cities={[]} />,
        currentCity
      );

      const items = container.querySelectorAll('.locations__item');
      expect(items).toHaveLength(0);
    });
  });

  describe('CSS structure', () => {
    it('should have correct structure: ul > li > Link > span', () => {
      const { container } = renderWithProviders(
        <CityList cities={mockCities} />,
        currentCity
      );

      const list = container.querySelector('ul.locations__list');
      expect(list).toBeInTheDocument();

      const firstItem = list?.querySelector('li.locations__item');
      expect(firstItem).toBeInTheDocument();

      const link = firstItem?.querySelector('a.locations__item-link');
      expect(link).toBeInTheDocument();

      const span = link?.querySelector('span');
      expect(span).toBeInTheDocument();
    });
  });

  describe('Single city', () => {
    it('should render correctly with single city', () => {
      const singleCity = [mockCities[0]];

      renderWithProviders(<CityList cities={singleCity} />, currentCity);

      expect(screen.getByText(CityName.Paris)).toBeInTheDocument();
      expect(screen.getAllByRole('link')).toHaveLength(1);
    });
  });
});
