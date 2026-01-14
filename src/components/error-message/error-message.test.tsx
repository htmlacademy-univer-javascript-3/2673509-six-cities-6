import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ErrorMessage } from './error-message';

const renderWithProvider = (error: string | null = null) => {
  const mockStore = configureStore({
    reducer: {
      error: () => error,
    },
  });

  return render(
    <Provider store={mockStore}>
      <ErrorMessage />
    </Provider>
  );
};

describe('ErrorMessage Component', () => {
  describe('Rendering with error', () => {
    it('should render error message when error exists', () => {
      renderWithProvider('Something went wrong');

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('should display different error messages', () => {
      const errorMessage = 'Failed to load data';
      renderWithProvider(errorMessage);

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('should have correct CSS class', () => {
      const { container } = renderWithProvider('Error occurred');

      const errorDiv = container.querySelector('.error-message');
      expect(errorDiv).toBeInTheDocument();
      expect(errorDiv).toHaveClass('error-message');
    });

    it('should render long error messages', () => {
      const longError = 'This is a very long error message that should still be displayed correctly in the component';
      renderWithProvider(longError);

      expect(screen.getByText(longError)).toBeInTheDocument();
    });

    it('should render error messages with special characters', () => {
      const errorWithSpecialChars = 'Error: Failed to fetch data from server!';
      renderWithProvider(errorWithSpecialChars);

      expect(screen.getByText(errorWithSpecialChars)).toBeInTheDocument();
    });
  });

  describe('Rendering without error', () => {
    it('should not render when error is null', () => {
      const { container } = renderWithProvider(null);

      expect(container.querySelector('.error-message')).not.toBeInTheDocument();
    });

    it('should not render when error is empty string', () => {
      const { container } = renderWithProvider('');

      expect(container.querySelector('.error-message')).not.toBeInTheDocument();
    });

    it('should return null when no error', () => {
      const { container } = renderWithProvider(null);

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Structure', () => {
    it('should render as a div element', () => {
      const { container } = renderWithProvider('Test error');

      const errorDiv = container.querySelector('div.error-message');
      expect(errorDiv).toBeInTheDocument();
      expect(errorDiv?.tagName).toBe('DIV');
    });

    it('should contain only text content', () => {
      renderWithProvider('Simple error');

      const errorElement = screen.getByText('Simple error');
      expect(errorElement.children).toHaveLength(0);
    });

    it('should render only one error message element', () => {
      const { container } = renderWithProvider('Error');

      const errorMessages = container.querySelectorAll('.error-message');
      expect(errorMessages).toHaveLength(1);
    });
  });

  describe('Different error types', () => {
    it('should handle network errors', () => {
      renderWithProvider('Network error: Unable to connect to server');

      expect(screen.getByText('Network error: Unable to connect to server')).toBeInTheDocument();
    });

    it('should handle validation errors', () => {
      renderWithProvider('Validation error: Invalid email format');

      expect(screen.getByText('Validation error: Invalid email format')).toBeInTheDocument();
    });

    it('should handle authentication errors', () => {
      renderWithProvider('Authentication failed');

      expect(screen.getByText('Authentication failed')).toBeInTheDocument();
    });

    it('should handle server errors', () => {
      renderWithProvider('500 Internal Server Error');

      expect(screen.getByText('500 Internal Server Error')).toBeInTheDocument();
    });
  });
});
