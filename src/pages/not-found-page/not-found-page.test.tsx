import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NotFoundPage } from './not-found-page';
import { AppRouteEnum } from '../../internal/enums/app-route-enum';

const mock404Text = '404';
const mockErrorMessage = 'Oops! The page you are looking for does not exist.';
const mockBackToHomeText = 'Back to Home';

const renderWithRouter = () =>
  render(
    <MemoryRouter>
      <NotFoundPage />
    </MemoryRouter>
  );

describe('NotFoundPage Component', () => {
  beforeEach(() => {
    // Очистка перед каждым тестом
  });

  it('should render 404 heading', () => {
    renderWithRouter();

    const heading = screen.getByText(mock404Text);
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
  });

  it('should render error message', () => {
    renderWithRouter();

    expect(screen.getByText(mockErrorMessage)).toBeInTheDocument();
  });

  it('should render Back to Home link', () => {
    renderWithRouter();

    const link = screen.getByText(mockBackToHomeText);
    expect(link).toBeInTheDocument();
  });

  it('should have correct link to main page', () => {
    renderWithRouter();

    const link = screen.getByRole('link', { name: mockBackToHomeText });
    expect(link).toHaveAttribute('href', AppRouteEnum.MainPage);
  });

  it('should render heading with correct styles', () => {
    renderWithRouter();

    const heading = screen.getByText(mock404Text);
    expect(heading).toHaveStyle({
      fontSize: '6rem',
      fontWeight: 'bold',
      color: '#1f2937',
    });
  });

  it('should render error message as paragraph', () => {
    const { container } = renderWithRouter();

    const paragraph = container.querySelector('p');
    expect(paragraph).toBeInTheDocument();
    expect(paragraph?.textContent).toBe(mockErrorMessage);
  });

  it('should render error message with correct styles', () => {
    const { container } = renderWithRouter();

    const paragraph = container.querySelector('p');
    expect(paragraph).toHaveStyle({
      fontSize: '1.25rem',
      color: '#4b5563',
    });
  });

  it('should render container with flex layout', () => {
    const { container } = renderWithRouter();

    const mainDiv = container.querySelector('div');
    expect(mainDiv).toHaveStyle({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    });
  });

  it('should render container with full viewport height', () => {
    const { container } = renderWithRouter();

    const mainDiv = container.querySelector('div');
    expect(mainDiv).toHaveStyle({
      height: '100vh',
    });
  });

  it('should render container with correct background color', () => {
    const { container } = renderWithRouter();

    const mainDiv = container.querySelector('div');
    expect(mainDiv).toHaveStyle({
      backgroundColor: '#f3f4f6',
    });
  });

  it('should render container with text alignment center', () => {
    const { container } = renderWithRouter();

    const mainDiv = container.querySelector('div');
    expect(mainDiv).toHaveStyle({
      textAlign: 'center',
    });
  });

  it('should render container with padding', () => {
    const { container } = renderWithRouter();

    const mainDiv = container.querySelector('div');
    expect(mainDiv).toHaveStyle({
      padding: '16px',
    });
  });

  it('should render heading with margin bottom', () => {
    renderWithRouter();

    const heading = screen.getByText(mock404Text);
    expect(heading).toHaveStyle({
      marginBottom: '16px',
    });
  });

  it('should render paragraph with margin bottom', () => {
    const { container } = renderWithRouter();

    const paragraph = container.querySelector('p');
    expect(paragraph).toHaveStyle({
      marginBottom: '32px',
    });
  });

  it('should render link with padding', () => {
    renderWithRouter();

    const link = screen.getByRole('link', { name: mockBackToHomeText });
    expect(link).toHaveStyle({
      padding: '12px 24px',
    });
  });

  it('should render link with font size', () => {
    renderWithRouter();

    const link = screen.getByRole('link', { name: mockBackToHomeText });
    expect(link).toHaveStyle({
      fontSize: '1rem',
    });
  });

  it('should render link as inline-block', () => {
    renderWithRouter();

    const link = screen.getByRole('link', { name: mockBackToHomeText });
    expect(link).toHaveStyle({
      display: 'inline-block',
    });
  });

  it('should have all required elements in correct order', () => {
    const { container } = renderWithRouter();

    const mainDiv = container.querySelector('div');
    const children = mainDiv?.children;

    expect(children?.[0].tagName).toBe('H1');
    expect(children?.[1].tagName).toBe('P');
    expect(children?.[2].tagName).toBe('A');
  });

  it('should render exactly one heading', () => {
    const { container } = renderWithRouter();

    const headings = container.querySelectorAll('h1');
    expect(headings).toHaveLength(1);
  });

  it('should render exactly one paragraph', () => {
    const { container } = renderWithRouter();

    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(1);
  });

  it('should render exactly one link', () => {
    const { container } = renderWithRouter();

    const links = container.querySelectorAll('a');
    expect(links).toHaveLength(1);
  });

  it('should be accessible as a link', () => {
    renderWithRouter();

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
  });

  it('should have visible text content', () => {
    renderWithRouter();

    expect(screen.getByText(mock404Text)).toBeVisible();
    expect(screen.getByText(mockErrorMessage)).toBeVisible();
    expect(screen.getByText(mockBackToHomeText)).toBeVisible();
  });
});
