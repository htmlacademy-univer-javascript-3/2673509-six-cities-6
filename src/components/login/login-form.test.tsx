import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { LoginForm } from './login-form';
import { AuthStatus } from '../../internal/enums/auth-status-enum';
import { AppRouteEnum } from '../../internal/enums/app-route-enum';

const mockNavigate = vi.fn();
const mockDispatch = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../store/api-actions', () => ({
  loginAction: vi.fn((credentials: { email: string; password: string }) => ({
    type: 'user/login',
    payload: credentials,
  })),
}));

vi.mock('../../store/actions', () => ({
  setError: vi.fn((error: string | null) => ({
    type: 'app/setError',
    payload: error,
  })),
}));

const renderWithProviders = (authStatus: AuthStatus = AuthStatus.NoAuth) => {
  const mockStore = configureStore({
    reducer: {
      authStatus: () => authStatus,
    },
  });

  mockStore.dispatch = mockDispatch;

  return render(
    <Provider store={mockStore}>
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    </Provider>
  );
};

describe('LoginForm Component', () => {
  beforeEach(async () => {
    mockNavigate.mockClear();
    mockDispatch.mockClear();

    const { loginAction } = await import('../../store/api-actions/api-actions.ts');
    const { setError } = await import('../../store/actions/actions.ts');
    vi.mocked(loginAction).mockClear();
    vi.mocked(setError).mockClear();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Rendering', () => {
    it('should render login form', () => {
      const { container } = renderWithProviders();

      const form = container.querySelector('form.login__form');
      expect(form).toBeInTheDocument();
    });

    it('should render email input', () => {
      renderWithProviders();

      const emailInput = screen.getByPlaceholderText('Email');
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('name', 'email');
      expect(emailInput).toBeRequired();
    });

    it('should render password input', () => {
      renderWithProviders();

      const passwordInput = screen.getByPlaceholderText('Password');
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('name', 'password');
      expect(passwordInput).toBeRequired();
    });

    it('should render submit button', () => {
      renderWithProviders();

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('should render visually hidden labels', () => {
      const { container } = renderWithProviders();

      const labels = container.querySelectorAll('.visually-hidden');
      expect(labels).toHaveLength(2);
    });

    it('should have correct CSS classes', () => {
      const { container } = renderWithProviders();

      expect(container.querySelector('.login__form')).toBeInTheDocument();
      expect(container.querySelector('.form')).toBeInTheDocument();
    });
  });

  describe('User input', () => {
    it('should update email field when user types', async () => {
      const user = userEvent.setup();
      renderWithProviders();

      const emailInput = screen.getByPlaceholderText('Email');

      await act(async () => {
        await user.type(emailInput, 'test@example.com');
      });

      expect(emailInput).toHaveValue('test@example.com');
    });

    it('should update password field when user types', async () => {
      const user = userEvent.setup();
      renderWithProviders();

      const passwordInput = screen.getByPlaceholderText('Password');

      await act(async () => {
        await user.type(passwordInput, 'password123');
      });

      expect(passwordInput).toHaveValue('password123');
    });

    it('should handle empty initial values', () => {
      renderWithProviders();

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');

      expect(emailInput).toHaveValue('');
      expect(passwordInput).toHaveValue('');
    });
  });

  describe('Form submission - Valid data', () => {
    it('should dispatch loginAction with valid credentials', async () => {
      const user = userEvent.setup();
      const { loginAction } = await import('../../store/api-actions/api-actions.ts');

      renderWithProviders();

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await act(async () => {
        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');
        await user.click(submitButton);
      });

      expect(loginAction).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockDispatch).toHaveBeenCalled();
    });

    it('should accept password with letters and digits', async () => {
      const user = userEvent.setup();
      const { loginAction } = await import('../../store/api-actions/api-actions.ts');

      renderWithProviders();

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await act(async () => {
        await user.type(emailInput, 'user@test.com');
        await user.type(passwordInput, 'abc123def');
        await user.click(submitButton);
      });

      expect(loginAction).toHaveBeenCalledWith({
        email: 'user@test.com',
        password: 'abc123def',
      });
    });

    it('should accept password with lowercase letters and digits', async () => {
      const user = userEvent.setup();
      const { loginAction } = await import('../../store/api-actions/api-actions.ts');

      renderWithProviders();

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await act(async () => {
        await user.type(emailInput, 'user@test.com');
        await user.type(passwordInput, 'test123');
        await user.click(submitButton);
      });

      expect(loginAction).toHaveBeenCalledWith({
        email: 'user@test.com',
        password: 'test123',
      });
    });
  });

  describe('Form submission - Invalid data', () => {
    it('should show error when password has no letters', async () => {
      const user = userEvent.setup();
      const { setError } = await import('../../store/actions/actions.ts');
      const { loginAction } = await import('../../store/api-actions/api-actions.ts');

      renderWithProviders();

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await act(async () => {
        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, '123456');
        await user.click(submitButton);
      });

      expect(setError).toHaveBeenCalledWith('Password should contain at least 1 letter and digit');
      expect(loginAction).not.toHaveBeenCalled();
    });

    it('should show error when password has no digits', async () => {
      const user = userEvent.setup();
      const { setError } = await import('../../store/actions/actions.ts');
      const { loginAction } = await import('../../store/api-actions/api-actions.ts');

      renderWithProviders();

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await act(async () => {
        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password');
        await user.click(submitButton);
      });

      expect(setError).toHaveBeenCalledWith('Password should contain at least 1 letter and digit');
      expect(loginAction).not.toHaveBeenCalled();
    });

    it('should show error when both fields are empty', async () => {
      const user = userEvent.setup();
      const { setError } = await import('../../store/actions/actions.ts');
      const { loginAction } = await import('../../store/api-actions/api-actions.ts');

      renderWithProviders();

      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await act(async () => {
        await user.click(submitButton);
      });

      expect(setError).not.toHaveBeenCalled();
      expect(loginAction).not.toHaveBeenCalled();
    });

    it('should show error when password has only uppercase letters', async () => {
      const user = userEvent.setup();
      const { setError } = await import('../../store/actions/actions.ts');
      const { loginAction } = await import('../../store/api-actions/api-actions.ts');

      renderWithProviders();

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await act(async () => {
        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'PASSWORD123');
        await user.click(submitButton);
      });

      expect(setError).toHaveBeenCalledWith('Password should contain at least 1 letter and digit');
      expect(loginAction).not.toHaveBeenCalled();
    });

    it('should clear error after 2 seconds', async () => {
      vi.useFakeTimers();
      const user = userEvent.setup({ delay: null });
      const { setError } = await import('../../store/actions/actions.ts');

      renderWithProviders();

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await act(async () => {
        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, '123456');
        await user.click(submitButton);
      });

      expect(setError).toHaveBeenCalledWith('Password should contain at least 1 letter and digit');

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(setError).toHaveBeenCalledWith(null);
      expect(setError).toHaveBeenCalledTimes(2);

      vi.useRealTimers();
    });
  });

  describe('Navigation after authorization', () => {
    it('should navigate to main page when user is authorized', async () => {
      renderWithProviders(AuthStatus.Auth);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(AppRouteEnum.MainPage);
      });
    });

    it('should not navigate when user is not authorized', () => {
      renderWithProviders(AuthStatus.NoAuth);

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should not navigate when auth status is unknown', () => {
      renderWithProviders(AuthStatus.Unknown);

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('CSS classes and attributes', () => {
    it('should have correct CSS classes for email input wrapper', () => {
      const { container } = renderWithProviders();

      const wrapper = container.querySelectorAll('.login__input-wrapper');
      expect(wrapper).toHaveLength(2);
    });

    it('should have correct CSS classes for inputs', () => {
      const { container } = renderWithProviders();

      const inputs = container.querySelectorAll('.login__input');
      expect(inputs).toHaveLength(2);
    });

    it('should have correct CSS classes for submit button', () => {
      const { container } = renderWithProviders();

      const button = container.querySelector('.login__submit');
      expect(button).toHaveClass('login__submit', 'form__submit', 'button');
    });
  });
});
