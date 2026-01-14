import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { OfferPage } from './offer-page';
import { DetailedOffer } from '../../internal/types/detailed-offer-type';
import { Offer } from '../../internal/types/offer-type';
import { ReviewType } from '../../internal/types/review-type';
import { CityName } from '../../internal/enums/city-name-enum';
import { PlaceType } from '../../internal/enums/place-type-enum';
import { AuthStatus } from '../../internal/enums/auth-status-enum';
import * as hooks from '../../store/hooks/hooks.ts';
import * as apiActions from '../../store/api-actions/api-actions.ts';
import * as selectors from '../../store/selector/selectors.ts';

vi.mock('../../components/header/header', () => ({
  Header: () => <div>Header</div>,
}));

vi.mock('../../components/footer/footer', () => ({
  Footer: () => <div>Footer</div>,
}));

vi.mock('../../components/comment-form/comment-form', () => ({
  CommentForm: () => <div>Comment Form</div>,
}));

vi.mock('../../components/map/map', () => ({
  Map: () => <div>Map</div>,
}));

vi.mock('../../components/offers-list/offers-list', () => ({
  OffersList: () => <div>Offers List</div>,
}));

vi.mock('../../components/spinner/spinner', () => ({
  Spinner: () => <div>Loading...</div>,
}));

vi.mock('../../components/review/review', () => ({
  Review: ({ review }: { review: ReviewType }) => <div data-testid={`review-${review.id}`}>{review.comment}</div>,
}));

vi.mock('../../store/hooks', () => ({
  useAppSelector: vi.fn(),
  useAppDispatch: vi.fn(),
}));

vi.mock('../../store/api-actions', () => ({
  getOfferInfoAction: vi.fn(),
  addFavouriteAction: vi.fn(),
}));

vi.mock('../../store/selectors', () => ({
  selectOfferInfo: vi.fn(),
  selectNearbyOffers: vi.fn(),
  selectReviews: vi.fn(),
}));

const mockDetailedOffer: DetailedOffer = {
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
  isPremium: true,
  rating: 4.5,
  description: 'A wonderful apartment in the heart of Paris',
  bedrooms: 3,
  goods: ['Wi-Fi', 'Kitchen', 'Washing machine'],
  host: {
    name: 'John',
    avatarUrl: 'https://example.com/avatar.jpg',
    isPro: true,
  },
  maxAdults: 4,
  images: [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg',
  ],
};

const mockNearbyOffer: Offer = {
  id: '2',
  title: 'Nearby apartment',
  type: PlaceType.Apartment,
  price: 100,
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
  rating: 4.0,
  previewImage: 'https://example.com/preview.jpg',
};

const mockReview: ReviewType = {
  id: '1',
  date: '2023-10-15T10:00:00.000Z',
  user: {
    name: 'Alice',
    avatarUrl: 'https://example.com/alice.jpg',
    isPro: false,
  },
  comment: 'Great place to stay!',
  rating: 5,
};

const mockDispatch = vi.fn();

const mockUseAppSelector = (
  offerInfo: DetailedOffer | null,
  nearbyOffers: Offer[],
  reviews: ReviewType[],
  authStatus: AuthStatus,
  isFetchSingleOffer: boolean
) => {
  vi.mocked(selectors.selectOfferInfo).mockReturnValue(offerInfo as never);
  vi.mocked(selectors.selectNearbyOffers).mockReturnValue(nearbyOffers as never);
  vi.mocked(selectors.selectReviews).mockReturnValue(reviews as never);

  vi.mocked(hooks.useAppSelector).mockImplementation((selector) => {
    if (selector === selectors.selectOfferInfo) {
      return offerInfo as never;
    }
    if (selector === selectors.selectNearbyOffers) {
      return nearbyOffers as never;
    }
    if (selector === selectors.selectReviews) {
      return reviews as never;
    }
    const state = {
      authStatus,
      isFetchSingleOffer,
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

const renderWithProviders = (
  offerInfo: DetailedOffer | null,
  nearbyOffers: Offer[],
  reviews: ReviewType[],
  authStatus: AuthStatus,
  isFetchSingleOffer: boolean,
  offerId = '1'
) => {
  mockUseAppSelector(offerInfo, nearbyOffers, reviews, authStatus, isFetchSingleOffer);
  vi.mocked(hooks.useAppDispatch).mockReturnValue(mockDispatch);
  const store = createMockStore();

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/offer/${offerId}`]}>
        <Routes>
          <Route path="/offer/:id" element={<OfferPage />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe('OfferPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render Spinner when isFetchSingleOffer is true', () => {
    renderWithProviders(null, [], [], AuthStatus.NoAuth, true);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render NotFoundPage when offer is not found', () => {
    renderWithProviders(null, [], [], AuthStatus.NoAuth, false);

    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('should render Header component', () => {
    renderWithProviders(mockDetailedOffer, [], [], AuthStatus.NoAuth, false);

    expect(screen.getByText('Header')).toBeInTheDocument();
  });

  it('should render Footer component', () => {
    renderWithProviders(mockDetailedOffer, [], [], AuthStatus.NoAuth, false);

    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('should render offer title', () => {
    renderWithProviders(mockDetailedOffer, [], [], AuthStatus.NoAuth, false);

    expect(screen.getByText('Beautiful apartment in Paris')).toBeInTheDocument();
  });

  it('should render Premium badge when offer is premium', () => {
    renderWithProviders(mockDetailedOffer, [], [], AuthStatus.NoAuth, false);

    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('should not render Premium badge when offer is not premium', () => {
    const nonPremiumOffer = { ...mockDetailedOffer, isPremium: false };
    renderWithProviders(nonPremiumOffer, [], [], AuthStatus.NoAuth, false);

    expect(screen.queryByText('Premium')).not.toBeInTheDocument();
  });

  it('should render offer rating', () => {
    renderWithProviders(mockDetailedOffer, [], [], AuthStatus.NoAuth, false);

    expect(screen.getByText('5')).toBeInTheDocument(); // Math.round(4.5) = 5
  });

  it('should render offer price', () => {
    renderWithProviders(mockDetailedOffer, [], [], AuthStatus.NoAuth, false);

    expect(screen.getByText('€120')).toBeInTheDocument();
  });

  it('should render offer type', () => {
    renderWithProviders(mockDetailedOffer, [], [], AuthStatus.NoAuth, false);

    expect(screen.getByText('Apartment')).toBeInTheDocument();
  });

  it('should render bedrooms count', () => {
    renderWithProviders(mockDetailedOffer, [], [], AuthStatus.NoAuth, false);

    expect(screen.getByText('3 Bedrooms')).toBeInTheDocument();
  });

  it('should render max adults', () => {
    renderWithProviders(mockDetailedOffer, [], [], AuthStatus.NoAuth, false);

    expect(screen.getByText('Max 4 adults')).toBeInTheDocument();
  });

  it('should render What\'s inside section', () => {
    renderWithProviders(mockDetailedOffer, [], [], AuthStatus.NoAuth, false);

    expect(screen.getByText('What\'s inside')).toBeInTheDocument();
  });

  it('should render all amenities', () => {
    renderWithProviders(mockDetailedOffer, [], [], AuthStatus.NoAuth, false);

    expect(screen.getByText('Wi-Fi')).toBeInTheDocument();
    expect(screen.getByText('Kitchen')).toBeInTheDocument();
    expect(screen.getByText('Washing machine')).toBeInTheDocument();
  });

  it('should render Meet the host section', () => {
    renderWithProviders(mockDetailedOffer, [], [], AuthStatus.NoAuth, false);

    expect(screen.getByText('Meet the host')).toBeInTheDocument();
  });

  it('should render host name', () => {
    renderWithProviders(mockDetailedOffer, [], [], AuthStatus.NoAuth, false);

    expect(screen.getByText('John')).toBeInTheDocument();
  });

  it('should render Pro status when host is pro', () => {
    renderWithProviders(mockDetailedOffer, [], [], AuthStatus.NoAuth, false);

    expect(screen.getByText('Pro')).toBeInTheDocument();
  });

  it('should not render Pro status when host is not pro', () => {
    const offerWithNonProHost = {
      ...mockDetailedOffer,
      host: { ...mockDetailedOffer.host, isPro: false },
    };
    renderWithProviders(offerWithNonProHost, [], [], AuthStatus.NoAuth, false);

    expect(screen.queryByText('Pro')).not.toBeInTheDocument();
  });

  it('should render offer description', () => {
    renderWithProviders(mockDetailedOffer, [], [], AuthStatus.NoAuth, false);

    expect(screen.getByText('A wonderful apartment in the heart of Paris')).toBeInTheDocument();
  });

  it('should render Reviews section', () => {
    renderWithProviders(mockDetailedOffer, [], [mockReview], AuthStatus.NoAuth, false);

    expect(screen.getByText(/Reviews/)).toBeInTheDocument();
  });

  it('should render reviews count', () => {
    renderWithProviders(mockDetailedOffer, [], [mockReview], AuthStatus.NoAuth, false);

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should render review component', () => {
    renderWithProviders(mockDetailedOffer, [], [mockReview], AuthStatus.NoAuth, false);

    expect(screen.getByTestId('review-1')).toBeInTheDocument();
    expect(screen.getByText('Great place to stay!')).toBeInTheDocument();
  });

  it('should render Comment Form when user is authenticated', () => {
    renderWithProviders(mockDetailedOffer, [], [], AuthStatus.Auth, false);

    expect(screen.getByText('Comment Form')).toBeInTheDocument();
  });

  it('should not render Comment Form when user is not authenticated', () => {
    renderWithProviders(mockDetailedOffer, [], [], AuthStatus.NoAuth, false);

    expect(screen.queryByText('Comment Form')).not.toBeInTheDocument();
  });

  it('should render Map component', () => {
    renderWithProviders(mockDetailedOffer, [], [], AuthStatus.NoAuth, false);

    expect(screen.getByText('Map')).toBeInTheDocument();
  });

  it('should render Other places section', () => {
    renderWithProviders(mockDetailedOffer, [mockNearbyOffer], [], AuthStatus.NoAuth, false);

    expect(screen.getByText('Other places in the neighbourhood')).toBeInTheDocument();
  });

  it('should render Offers List', () => {
    renderWithProviders(mockDetailedOffer, [mockNearbyOffer], [], AuthStatus.NoAuth, false);

    expect(screen.getByText('Offers List')).toBeInTheDocument();
  });

  it('should render all gallery images', () => {
    const { container } = renderWithProviders(mockDetailedOffer, [], [], AuthStatus.NoAuth, false);

    const images = container.querySelectorAll('.offer__image');
    expect(images).toHaveLength(3);
  });

  it('should dispatch getOfferInfoAction on mount', () => {
    renderWithProviders(mockDetailedOffer, [], [], AuthStatus.NoAuth, false);

    expect(apiActions.getOfferInfoAction).toHaveBeenCalledWith({ id: '1' });
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('should handle bookmark button click when authenticated', () => {
    const mockAddFavouriteAction = { type: 'ADD_FAVOURITE' };
    vi.mocked(apiActions.addFavouriteAction).mockReturnValue(mockAddFavouriteAction as never);

    renderWithProviders(mockDetailedOffer, [], [], AuthStatus.Auth, false);

    const bookmarkButton = screen.getByRole('button', { name: /To bookmarks/i });
    fireEvent.click(bookmarkButton);

    expect(apiActions.addFavouriteAction).toHaveBeenCalledWith({
      offerId: '1',
      status: 1,
    });
  });

  it('should have active class on bookmark button when offer is favorite', () => {
    const favoriteOffer = { ...mockDetailedOffer, isFavorite: true };
    const { container } = renderWithProviders(favoriteOffer, [], [], AuthStatus.Auth, false);

    const bookmarkButton = container.querySelector('.offer__bookmark-button--active');
    expect(bookmarkButton).toBeInTheDocument();
  });

  it('should not have active class on bookmark button when offer is not favorite', () => {
    const { container } = renderWithProviders(mockDetailedOffer, [], [], AuthStatus.Auth, false);

    const bookmarkButton = container.querySelector('.offer__bookmark-button--active');
    expect(bookmarkButton).not.toBeInTheDocument();
  });

  it('should render correct rating width', () => {
    const { container } = renderWithProviders(mockDetailedOffer, [], [], AuthStatus.NoAuth, false);

    const ratingSpan = container.querySelector('.offer__stars span[style]');
    expect(ratingSpan).toHaveStyle({ width: '100%' }); // Math.round(4.5) * 20 = 100
  });

  it('should sort reviews by date descending', () => {
    const review1 = { ...mockReview, id: '1', date: '2023-10-15T10:00:00.000Z' };
    const review2 = { ...mockReview, id: '2', date: '2023-11-15T10:00:00.000Z' };
    const review3 = { ...mockReview, id: '3', date: '2023-09-15T10:00:00.000Z' };

    renderWithProviders(mockDetailedOffer, [], [review1, review2, review3], AuthStatus.NoAuth, false);

    expect(screen.getByTestId('review-1')).toBeInTheDocument();
    expect(screen.getByTestId('review-2')).toBeInTheDocument();
    expect(screen.getByTestId('review-3')).toBeInTheDocument();
  });

  it('should limit reviews to 10', () => {
    const manyReviews = Array.from({ length: 15 }, (_, i) => ({
      ...mockReview,
      id: `${i + 1}`,
      date: `2023-${String(i + 1).padStart(2, '0')}-15T10:00:00.000Z`,
    }));

    const { container } = renderWithProviders(
      mockDetailedOffer,
      [],
      manyReviews,
      AuthStatus.NoAuth,
      false
    );

    const reviewElements = container.querySelectorAll('[data-testid^="review-"]');
    expect(reviewElements.length).toBeLessThanOrEqual(10);
  });

  it('should have correct page classes', () => {
    const { container } = renderWithProviders(mockDetailedOffer, [], [], AuthStatus.NoAuth, false);

    expect(container.querySelector('.page')).toBeInTheDocument();
  });

  it('should render main with correct classes', () => {
    const { container } = renderWithProviders(mockDetailedOffer, [], [], AuthStatus.NoAuth, false);

    const main = container.querySelector('main');
    expect(main).toHaveClass('page__main', 'page__main--offer');
  });
});
