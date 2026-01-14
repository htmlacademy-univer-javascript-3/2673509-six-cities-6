import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { OfferNotLoggedPage } from './offer-not-logged-page';

vi.mock('../../components/logo/logo', () => ({
  Logo: () => <div>Logo</div>,
}));

const mockOfferTitle = 'Beautiful & luxurious studio at great location';
const mockHostName = 'Angelina';
const mockReviewerName = 'Max';
const mockRatingValue = '4.8';
const mockPrice = '€120';
const mockReviewsAmount = '1';

const renderWithRouter = () =>
  render(
    <MemoryRouter>
      <OfferNotLoggedPage />
    </MemoryRouter>
  );

describe('OfferNotLoggedPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render Logo component', () => {
    renderWithRouter();

    expect(screen.getByText('Logo')).toBeInTheDocument();
  });

  it('should render Sign in link', () => {
    renderWithRouter();

    const signInLink = screen.getByText('Sign in');
    expect(signInLink).toBeInTheDocument();
  });

  it('should render Sign in link with correct href', () => {
    renderWithRouter();

    const signInLink = screen.getByRole('link', { name: /Sign in/i });
    expect(signInLink).toHaveAttribute('href', '/login');
  });

  it('should render offer title', () => {
    renderWithRouter();

    expect(screen.getByText(mockOfferTitle)).toBeInTheDocument();
  });

  it('should render Premium badge', () => {
    renderWithRouter();

    const premiumBadges = screen.getAllByText('Premium');
    expect(premiumBadges.length).toBeGreaterThan(0);
  });

  it('should render rating value', () => {
    renderWithRouter();

    expect(screen.getByText(mockRatingValue)).toBeInTheDocument();
  });

  it('should render price', () => {
    renderWithRouter();

    expect(screen.getByText(mockPrice)).toBeInTheDocument();
  });

  it('should render What\'s inside section', () => {
    renderWithRouter();

    expect(screen.getByText('What\'s inside')).toBeInTheDocument();
  });

  it('should render amenities list', () => {
    renderWithRouter();

    expect(screen.getByText('Wi-Fi')).toBeInTheDocument();
    expect(screen.getByText('Washing machine')).toBeInTheDocument();
    expect(screen.getByText('Kitchen')).toBeInTheDocument();
    expect(screen.getByText('Coffee machine')).toBeInTheDocument();
  });

  it('should render all 10 amenities', () => {
    renderWithRouter();

    expect(screen.getByText('Wi-Fi')).toBeInTheDocument();
    expect(screen.getByText('Washing machine')).toBeInTheDocument();
    expect(screen.getByText('Towels')).toBeInTheDocument();
    expect(screen.getByText('Heating')).toBeInTheDocument();
    expect(screen.getByText('Coffee machine')).toBeInTheDocument();
    expect(screen.getByText('Baby seat')).toBeInTheDocument();
    expect(screen.getByText('Kitchen')).toBeInTheDocument();
    expect(screen.getByText('Dishwasher')).toBeInTheDocument();
    expect(screen.getByText('Cabel TV')).toBeInTheDocument();
    expect(screen.getByText('Fridge')).toBeInTheDocument();
  });

  it('should render Meet the host section', () => {
    renderWithRouter();

    expect(screen.getByText('Meet the host')).toBeInTheDocument();
  });

  it('should render host name', () => {
    renderWithRouter();

    expect(screen.getByText(mockHostName)).toBeInTheDocument();
  });

  it('should render Pro status for host', () => {
    renderWithRouter();

    expect(screen.getByText('Pro')).toBeInTheDocument();
  });

  it('should render Reviews section', () => {
    renderWithRouter();

    expect(screen.getByText(/Reviews/)).toBeInTheDocument();
  });

  it('should render reviews amount', () => {
    renderWithRouter();

    expect(screen.getByText(mockReviewsAmount)).toBeInTheDocument();
  });

  it('should render reviewer name', () => {
    renderWithRouter();

    expect(screen.getByText(mockReviewerName)).toBeInTheDocument();
  });

  it('should render review text', () => {
    const { container } = renderWithRouter();

    const reviewTexts = container.querySelectorAll('.reviews__text');
    expect(reviewTexts.length).toBeGreaterThan(0);
  });

  it('should render review date', () => {
    renderWithRouter();

    expect(screen.getByText('April 2019')).toBeInTheDocument();
  });

  it('should render 6 gallery images', () => {
    const { container } = renderWithRouter();

    const galleryImages = container.querySelectorAll('.offer__image');
    expect(galleryImages).toHaveLength(6);
  });

  it('should render Other places section', () => {
    renderWithRouter();

    expect(screen.getByText('Other places in the neighbourhood')).toBeInTheDocument();
  });

  it('should render 3 nearby places', () => {
    const { container } = renderWithRouter();

    const nearbyPlaces = container.querySelectorAll('.near-places__card');
    expect(nearbyPlaces).toHaveLength(3);
  });

  it('should render nearby place names', () => {
    renderWithRouter();

    expect(screen.getByText('Wood and stone place')).toBeInTheDocument();
    expect(screen.getByText('Canal View Prinsengracht')).toBeInTheDocument();
    expect(screen.getByText('Nice, cozy, warm big bed apartment')).toBeInTheDocument();
  });

  it('should render nearby place prices', () => {
    renderWithRouter();

    expect(screen.getByText('€80')).toBeInTheDocument();
    expect(screen.getByText('€132')).toBeInTheDocument();
    expect(screen.getByText('€180')).toBeInTheDocument();
  });

  it('should render nearby place types', () => {
    renderWithRouter();

    expect(screen.getByText('Room')).toBeInTheDocument();
    const apartments = screen.getAllByText('Apartment');
    expect(apartments.length).toBeGreaterThan(0);
  });

  it('should have correct page class', () => {
    const { container } = renderWithRouter();

    expect(container.querySelector('.page')).toBeInTheDocument();
  });

  it('should render main element with correct classes', () => {
    const { container } = renderWithRouter();

    const main = container.querySelector('main');
    expect(main).toHaveClass('page__main', 'page__main--offer');
  });

  it('should render header', () => {
    const { container } = renderWithRouter();

    expect(container.querySelector('.header')).toBeInTheDocument();
  });

  it('should render header navigation', () => {
    const { container } = renderWithRouter();

    expect(container.querySelector('.header__nav')).toBeInTheDocument();
  });

  it('should render avatar wrapper', () => {
    const { container } = renderWithRouter();

    expect(container.querySelector('.header__avatar-wrapper')).toBeInTheDocument();
  });

  it('should render offer section', () => {
    const { container } = renderWithRouter();

    expect(container.querySelector('.offer')).toBeInTheDocument();
  });

  it('should render offer gallery container', () => {
    const { container } = renderWithRouter();

    expect(container.querySelector('.offer__gallery-container')).toBeInTheDocument();
  });

  it('should render offer gallery', () => {
    const { container } = renderWithRouter();

    expect(container.querySelector('.offer__gallery')).toBeInTheDocument();
  });

  it('should render offer container', () => {
    const { container } = renderWithRouter();

    expect(container.querySelector('.offer__container')).toBeInTheDocument();
  });

  it('should render offer wrapper', () => {
    const { container } = renderWithRouter();

    expect(container.querySelector('.offer__wrapper')).toBeInTheDocument();
  });

  it('should render offer mark with Premium', () => {
    const { container } = renderWithRouter();

    const offerMark = container.querySelector('.offer__mark');
    expect(offerMark?.textContent).toBe('Premium');
  });

  it('should render offer name as h1', () => {
    const { container } = renderWithRouter();

    const offerName = container.querySelector('.offer__name');
    expect(offerName?.tagName).toBe('H1');
  });

  it('should render rating with correct width', () => {
    const { container } = renderWithRouter();

    const ratingSpan = container.querySelector('.offer__stars span[style]');
    expect(ratingSpan).toHaveStyle({ width: '80%' });
  });

  it('should render offer features list', () => {
    const { container } = renderWithRouter();

    const features = container.querySelectorAll('.offer__feature');
    expect(features).toHaveLength(3);
  });

  it('should render offer price section', () => {
    const { container } = renderWithRouter();

    expect(container.querySelector('.offer__price')).toBeInTheDocument();
  });

  it('should render offer inside section', () => {
    const { container } = renderWithRouter();

    expect(container.querySelector('.offer__inside')).toBeInTheDocument();
  });

  it('should render 10 inside items', () => {
    const { container } = renderWithRouter();

    const insideItems = container.querySelectorAll('.offer__inside-item');
    expect(insideItems).toHaveLength(10);
  });

  it('should render offer host section', () => {
    const { container } = renderWithRouter();

    expect(container.querySelector('.offer__host')).toBeInTheDocument();
  });

  it('should render host avatar', () => {
    const { container } = renderWithRouter();

    const hostAvatar = container.querySelector('.offer__avatar');
    expect(hostAvatar).toBeInTheDocument();
  });

  it('should render host with Pro status wrapper', () => {
    const { container } = renderWithRouter();

    const proWrapper = container.querySelector('.offer__avatar-wrapper--pro');
    expect(proWrapper).toBeInTheDocument();
  });

  it('should render 2 description paragraphs', () => {
    const { container } = renderWithRouter();

    const descriptions = container.querySelectorAll('.offer__text');
    expect(descriptions).toHaveLength(2);
  });

  it('should render reviews section', () => {
    const { container } = renderWithRouter();

    expect(container.querySelector('.offer__reviews')).toBeInTheDocument();
  });

  it('should render reviews list', () => {
    const { container } = renderWithRouter();

    expect(container.querySelector('.reviews__list')).toBeInTheDocument();
  });

  it('should render offer map section', () => {
    const { container } = renderWithRouter();

    expect(container.querySelector('.offer__map')).toBeInTheDocument();
  });

  it('should render near places section', () => {
    const { container } = renderWithRouter();

    expect(container.querySelector('.near-places')).toBeInTheDocument();
  });

  it('should render all links to main page in nearby places', () => {
    const { container } = renderWithRouter();

    const links = container.querySelectorAll('.near-places__card a');
    links.forEach((link) => {
      expect(link).toHaveAttribute('href', '/');
    });
  });

  it('should render In bookmarks text', () => {
    renderWithRouter();

    expect(screen.getByText('In bookmarks')).toBeInTheDocument();
  });

  it('should render visually hidden Rating texts', () => {
    const { container } = renderWithRouter();

    const ratingTexts = container.querySelectorAll('.visually-hidden');
    const ratingElements = Array.from(ratingTexts).filter(
      (el) => el.textContent === 'Rating'
    );
    expect(ratingElements.length).toBeGreaterThan(0);
  });
});
