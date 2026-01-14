import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import { OffersList } from './offers-list';
import { Offer } from '../../internal/types/offer-type';
import { SortOption } from '../../internal/enums/sort-option-enum';
import { PlaceType } from '../../internal/enums/place-type-enum';
import { CityName } from '../../internal/enums/city-name-enum';

vi.mock('../place-card/place-card', () => ({
  PlaceCard: ({ offer, type }: { offer: Offer; type: string }) => (
    <div data-testid={`place-card-${offer.id}`} data-type={type}>
      {offer.title} - ${offer.price}
    </div>
  ),
}));

const renderWithProviders = (
  component: React.ReactElement,
  sortOption: SortOption = SortOption.Popular
) => {
  const mockStore = configureStore({
    reducer: {
      sortOption: () => sortOption,
    },
  });

  return render(
    <Provider store={mockStore}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe('OffersList Component', () => {
  const mockOffers: Offer[] = [
    {
      id: '1',
      title: 'Expensive apartment',
      type: PlaceType.Apartment,
      price: 300,
      city: {
        name: CityName.Paris,
        location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
      },
      location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
      isFavorite: false,
      isBookmarked: false,
      isPremium: false,
      rating: 3.5,
      previewImage: 'https://example.com/image1.jpg',
    },
    {
      id: '2',
      title: 'Cheap room',
      type: PlaceType.Room,
      price: 100,
      city: {
        name: CityName.Paris,
        location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
      },
      location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
      isFavorite: false,
      isBookmarked: false,
      isPremium: false,
      rating: 4.8,
      previewImage: 'https://example.com/image2.jpg',
    },
    {
      id: '3',
      title: 'Medium house',
      type: PlaceType.House,
      price: 200,
      city: {
        name: CityName.Paris,
        location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
      },
      location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
      isFavorite: false,
      isBookmarked: false,
      isPremium: false,
      rating: 4.2,
      previewImage: 'https://example.com/image3.jpg',
    },
  ];

  describe('Rendering', () => {
    it('should render offers list container', () => {
      const { container } = renderWithProviders(
        <OffersList offers={mockOffers} listType="default" />
      );

      const list = container.querySelector('.places__list');
      expect(list).toBeInTheDocument();
    });

    it('should render all offers', () => {
      renderWithProviders(<OffersList offers={mockOffers} listType="default" />);

      mockOffers.forEach((offer) => {
        expect(screen.getByTestId(`place-card-${offer.id}`)).toBeInTheDocument();
      });
    });

    it('should render correct number of PlaceCard components', () => {
      renderWithProviders(<OffersList offers={mockOffers} listType="default" />);

      const placeCards = screen.getAllByTestId(/place-card-/);
      expect(placeCards).toHaveLength(mockOffers.length);
    });
  });

  describe('CSS classes for different list types', () => {
    it('should have correct classes for default list type', () => {
      const { container } = renderWithProviders(
        <OffersList offers={mockOffers} listType="default" />
      );

      const list = container.querySelector('.places__list');
      expect(list).toHaveClass('places__list', 'cities__places-list', 'tabs__content');
    });

    it('should have correct classes for near list type', () => {
      const { container } = renderWithProviders(
        <OffersList offers={mockOffers} listType="near" />
      );

      const list = container.querySelector('.places__list');
      expect(list).toHaveClass('places__list', 'near-places__list');
    });

    it('should not have tabs__content class for near type', () => {
      const { container } = renderWithProviders(
        <OffersList offers={mockOffers} listType="near" />
      );

      const list = container.querySelector('.places__list');
      expect(list).not.toHaveClass('tabs__content');
    });
  });

  describe('Sorting - Popular', () => {
    it('should keep original order for Popular sort', () => {
      renderWithProviders(
        <OffersList offers={mockOffers} listType="default" />,
        SortOption.Popular
      );

      const placeCards = screen.getAllByTestId(/place-card-/);
      expect(placeCards[0]).toHaveAttribute('data-testid', 'place-card-1');
      expect(placeCards[1]).toHaveAttribute('data-testid', 'place-card-2');
      expect(placeCards[2]).toHaveAttribute('data-testid', 'place-card-3');
    });
  });

  describe('Sorting - Price Low to High', () => {
    it('should sort offers by price ascending', () => {
      renderWithProviders(
        <OffersList offers={mockOffers} listType="default" />,
        SortOption.PriceLowToHigh
      );

      const placeCards = screen.getAllByTestId(/place-card-/);
      expect(placeCards[0]).toHaveAttribute('data-testid', 'place-card-2');
      expect(placeCards[1]).toHaveAttribute('data-testid', 'place-card-3');
      expect(placeCards[2]).toHaveAttribute('data-testid', 'place-card-1');
    });
  });

  describe('Sorting - Price High to Low', () => {
    it('should sort offers by price descending', () => {
      renderWithProviders(
        <OffersList offers={mockOffers} listType="default" />,
        SortOption.PriceHighToLow
      );

      const placeCards = screen.getAllByTestId(/place-card-/);
      expect(placeCards[0]).toHaveAttribute('data-testid', 'place-card-1');
      expect(placeCards[1]).toHaveAttribute('data-testid', 'place-card-3');
      expect(placeCards[2]).toHaveAttribute('data-testid', 'place-card-2');
    });
  });

  describe('Sorting - Top Rated First', () => {
    it('should sort offers by rating descending', () => {
      renderWithProviders(
        <OffersList offers={mockOffers} listType="default" />,
        SortOption.TopRatedFirst
      );

      const placeCards = screen.getAllByTestId(/place-card-/);
      expect(placeCards[0]).toHaveAttribute('data-testid', 'place-card-2');
      expect(placeCards[1]).toHaveAttribute('data-testid', 'place-card-3');
      expect(placeCards[2]).toHaveAttribute('data-testid', 'place-card-1');
    });
  });

  describe('Active offer handling', () => {
    it('should call activeOfferChange on mouse enter', () => {
      const mockActiveOfferChange = vi.fn();

      const { container } = renderWithProviders(
        <OffersList
          offers={mockOffers}
          listType="default"
          activeOfferChange={mockActiveOfferChange}
        />
      );

      const wrappers = container.querySelectorAll('.places__list > div');
      const firstWrapper = wrappers[0];

      fireEvent.mouseEnter(firstWrapper);

      expect(mockActiveOfferChange).toHaveBeenCalledWith(mockOffers[0]);
    });

    it('should call activeOfferChange with null on mouse leave', () => {
      const mockActiveOfferChange = vi.fn();

      const { container } = renderWithProviders(
        <OffersList
          offers={mockOffers}
          listType="default"
          activeOfferChange={mockActiveOfferChange}
        />
      );

      const wrappers = container.querySelectorAll('.places__list > div');
      const firstWrapper = wrappers[0];

      fireEvent.mouseEnter(firstWrapper);
      fireEvent.mouseLeave(firstWrapper);

      expect(mockActiveOfferChange).toHaveBeenCalledWith(null);
    });

    it('should call activeOfferChange multiple times for different offers', () => {
      const mockActiveOfferChange = vi.fn();

      const { container } = renderWithProviders(
        <OffersList
          offers={mockOffers}
          listType="default"
          activeOfferChange={mockActiveOfferChange}
        />
      );

      const wrappers = container.querySelectorAll('.places__list > div');

      fireEvent.mouseEnter(wrappers[0]);
      expect(mockActiveOfferChange).toHaveBeenCalledWith(mockOffers[0]);

      fireEvent.mouseEnter(wrappers[1]);
      expect(mockActiveOfferChange).toHaveBeenCalledWith(mockOffers[1]);

      fireEvent.mouseEnter(wrappers[2]);
      expect(mockActiveOfferChange).toHaveBeenCalledWith(mockOffers[2]);
    });

    it('should wrap PlaceCards in div when activeOfferChange is provided', () => {
      const mockActiveOfferChange = vi.fn();

      const { container } = renderWithProviders(
        <OffersList
          offers={mockOffers}
          listType="default"
          activeOfferChange={mockActiveOfferChange}
        />
      );

      const wrappers = container.querySelectorAll('.places__list > div');
      expect(wrappers).toHaveLength(mockOffers.length);
    });

    it('should not wrap PlaceCards in div when activeOfferChange is not provided', () => {
      const { container } = renderWithProviders(
        <OffersList offers={mockOffers} listType="default" />
      );

      const placeCards = container.querySelectorAll('.places__list > [data-testid^="place-card"]');
      expect(placeCards).toHaveLength(mockOffers.length);
    });
  });

  describe('Empty offers list', () => {
    it('should render empty list when no offers provided', () => {
      const { container } = renderWithProviders(
        <OffersList offers={[]} listType="default" />
      );

      const list = container.querySelector('.places__list');
      expect(list).toBeInTheDocument();
      expect(list?.children).toHaveLength(0);
    });

    it('should not render any PlaceCards when offers array is empty', () => {
      renderWithProviders(<OffersList offers={[]} listType="default" />);

      const placeCards = screen.queryAllByTestId(/place-card-/);
      expect(placeCards).toHaveLength(0);
    });
  });

  describe('PlaceCard props', () => {
    it('should pass correct type to PlaceCard for default list', () => {
      renderWithProviders(<OffersList offers={mockOffers} listType="default" />);

      const firstCard = screen.getByTestId('place-card-1');
      expect(firstCard).toHaveAttribute('data-type', 'default');
    });

    it('should pass correct type to PlaceCard for near list', () => {
      renderWithProviders(<OffersList offers={mockOffers} listType="near" />);

      const firstCard = screen.getByTestId('place-card-1');
      expect(firstCard).toHaveAttribute('data-type', 'near');
    });

    it('should pass offer data to PlaceCard', () => {
      renderWithProviders(<OffersList offers={mockOffers} listType="default" />);

      expect(screen.getByText(/Expensive apartment/)).toBeInTheDocument();
      expect(screen.getByText(/Cheap room/)).toBeInTheDocument();
      expect(screen.getByText(/Medium house/)).toBeInTheDocument();
    });
  });
});
