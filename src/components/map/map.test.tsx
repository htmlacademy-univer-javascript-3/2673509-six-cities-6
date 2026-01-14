import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { Map } from './map';
import { City } from '../../internal/types/city';
import { Point } from '../../internal/types/point';
import { Offer } from '../../internal/types/offer-type';
import { CityName } from '../../internal/enums/city-name-enum';
import { PlaceType } from '../../internal/enums/place-type-enum';
import { MapClasses } from '../../internal/enums/map-classes-enum';
import * as Leaflet from 'leaflet';

const mockMarker = {
  setIcon: vi.fn().mockReturnThis(),
  addTo: vi.fn().mockReturnThis(),
};

const mockMap = {
  eachLayer: vi.fn(),
  removeLayer: vi.fn(),
  flyTo: vi.fn(),
};

vi.mock('leaflet', () => ({
  Icon: vi.fn((config) => config),
  Marker: vi.fn(() => mockMarker),
  Map: vi.fn(() => mockMap),
}));

vi.mock('../../hooks/use-map', () => ({
  default: vi.fn(() => mockMap),
}));

describe('Map Component', () => {
  const mockCity: City = {
    name: CityName.Paris,
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      zoom: 10,
    },
  };

  const mockPoints: Point[] = [
    {
      id: '1',
      location: {
        latitude: 48.8566,
        longitude: 2.3522,
        zoom: 10,
      },
    },
    {
      id: '2',
      location: {
        latitude: 48.8606,
        longitude: 2.3376,
        zoom: 10,
      },
    },
  ];

  const mockOffers: Offer[] = [
    {
      id: '1',
      title: 'Beautiful apartment',
      type: PlaceType.Apartment,
      price: 120,
      city: mockCity,
      location: {
        latitude: 48.8566,
        longitude: 2.3522,
        zoom: 10,
      },
      isFavorite: false,
      isBookmarked: false,
      isPremium: false,
      rating: 4.5,
      previewImage: 'https://example.com/image.jpg',
    },
    {
      id: '2',
      title: 'Nice house',
      type: PlaceType.House,
      price: 200,
      city: mockCity,
      location: {
        latitude: 48.8606,
        longitude: 2.3376,
        zoom: 10,
      },
      isFavorite: false,
      isBookmarked: false,
      isPremium: false,
      rating: 4.8,
      previewImage: 'https://example.com/image2.jpg',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockMap.eachLayer.mockImplementation((callback) => {
      callback({ options: { pane: 'markerPane' } });
    });
  });

  describe('Rendering', () => {
    it('should render map section', () => {
      const { container } = render(
        <Map city={mockCity} points={mockPoints} activeOfferId={undefined} />
      );

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('should have correct CSS class', () => {
      const { container } = render(
        <Map city={mockCity} points={mockPoints} activeOfferId={undefined} />
      );

      const section = container.querySelector('section');
      expect(section).toHaveClass(MapClasses.SectionPropertyMapClass);
    });
  });

  describe('Map initialization', () => {
    it('should initialize map', () => {
      const { container } = render(
        <Map city={mockCity} points={mockPoints} activeOfferId={undefined} />
      );

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });
  });

  describe('Markers rendering', () => {
    it('should create markers for all points', () => {
      const MarkerMock = vi.mocked(Leaflet.Marker);

      render(<Map city={mockCity} points={mockPoints} activeOfferId={undefined} />);

      expect(MarkerMock).toHaveBeenCalledTimes(mockPoints.length);
    });

    it('should create marker with correct coordinates', () => {
      const MarkerMock = vi.mocked(Leaflet.Marker);

      render(<Map city={mockCity} points={mockPoints} activeOfferId={undefined} />);

      expect(MarkerMock).toHaveBeenCalledWith({
        lat: mockPoints[0].location.latitude,
        lng: mockPoints[0].location.longitude,
      });
    });

    it('should set icon for markers', () => {
      render(<Map city={mockCity} points={mockPoints} activeOfferId={undefined} />);

      expect(mockMarker.setIcon).toHaveBeenCalled();
    });

    it('should set icon for active marker', () => {
      render(<Map city={mockCity} points={mockPoints} activeOfferId='1' />);

      expect(mockMarker.setIcon).toHaveBeenCalled();
    });

    it('should add markers to map', () => {
      render(<Map city={mockCity} points={mockPoints} activeOfferId={undefined} />);

      expect(mockMarker.addTo).toHaveBeenCalledWith(mockMap);
      expect(mockMarker.addTo).toHaveBeenCalledTimes(mockPoints.length);
    });
  });

  describe('Markers cleanup', () => {
    it('should remove old markers before adding new ones', () => {
      render(<Map city={mockCity} points={mockPoints} activeOfferId={undefined} />);

      expect(mockMap.eachLayer).toHaveBeenCalled();
      expect(mockMap.removeLayer).toHaveBeenCalled();
    });

    it('should only remove marker layers', () => {
      const nonMarkerLayer = { options: { pane: 'tilePane' } };
      const markerLayer = { options: { pane: 'markerPane' } };

      mockMap.eachLayer.mockImplementation((callback) => {
        callback(nonMarkerLayer);
        callback(markerLayer);
      });

      render(<Map city={mockCity} points={mockPoints} activeOfferId={undefined} />);

      expect(mockMap.removeLayer).toHaveBeenCalledWith(markerLayer);
      expect(mockMap.removeLayer).toHaveBeenCalledTimes(1);
    });
  });

  describe('Map view updates', () => {
    it('should fly to city location on mount', () => {
      render(<Map city={mockCity} points={mockPoints} activeOfferId={undefined} />);

      expect(mockMap.flyTo).toHaveBeenCalledWith(
        [mockCity.location.latitude, mockCity.location.longitude],
        mockCity.location.zoom
      );
    });

    it('should fly to new city location when city changes', () => {
      const newCity: City = {
        name: CityName.Amsterdam,
        location: {
          latitude: 52.3676,
          longitude: 4.9041,
          zoom: 12,
        },
      };

      const { rerender } = render(
        <Map city={mockCity} points={mockPoints} activeOfferId={undefined} />
      );

      mockMap.flyTo.mockClear();

      rerender(<Map city={newCity} points={mockPoints} activeOfferId={undefined} />);

      expect(mockMap.flyTo).toHaveBeenCalledWith(
        [newCity.location.latitude, newCity.location.longitude],
        newCity.location.zoom
      );
    });
  });

  describe('Working with Offers', () => {
    it('should handle Offer[] type points', () => {
      const MarkerMock = vi.mocked(Leaflet.Marker);

      render(<Map city={mockCity} points={mockOffers} activeOfferId={undefined} />);

      expect(MarkerMock).toHaveBeenCalledTimes(mockOffers.length);
    });

    it('should create markers for offers with correct coordinates', () => {
      const MarkerMock = vi.mocked(Leaflet.Marker);

      render(<Map city={mockCity} points={mockOffers} activeOfferId='1' />);

      expect(MarkerMock).toHaveBeenCalledWith({
        lat: mockOffers[0].location.latitude,
        lng: mockOffers[0].location.longitude,
      });
    });
  });

  describe('Active marker handling', () => {
    it('should highlight active offer marker', () => {
      mockMarker.setIcon.mockClear();

      render(<Map city={mockCity} points={mockOffers} activeOfferId='1' />);

      expect(mockMarker.setIcon).toHaveBeenCalled();
    });

    it('should update markers when activeOfferId changes', () => {
      const { rerender } = render(
        <Map city={mockCity} points={mockOffers} activeOfferId='1' />
      );

      mockMarker.setIcon.mockClear();

      rerender(<Map city={mockCity} points={mockOffers} activeOfferId='2' />);

      expect(mockMarker.setIcon).toHaveBeenCalled();
    });

    it('should handle undefined activeOfferId', () => {
      render(<Map city={mockCity} points={mockPoints} activeOfferId={undefined} />);

      expect(mockMarker.setIcon).toHaveBeenCalled();
      expect(mockMarker.addTo).toHaveBeenCalled();
    });
  });

  describe('Empty points', () => {
    it('should handle empty points array', () => {
      const MarkerMock = vi.mocked(Leaflet.Marker);

      render(<Map city={mockCity} points={[]} activeOfferId={undefined} />);

      expect(MarkerMock).not.toHaveBeenCalled();
    });

    it('should still render map section with empty points', () => {
      const { container } = render(
        <Map city={mockCity} points={[]} activeOfferId={undefined} />
      );

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });
  });

  describe('Points update', () => {
    it('should update markers when points change', () => {
      const MarkerMock = vi.mocked(Leaflet.Marker);

      const { rerender } = render(
        <Map city={mockCity} points={[mockPoints[0]]} activeOfferId={undefined} />
      );

      expect(MarkerMock).toHaveBeenCalledTimes(1);

      MarkerMock.mockClear();

      rerender(<Map city={mockCity} points={mockPoints} activeOfferId={undefined} />);

      expect(MarkerMock).toHaveBeenCalledTimes(mockPoints.length);
    });
  });
});
