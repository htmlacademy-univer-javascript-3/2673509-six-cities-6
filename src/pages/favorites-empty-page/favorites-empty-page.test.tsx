import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FavoritesEmptyPage } from './favorites-empty-page';

vi.mock('../../components/logo/logo', () => ({
  Logo: () => <div>Logo</div>,
}));

vi.mock('../../components/footer/footer', () => ({
  Footer: () => <div>Footer</div>,
}));

const mockUserEmail = 'Oliver.conner@gmail.com';
const mockFavoriteCount = '0';

const renderWithRouter = () =>
  render(
    <MemoryRouter>
      <FavoritesEmptyPage />
    </MemoryRouter>
  );

describe('FavoritesEmptyPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render Logo component', () => {
    renderWithRouter();

    expect(screen.getByText('Logo')).toBeInTheDocument();
  });

  it('should render Footer component', () => {
    renderWithRouter();

    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('should render header navigation', () => {
    const { container } = renderWithRouter();

    expect(container.querySelector('.header__nav')).toBeInTheDocument();
    expect(container.querySelector('.header__nav-list')).toBeInTheDocument();
  });

  it('should render user email', () => {
    renderWithRouter();

    expect(screen.getByText(mockUserEmail)).toBeInTheDocument();
  });

  it('should render favorite count as 0', () => {
    renderWithRouter();

    expect(screen.getByText(mockFavoriteCount)).toBeInTheDocument();
  });

  it('should render link to favorites page', () => {
    renderWithRouter();

    const favoritesLink = screen.getByRole('link', { name: /Oliver.conner@gmail.com/i });
    expect(favoritesLink).toBeInTheDocument();
    expect(favoritesLink).toHaveAttribute('href', '/favorites');
  });

  it('should render sign out link', () => {
    renderWithRouter();

    const signOutLink = screen.getByRole('link', { name: /Sign out/i });
    expect(signOutLink).toBeInTheDocument();
    expect(signOutLink).toHaveAttribute('href', '/login');
  });

  it('should render empty favorites heading', () => {
    renderWithRouter();

    const heading = screen.getByText('Favorites (empty)');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('visually-hidden');
  });

  it('should render empty state message', () => {
    renderWithRouter();

    expect(screen.getByText('Nothing yet saved.')).toBeInTheDocument();
  });

  it('should render empty state description', () => {
    renderWithRouter();

    expect(
      screen.getByText('Save properties to narrow down search or plan your future trips.')
    ).toBeInTheDocument();
  });

  it('should have correct page class', () => {
    const { container } = renderWithRouter();

    const pageDiv = container.querySelector('.page');
    expect(pageDiv).toHaveClass('page--favorites-empty');
  });

  it('should render main element with correct classes', () => {
    const { container } = renderWithRouter();

    const main = container.querySelector('main');
    expect(main).toHaveClass('page__main', 'page__main--favorites', 'page__main--favorites-empty');
  });

  it('should render favorites section with empty class', () => {
    const { container } = renderWithRouter();

    const favoritesSection = container.querySelector('.favorites');
    expect(favoritesSection).toHaveClass('favorites--empty');
  });

  it('should render favorites status wrapper', () => {
    const { container } = renderWithRouter();

    expect(container.querySelector('.favorites__status-wrapper')).toBeInTheDocument();
  });

  it('should render favorites status as bold text', () => {
    const { container } = renderWithRouter();

    const statusElement = container.querySelector('.favorites__status');
    expect(statusElement?.tagName).toBe('B');
    expect(statusElement?.textContent).toBe('Nothing yet saved.');
  });

  it('should render favorites status description as paragraph', () => {
    const { container } = renderWithRouter();

    const descriptionElement = container.querySelector('.favorites__status-description');
    expect(descriptionElement?.tagName).toBe('P');
  });

  it('should render header with correct structure', () => {
    const { container } = renderWithRouter();

    expect(container.querySelector('.header')).toBeInTheDocument();
    expect(container.querySelector('.header__wrapper')).toBeInTheDocument();
    expect(container.querySelector('.header__left')).toBeInTheDocument();
  });

  it('should render user avatar wrapper', () => {
    const { container } = renderWithRouter();

    expect(container.querySelector('.header__avatar-wrapper')).toBeInTheDocument();
    expect(container.querySelector('.user__avatar-wrapper')).toBeInTheDocument();
  });

  it('should render header navigation items', () => {
    const { container } = renderWithRouter();

    const navItems = container.querySelectorAll('.header__nav-item');
    expect(navItems).toHaveLength(2);
  });

  it('should render user navigation item with correct class', () => {
    const { container } = renderWithRouter();

    const userNavItem = container.querySelector('.header__nav-item.user');
    expect(userNavItem).toBeInTheDocument();
  });

  it('should render profile link with correct classes', () => {
    const { container } = renderWithRouter();

    const profileLink = container.querySelector('.header__nav-link--profile');
    expect(profileLink).toBeInTheDocument();
    expect(profileLink).toHaveClass('header__nav-link');
  });

  it('should render container for page content', () => {
    const { container } = renderWithRouter();

    const pageContainer = container.querySelector('.page__favorites-container.container');
    expect(pageContainer).toBeInTheDocument();
  });

  it('should render header container', () => {
    const { container } = renderWithRouter();

    const headerContainer = container.querySelector('.header .container');
    expect(headerContainer).toBeInTheDocument();
  });

  it('should render user name with correct class', () => {
    const { container } = renderWithRouter();

    const userName = container.querySelector('.header__user-name.user__name');
    expect(userName).toBeInTheDocument();
    expect(userName?.textContent).toBe(mockUserEmail);
  });

  it('should render favorite count with correct class', () => {
    const { container } = renderWithRouter();

    const favoriteCount = container.querySelector('.header__favorite-count');
    expect(favoriteCount).toBeInTheDocument();
    expect(favoriteCount?.textContent).toBe(mockFavoriteCount);
  });

  it('should render sign out text', () => {
    const { container } = renderWithRouter();

    const signOut = container.querySelector('.header__signout');
    expect(signOut).toBeInTheDocument();
    expect(signOut?.textContent).toBe('Sign out');
  });
});
