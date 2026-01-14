import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Authorization } from './authorization';
import { AuthStatus } from '../../internal/enums/auth-status-enum';
import { AppRouteEnum } from '../../internal/enums/app-route-enum';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => {
      mockNavigate(to);
      return <div data-testid="navigate-mock">Redirecting to {to}</div>;
    },
  };
});

const renderWithRouter = (component: React.ReactElement) =>
  render(<BrowserRouter>{component}</BrowserRouter>);

describe('Authorization Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  describe('Authorized user', () => {
    it('should render children when user is authorized', () => {
      renderWithRouter(
        <Authorization authStatus={AuthStatus.Auth}>
          <div data-testid="protected-content">Protected Content</div>
        </Authorization>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should not redirect when user is authorized', () => {
      renderWithRouter(
        <Authorization authStatus={AuthStatus.Auth}>
          <div>Protected Content</div>
        </Authorization>
      );

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should render complex children when authorized', () => {
      renderWithRouter(
        <Authorization authStatus={AuthStatus.Auth}>
          <div>
            <h1>Title</h1>
            <p>Paragraph</p>
            <button>Button</button>
          </div>
        </Authorization>
      );

      expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument();
      expect(screen.getByText('Paragraph')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Button' })).toBeInTheDocument();
    });
  });

  describe('Unauthorized user', () => {
    it('should redirect to login page when user is not authorized', () => {
      renderWithRouter(
        <Authorization authStatus={AuthStatus.NoAuth}>
          <div data-testid="protected-content">Protected Content</div>
        </Authorization>
      );

      expect(mockNavigate).toHaveBeenCalledWith(AppRouteEnum.LoginPage);
    });

    it('should not render children when user is not authorized', () => {
      renderWithRouter(
        <Authorization authStatus={AuthStatus.NoAuth}>
          <div data-testid="protected-content">Protected Content</div>
        </Authorization>
      );

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should render Navigate component when not authorized', () => {
      renderWithRouter(
        <Authorization authStatus={AuthStatus.NoAuth}>
          <div>Protected Content</div>
        </Authorization>
      );

      expect(screen.getByTestId('navigate-mock')).toBeInTheDocument();
    });
  });

  describe('Unknown auth status', () => {
    it('should redirect to login page when auth status is unknown', () => {
      renderWithRouter(
        <Authorization authStatus={AuthStatus.Unknown}>
          <div data-testid="protected-content">Protected Content</div>
        </Authorization>
      );

      expect(mockNavigate).toHaveBeenCalledWith(AppRouteEnum.LoginPage);
    });

    it('should not render children when auth status is unknown', () => {
      renderWithRouter(
        <Authorization authStatus={AuthStatus.Unknown}>
          <div data-testid="protected-content">Protected Content</div>
        </Authorization>
      );

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });
  });

  describe('Different children types', () => {
    it('should render JSX element children', () => {
      renderWithRouter(
        <Authorization authStatus={AuthStatus.Auth}>
          <span>JSX Element</span>
        </Authorization>
      );

      expect(screen.getByText('JSX Element')).toBeInTheDocument();
    });

    it('should render component with props', () => {
      const TestComponent = ({ text }: { text: string }) => <div>{text}</div>;

      renderWithRouter(
        <Authorization authStatus={AuthStatus.Auth}>
          <TestComponent text="Test Component" />
        </Authorization>
      );

      expect(screen.getByText('Test Component')).toBeInTheDocument();
    });

    it('should render nested components', () => {
      renderWithRouter(
        <Authorization authStatus={AuthStatus.Auth}>
          <div>
            <div>
              <span>Nested Content</span>
            </div>
          </div>
        </Authorization>
      );

      expect(screen.getByText('Nested Content')).toBeInTheDocument();
    });
  });

  describe('Multiple renders', () => {
    it('should handle auth status change from NoAuth to Auth', () => {
      const { rerender } = renderWithRouter(
        <Authorization authStatus={AuthStatus.NoAuth}>
          <div data-testid="protected-content">Protected Content</div>
        </Authorization>
      );

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();

      rerender(
        <BrowserRouter>
          <Authorization authStatus={AuthStatus.Auth}>
            <div data-testid="protected-content">Protected Content</div>
          </Authorization>
        </BrowserRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should handle auth status change from Auth to NoAuth', () => {
      const { rerender } = renderWithRouter(
        <Authorization authStatus={AuthStatus.Auth}>
          <div data-testid="protected-content">Protected Content</div>
        </Authorization>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();

      rerender(
        <BrowserRouter>
          <Authorization authStatus={AuthStatus.NoAuth}>
            <div data-testid="protected-content">Protected Content</div>
          </Authorization>
        </BrowserRouter>
      );

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
      expect(mockNavigate).toHaveBeenCalledWith(AppRouteEnum.LoginPage);
    });
  });

  describe('Redirect path', () => {
    it('should redirect to correct login page path', () => {
      renderWithRouter(
        <Authorization authStatus={AuthStatus.NoAuth}>
          <div>Protected Content</div>
        </Authorization>
      );

      expect(mockNavigate).toHaveBeenCalledWith(AppRouteEnum.LoginPage);
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
  });
});
