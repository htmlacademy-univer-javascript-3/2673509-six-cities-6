import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { CommentForm } from './comment-form';

const mockDispatch = vi.fn();

vi.mock('../../store/api-actions', () => ({
  sendReviewAction: vi.fn((data: { id: string; comment: { comment: string; rating: number } }) => ({
    type: 'review/send',
    payload: data,
  })),
}));

const renderWithProviders = (component: React.ReactElement) => {
  const mockStore = configureStore({
    reducer: {
      root: () => ({}),
    },
  });

  mockStore.dispatch = mockDispatch;

  return render(<Provider store={mockStore}>{component}</Provider>);
};

describe('CommentForm Component', () => {
  const offerId = 'test-offer-id';

  beforeEach(async () => {
    mockDispatch.mockClear();
    const { sendReviewAction } = await import('../../store/api-actions/api-actions.ts');
    vi.mocked(sendReviewAction).mockClear();
  });

  describe('Rendering', () => {
    it('should render comment form', () => {
      const { container } = renderWithProviders(<CommentForm id={offerId} />);

      const form = container.querySelector('form.reviews__form');
      expect(form).toBeInTheDocument();
    });

    it('should render form label', () => {
      renderWithProviders(<CommentForm id={offerId} />);

      expect(screen.getByText('Your review')).toBeInTheDocument();
    });

    it('should render textarea', () => {
      renderWithProviders(<CommentForm id={offerId} />);

      const textarea = screen.getByPlaceholderText(/Tell how was your stay/i);
      expect(textarea).toBeInTheDocument();
    });

    it('should render submit button', () => {
      renderWithProviders(<CommentForm id={offerId} />);

      const button = screen.getByRole('button', { name: /submit/i });
      expect(button).toBeInTheDocument();
    });

    it('should render help text', () => {
      renderWithProviders(<CommentForm id={offerId} />);

      expect(screen.getByText(/To submit review please make sure/i)).toBeInTheDocument();
      expect(screen.getByText(/50 characters/i)).toBeInTheDocument();
    });
  });

  describe('Rating stars', () => {
    it('should render all 5 rating inputs', () => {
      const { container } = renderWithProviders(<CommentForm id={offerId} />);

      const ratingInputs = container.querySelectorAll('input[name="rating"]');
      expect(ratingInputs).toHaveLength(5);
    });

    it('should render rating labels with correct titles', () => {
      renderWithProviders(<CommentForm id={offerId} />);

      expect(screen.getByTitle('perfect')).toBeInTheDocument();
      expect(screen.getByTitle('good')).toBeInTheDocument();
      expect(screen.getByTitle('not bad')).toBeInTheDocument();
      expect(screen.getByTitle('badly')).toBeInTheDocument();
      expect(screen.getByTitle('terribly')).toBeInTheDocument();
    });

    it('should have correct id for 5-stars input', () => {
      const { container } = renderWithProviders(<CommentForm id={offerId} />);

      expect(container.querySelector('#\\35 -stars')).toBeInTheDocument();
    });

    it('should have visually-hidden class for rating inputs', () => {
      const { container } = renderWithProviders(<CommentForm id={offerId} />);

      const ratingInputs = container.querySelectorAll('input[name="rating"]');
      ratingInputs.forEach((input) => {
        expect(input).toHaveClass('visually-hidden');
      });
    });
  });

  describe('User interactions - Rating', () => {
    it('should select rating when 5-star is clicked', () => {
      const { container } = renderWithProviders(<CommentForm id={offerId} />);

      const fiveStarInput = container.querySelector('#\\35 -stars') as HTMLInputElement;

      act(() => {
        fireEvent.click(fiveStarInput);
      });

      expect(fiveStarInput.checked).toBe(true);
    });

    it('should change rating when different star is clicked', () => {
      const { container } = renderWithProviders(<CommentForm id={offerId} />);

      const fiveStarInput = container.querySelector('#\\35 -stars') as HTMLInputElement;
      const threeStarInput = container.querySelector('#\\33 -stars') as HTMLInputElement;

      act(() => {
        fireEvent.click(fiveStarInput);
      });
      expect(fiveStarInput.checked).toBe(true);

      act(() => {
        fireEvent.click(threeStarInput);
      });
      expect(threeStarInput.checked).toBe(true);
      expect(fiveStarInput.checked).toBe(false);
    });

    it('should select 1-star rating', () => {
      const { container } = renderWithProviders(<CommentForm id={offerId} />);

      const oneStarInput = container.querySelector('#\\31 -star') as HTMLInputElement;

      act(() => {
        fireEvent.click(oneStarInput);
      });

      expect(oneStarInput.checked).toBe(true);
    });
  });

  describe('User interactions - Comment', () => {
    it('should update comment when user types', async () => {
      const user = userEvent.setup();
      renderWithProviders(<CommentForm id={offerId} />);

      const textarea = screen.getByPlaceholderText(/Tell how was your stay/i);

      await act(async () => {
        await user.type(textarea, 'This is a test comment');
      });

      expect(textarea).toHaveValue('This is a test comment');
    });

    it('should handle long comments', async () => {
      const user = userEvent.setup();
      renderWithProviders(<CommentForm id={offerId} />);

      const longComment = 'a'.repeat(100);
      const textarea = screen.getByPlaceholderText(/Tell how was your stay/i);

      await act(async () => {
        await user.type(textarea, longComment);
      });

      expect(textarea).toHaveValue(longComment);
    });

    it('should start with empty comment', () => {
      renderWithProviders(<CommentForm id={offerId} />);

      const textarea = screen.getByPlaceholderText(/Tell how was your stay/i);
      expect(textarea).toHaveValue('');
    });
  });

  describe('Validation', () => {
    it('should disable submit button initially', () => {
      renderWithProviders(<CommentForm id={offerId} />);

      const button = screen.getByRole('button', { name: /submit/i });
      expect(button).toBeDisabled();
    });

    it('should disable button when comment is too short', async () => {
      const user = userEvent.setup();
      const { container } = renderWithProviders(<CommentForm id={offerId} />);

      const textarea = screen.getByPlaceholderText(/Tell how was your stay/i);
      const fiveStarInput = container.querySelector('#\\35 -stars') as HTMLInputElement;

      await act(async () => {
        fireEvent.click(fiveStarInput);
        await user.type(textarea, 'Too short comment');
      });

      const button = screen.getByRole('button', { name: /submit/i });
      expect(button).toBeDisabled();
    });

    it('should disable button when comment is too long', async () => {
      const user = userEvent.setup();
      const { container } = renderWithProviders(<CommentForm id={offerId} />);

      const textarea = screen.getByPlaceholderText(/Tell how was your stay/i);
      const fiveStarInput = container.querySelector('#\\35 -stars') as HTMLInputElement;

      await act(async () => {
        fireEvent.click(fiveStarInput);
        await user.type(textarea, 'a'.repeat(301));
      });

      const button = screen.getByRole('button', { name: /submit/i });
      expect(button).toBeDisabled();
    });

    it('should disable button when rating is not selected', async () => {
      const user = userEvent.setup();
      renderWithProviders(<CommentForm id={offerId} />);

      const textarea = screen.getByPlaceholderText(/Tell how was your stay/i);

      await act(async () => {
        await user.type(textarea, 'a'.repeat(60));
      });

      const button = screen.getByRole('button', { name: /submit/i });
      expect(button).toBeDisabled();
    });

    it('should enable button when form is valid', async () => {
      const user = userEvent.setup();
      const { container } = renderWithProviders(<CommentForm id={offerId} />);

      const textarea = screen.getByPlaceholderText(/Tell how was your stay/i);
      const fiveStarInput = container.querySelector('#\\35 -stars') as HTMLInputElement;

      await act(async () => {
        fireEvent.click(fiveStarInput);
        await user.type(textarea, 'a'.repeat(60));
      });

      const button = screen.getByRole('button', { name: /submit/i });
      expect(button).not.toBeDisabled();
    });

    it('should accept comment with exactly 50 characters', async () => {
      const user = userEvent.setup();
      const { container } = renderWithProviders(<CommentForm id={offerId} />);

      const textarea = screen.getByPlaceholderText(/Tell how was your stay/i);
      const fiveStarInput = container.querySelector('#\\35 -stars') as HTMLInputElement;

      await act(async () => {
        fireEvent.click(fiveStarInput);
        await user.type(textarea, 'a'.repeat(50));
      });

      const button = screen.getByRole('button', { name: /submit/i });
      expect(button).not.toBeDisabled();
    });

    it('should accept comment with exactly 299 characters', async () => {
      const user = userEvent.setup();
      const { container } = renderWithProviders(<CommentForm id={offerId} />);

      const textarea = screen.getByPlaceholderText(/Tell how was your stay/i);
      const fiveStarInput = container.querySelector('#\\35 -stars') as HTMLInputElement;

      await act(async () => {
        fireEvent.click(fiveStarInput);
        await user.type(textarea, 'a'.repeat(299));
      });

      const button = screen.getByRole('button', { name: /submit/i });
      expect(button).not.toBeDisabled();
    });
  });

  describe('Form submission', () => {
    it('should dispatch sendReviewAction on submit', async () => {
      const user = userEvent.setup();
      const { sendReviewAction } = await import('../../store/api-actions/api-actions.ts');
      const { container } = renderWithProviders(<CommentForm id={offerId} />);

      const textarea = screen.getByPlaceholderText(/Tell how was your stay/i);
      const fiveStarInput = container.querySelector('#\\35 -stars') as HTMLInputElement;
      const button = screen.getByRole('button', { name: /submit/i });

      await act(async () => {
        fireEvent.click(fiveStarInput);
        await user.type(textarea, 'This is a valid comment with more than fifty characters');
        fireEvent.click(button);
      });

      expect(sendReviewAction).toHaveBeenCalledWith({
        id: offerId,
        comment: {
          comment: 'This is a valid comment with more than fifty characters',
          rating: 5,
        },
      });
      expect(mockDispatch).toHaveBeenCalled();
    });

    it('should clear form after successful submission', async () => {
      const user = userEvent.setup();
      const { container } = renderWithProviders(<CommentForm id={offerId} />);

      const textarea = screen.getByPlaceholderText(/Tell how was your stay/i);
      const fiveStarInput = container.querySelector('#\\35 -stars') as HTMLInputElement;
      const button = screen.getByRole('button', { name: /submit/i });

      await act(async () => {
        fireEvent.click(fiveStarInput);
        await user.type(textarea, 'Valid comment with more than fifty characters here');
        fireEvent.click(button);
      });

      await waitFor(() => {
        expect(textarea).toHaveValue('');
        expect(fiveStarInput.checked).toBe(false);
      });
    });

    it('should submit with 3-star rating', async () => {
      const user = userEvent.setup();
      const { sendReviewAction } = await import('../../store/api-actions/api-actions.ts');
      const { container } = renderWithProviders(<CommentForm id={offerId} />);

      const textarea = screen.getByPlaceholderText(/Tell how was your stay/i);
      const threeStarInput = container.querySelector('#\\33 -stars') as HTMLInputElement;
      const button = screen.getByRole('button', { name: /submit/i });

      await act(async () => {
        fireEvent.click(threeStarInput);
        await user.type(textarea, 'Another valid comment with sufficient character count');
        fireEvent.click(button);
      });

      expect(sendReviewAction).toHaveBeenCalledWith({
        id: offerId,
        comment: {
          comment: 'Another valid comment with sufficient character count',
          rating: 3,
        },
      });
    });
  });

  describe('CSS classes', () => {
    it('should have correct CSS classes for form', () => {
      const { container } = renderWithProviders(<CommentForm id={offerId} />);

      const form = container.querySelector('form');
      expect(form).toHaveClass('reviews__form', 'form');
    });

    it('should have correct CSS classes for textarea', () => {
      const { container } = renderWithProviders(<CommentForm id={offerId} />);

      const textarea = container.querySelector('textarea');
      expect(textarea).toHaveClass('reviews__textarea', 'form__textarea');
    });

    it('should have correct CSS classes for submit button', () => {
      const { container } = renderWithProviders(<CommentForm id={offerId} />);

      const button = container.querySelector('button[type="submit"]');
      expect(button).toHaveClass('reviews__submit', 'form__submit', 'button');
    });
  });

  describe('Accessibility', () => {
    it('should have label associated with textarea', () => {
      renderWithProviders(<CommentForm id={offerId} />);

      const label = screen.getByText('Your review');
      expect(label).toHaveAttribute('for', 'review');
    });

    it('should have textarea with correct id', () => {
      const { container } = renderWithProviders(<CommentForm id={offerId} />);

      const textarea = container.querySelector('#review');
      expect(textarea).toBeInTheDocument();
    });

    it('should have labels for all rating inputs', () => {
      const { container } = renderWithProviders(<CommentForm id={offerId} />);

      const labels = container.querySelectorAll('.reviews__rating-label');
      expect(labels).toHaveLength(5);
    });
  });
});
