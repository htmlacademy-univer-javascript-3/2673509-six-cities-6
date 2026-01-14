import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Review } from './review';
import { ReviewType } from '../../internal/types/review-type';

const mockReviewData: ReviewType = {
  id: '1',
  user: {
    name: 'John Qwe',
    avatarUrl: 'https://example.com/avatar.jpg',
    isPro: true,
  },
  comment: 'Great place to stay! The location was perfect and the host was very friendly.',
  date: '2023-10-15T10:00:00.000Z',
  rating: 5,
};

const mockReviewDataLowRating: ReviewType = {
  ...mockReviewData,
  id: '2',
  rating: 2,
  comment: 'Could be better.',
  date: '2024-01-20T14:30:00.000Z',
};

describe('Review Component', () => {
  it('should render user name correctly', () => {
    render(<Review review={mockReviewData} />);

    const userName = screen.getByText('John Qwe');
    expect(userName).toBeInTheDocument();
    expect(userName).toHaveClass('reviews__user-name');
  });

  it('should render user avatar with correct attributes', () => {
    render(<Review review={mockReviewData} />);

    const avatar = screen.getByAltText('Reviews avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', mockReviewData.user.avatarUrl);
    expect(avatar).toHaveAttribute('width', '54');
    expect(avatar).toHaveAttribute('height', '54');
  });

  it('should render comment text correctly', () => {
    render(<Review review={mockReviewData} />);

    const comment = screen.getByText(mockReviewData.comment);
    expect(comment).toBeInTheDocument();
    expect(comment).toHaveClass('reviews__text');
  });

  it('should render formatted date as "October 2023"', () => {
    render(<Review review={mockReviewData} />);

    const formattedDate = screen.getByText('October 2023');
    expect(formattedDate).toBeInTheDocument();
    expect(formattedDate.tagName).toBe('TIME');
  });

  it('should render formatted date as "January 2024" for different date', () => {
    render(<Review review={mockReviewDataLowRating} />);

    expect(screen.getByText('January 2024')).toBeInTheDocument();
  });

  it('should render rating with correct width for 5 stars', () => {
    render(<Review review={mockReviewData} />);

    const ratingStars = screen.getByText('5').parentElement;
    const ratingSpan = ratingStars?.querySelector('span[style]');

    expect(ratingSpan).toHaveStyle({ width: '100%' });
  });

  it('should render rating with correct width for 2 stars', () => {
    render(<Review review={mockReviewDataLowRating} />);

    const ratingStars = screen.getByText('2').parentElement;
    const ratingSpan = ratingStars?.querySelector('span[style]');

    expect(ratingSpan).toHaveStyle({ width: '40%' });
  });

  it('should render visually hidden rating value', () => {
    render(<Review review={mockReviewData} />);

    const hiddenRating = screen.getByText('5');
    expect(hiddenRating).toBeInTheDocument();
    expect(hiddenRating).toHaveClass('visually-hidden');
  });

  it('should render review as list item', () => {
    const { container } = render(<Review review={mockReviewData} />);

    const listItem = container.querySelector('li.reviews__item');
    expect(listItem).toBeInTheDocument();
  });

  it('should have correct CSS classes structure', () => {
    const { container } = render(<Review review={mockReviewData} />);

    expect(container.querySelector('.reviews__user.user')).toBeInTheDocument();
    expect(container.querySelector('.reviews__avatar-wrapper')).toBeInTheDocument();
    expect(container.querySelector('.reviews__info')).toBeInTheDocument();
    expect(container.querySelector('.reviews__rating.rating')).toBeInTheDocument();
  });
});
