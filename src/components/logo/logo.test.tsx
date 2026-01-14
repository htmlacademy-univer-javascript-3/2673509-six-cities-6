import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Logo } from './logo';
import { AppRouteEnum } from '../../internal/enums/app-route-enum';

const renderWithRouter = (component: React.ReactElement) => render(
  <BrowserRouter>{component}</BrowserRouter>
);

describe('Logo Component', () => {
  describe('Rendering', () => {
    it('should render logo link', () => {
      renderWithRouter(<Logo />);

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
    });

    it('should link to main page', () => {
      renderWithRouter(<Logo />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', AppRouteEnum.MainPage);
    });

    it('should have correct CSS classes for link', () => {
      const { container } = renderWithRouter(<Logo />);

      const link = container.querySelector('.header__logo-link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveClass('header__logo-link', 'header__logo-link--active');
    });
  });

  describe('Logo image', () => {
    it('should render logo image', () => {
      renderWithRouter(<Logo />);

      const logo = screen.getByAltText('6 cities logo');
      expect(logo).toBeInTheDocument();
    });

    it('should have correct src attribute', () => {
      renderWithRouter(<Logo />);

      const logo = screen.getByAltText('6 cities logo');
      expect(logo).toHaveAttribute('src', 'img/logo.svg');
    });

    it('should have correct alt text', () => {
      renderWithRouter(<Logo />);

      const logo = screen.getByAltText('6 cities logo');
      expect(logo).toHaveAttribute('alt', '6 cities logo');
    });

    it('should have correct width attribute', () => {
      renderWithRouter(<Logo />);

      const logo = screen.getByAltText('6 cities logo');
      expect(logo).toHaveAttribute('width', '81');
    });

    it('should have correct height attribute', () => {
      renderWithRouter(<Logo />);

      const logo = screen.getByAltText('6 cities logo');
      expect(logo).toHaveAttribute('height', '41');
    });

    it('should have correct CSS class for image', () => {
      const { container } = renderWithRouter(<Logo />);

      const logoImage = container.querySelector('.header__logo');
      expect(logoImage).toBeInTheDocument();
      expect(logoImage).toHaveClass('header__logo');
    });
  });

  describe('Structure', () => {
    it('should render logo image inside link', () => {
      const { container } = renderWithRouter(<Logo />);

      const link = container.querySelector('.header__logo-link');
      const logo = link?.querySelector('.header__logo');

      expect(logo).toBeInTheDocument();
    });

    it('should render only one link', () => {
      renderWithRouter(<Logo />);

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(1);
    });

    it('should render only one image', () => {
      renderWithRouter(<Logo />);

      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(1);
    });
  });

  describe('Accessibility', () => {
    it('should have accessible image with alt text', () => {
      renderWithRouter(<Logo />);

      const logo = screen.getByRole('img', { name: /6 cities logo/i });
      expect(logo).toBeInTheDocument();
    });

    it('should have link accessible by role', () => {
      renderWithRouter(<Logo />);

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
    });
  });
});
