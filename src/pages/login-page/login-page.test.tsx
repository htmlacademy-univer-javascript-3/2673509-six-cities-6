import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from './login-page';

vi.mock('../../components/logo/logo', () => ({
  Logo: () => <div>Logo</div>,
}));

vi.mock('../../components/login/login-form', () => ({
  LoginForm: () => <div>Login Form</div>,
}));

const mockCityName = 'Amsterdam';
const mockLoginTitle = 'Sign in';

const renderWithRouter = () =>
  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );

describe('LoginPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render Logo component', () => {
    renderWithRouter();

    expect(screen.getByText('Logo')).toBeInTheDocument();
  });

  it('should render LoginForm component', () => {
    renderWithRouter();

    expect(screen.getByText('Login Form')).toBeInTheDocument();
  });

  it('should render Sign in title', () => {
    renderWithRouter();

    const title = screen.getByText(mockLoginTitle);
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe('H1');
  });

  it('should render city link with Amsterdam', () => {
    renderWithRouter();

    expect(screen.getByText(mockCityName)).toBeInTheDocument();
  });

  it('should render link to main page', () => {
    renderWithRouter();

    const cityLink = screen.getByRole('link', { name: mockCityName });
    expect(cityLink).toBeInTheDocument();
    expect(cityLink).toHaveAttribute('href', '/');
  });

  it('should have correct page classes', () => {
    const { container } = renderWithRouter();

    const pageDiv = container.querySelector('.page');
    expect(pageDiv).toHaveClass('page--gray', 'page--login');
  });

  it('should render header with correct structure', () => {
    const { container } = renderWithRouter();

    expect(container.querySelector('.header')).toBeInTheDocument();
    expect(container.querySelector('.header__wrapper')).toBeInTheDocument();
    expect(container.querySelector('.header__left')).toBeInTheDocument();
  });

  it('should render main element with correct class', () => {
    const { container } = renderWithRouter();

    const main = container.querySelector('main');
    expect(main).toHaveClass('page__main', 'page__main--login');
  });

  it('should render login section', () => {
    const { container } = renderWithRouter();

    const loginSection = container.querySelector('.login');
    expect(loginSection).toBeInTheDocument();
    expect(loginSection?.tagName).toBe('SECTION');
  });

  it('should render login title with correct class', () => {
    const { container } = renderWithRouter();

    const title = container.querySelector('.login__title');
    expect(title).toBeInTheDocument();
    expect(title?.textContent).toBe(mockLoginTitle);
  });

  it('should render locations section', () => {
    const { container } = renderWithRouter();

    const locationsSection = container.querySelector('.locations');
    expect(locationsSection).toBeInTheDocument();
    expect(locationsSection?.tagName).toBe('SECTION');
  });

  it('should render locations section with correct classes', () => {
    const { container } = renderWithRouter();

    const locationsSection = container.querySelector('.locations');
    expect(locationsSection).toHaveClass('locations--login', 'locations--current');
  });

  it('should render locations item', () => {
    const { container } = renderWithRouter();

    expect(container.querySelector('.locations__item')).toBeInTheDocument();
  });

  it('should render locations item link with correct class', () => {
    const { container } = renderWithRouter();

    const locationLink = container.querySelector('.locations__item-link');
    expect(locationLink).toBeInTheDocument();
  });

  it('should render page login container', () => {
    const { container } = renderWithRouter();

    const loginContainer = container.querySelector('.page__login-container.container');
    expect(loginContainer).toBeInTheDocument();
  });

  it('should render header container', () => {
    const { container } = renderWithRouter();

    const headerContainer = container.querySelector('.header .container');
    expect(headerContainer).toBeInTheDocument();
  });

  it('should render both sections in login container', () => {
    const { container } = renderWithRouter();

    const sections = container.querySelectorAll('.page__login-container section');
    expect(sections).toHaveLength(2);
  });

  it('should render city name inside span', () => {
    const { container } = renderWithRouter();

    const citySpan = container.querySelector('.locations__item-link span');
    expect(citySpan).toBeInTheDocument();
    expect(citySpan?.textContent).toBe(mockCityName);
  });

  it('should have correct structure for login section', () => {
    const { container } = renderWithRouter();

    const loginSection = container.querySelector('.login');
    const title = loginSection?.querySelector('.login__title');

    expect(loginSection).toBeInTheDocument();
    expect(title).toBeInTheDocument();
  });

  it('should render all required elements', () => {
    renderWithRouter();

    expect(screen.getByText('Logo')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByText('Login Form')).toBeInTheDocument();
    expect(screen.getByText('Amsterdam')).toBeInTheDocument();
  });

  it('should render page main wrapper', () => {
    const { container } = renderWithRouter();

    expect(container.querySelector('.page__main')).toBeInTheDocument();
  });

  it('should have header as first child and main as second', () => {
    const { container } = renderWithRouter();

    const pageDiv = container.querySelector('.page');
    const children = pageDiv?.children;

    expect(children?.[0]).toHaveClass('header');
    expect(children?.[1]).toHaveClass('page__main');
  });

  it('should render city link as navigational element', () => {
    renderWithRouter();

    const link = screen.getByRole('link', { name: mockCityName });
    expect(link).toHaveClass('locations__item-link');
  });
});
