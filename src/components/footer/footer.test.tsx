import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Footer } from './footer';
import { AppRouteEnum } from '../../internal/enums/app-route-enum';

const renderWithRouter = (component: React.ReactElement) => render(
  <BrowserRouter>{component}</BrowserRouter>
);

describe('Footer Component', () => {
  describe('Rendering', () => {
    it('should render footer element', () => {
      const { container } = renderWithRouter(<Footer />);

      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
    });

    it('should have correct CSS classes', () => {
      const { container } = renderWithRouter(<Footer />);

      const footer = container.querySelector('footer');
      expect(footer).toHaveClass('footer', 'container');
    });
  });

  describe('Logo link', () => {
    it('should render link to main page', () => {
      renderWithRouter(<Footer />);

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', AppRouteEnum.MainPage);
    });

    it('should have correct CSS class for logo link', () => {
      const { container } = renderWithRouter(<Footer />);

      const logoLink = container.querySelector('.footer__logo-link');
      expect(logoLink).toBeInTheDocument();
      expect(logoLink).toHaveClass('footer__logo-link');
    });
  });

  describe('Logo image', () => {
    it('should render logo image', () => {
      renderWithRouter(<Footer />);

      const logo = screen.getByAltText('6 cities logo');
      expect(logo).toBeInTheDocument();
    });

    it('should have correct src attribute', () => {
      renderWithRouter(<Footer />);

      const logo = screen.getByAltText('6 cities logo');
      expect(logo).toHaveAttribute('src', 'img/logo.svg');
    });

    it('should have correct width attribute', () => {
      renderWithRouter(<Footer />);

      const logo = screen.getByAltText('6 cities logo');
      expect(logo).toHaveAttribute('width', '64');
    });

    it('should have correct height attribute', () => {
      renderWithRouter(<Footer />);

      const logo = screen.getByAltText('6 cities logo');
      expect(logo).toHaveAttribute('height', '33');
    });

    it('should have correct CSS class for logo', () => {
      const { container } = renderWithRouter(<Footer />);

      const logo = container.querySelector('.footer__logo');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveClass('footer__logo');
    });

    it('should have correct alt text', () => {
      renderWithRouter(<Footer />);

      const logo = screen.getByAltText('6 cities logo');
      expect(logo).toHaveAttribute('alt', '6 cities logo');
    });
  });

  describe('Structure', () => {
    it('should render logo inside link', () => {
      const { container } = renderWithRouter(<Footer />);

      const link = container.querySelector('.footer__logo-link');
      const logo = link?.querySelector('.footer__logo');

      expect(logo).toBeInTheDocument();
    });

    it('should render only one link', () => {
      renderWithRouter(<Footer />);

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(1);
    });

    it('should render only one image', () => {
      renderWithRouter(<Footer />);

      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(1);
    });
  });
});
