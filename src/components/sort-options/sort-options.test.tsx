import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SortOptions } from './sort-options';
import { SortOption } from '../../internal/enums/sort-option-enum';

describe('SortOptions Component', () => {
  let mockOnSortChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnSortChange = vi.fn();
  });

  it('should display Popular as default selected option', () => {
    const { container } = render(<SortOptions onSortChange={mockOnSortChange} />);

    const sortingType = container.querySelector('.places__sorting-type');
    expect(sortingType).toHaveTextContent(SortOption.Popular);
  });

  it('should not show dropdown menu initially', () => {
    const { container } = render(<SortOptions onSortChange={mockOnSortChange} />);

    const dropdown = container.querySelector('.places__options');
    expect(dropdown).not.toHaveClass('places__options--opened');
  });

  it('should open dropdown menu when clicking on sorting type', async () => {
    const user = userEvent.setup();
    const { container } = render(<SortOptions onSortChange={mockOnSortChange} />);

    const sortingType = container.querySelector('.places__sorting-type') as HTMLElement;

    await act(async () => {
      await user.click(sortingType);
    });

    const dropdown = container.querySelector('.places__options');
    expect(dropdown).toHaveClass('places__options--opened');
  });

  it('should close dropdown when clicking sorting type again', async () => {
    const user = userEvent.setup();
    const { container } = render(<SortOptions onSortChange={mockOnSortChange} />);

    const sortingType = container.querySelector('.places__sorting-type') as HTMLElement;

    await act(async () => {
      await user.click(sortingType);
    });

    expect(container.querySelector('.places__options')).toHaveClass('places__options--opened');

    await act(async () => {
      await user.click(sortingType);
    });

    expect(container.querySelector('.places__options')).not.toHaveClass('places__options--opened');
  });

  it('should mark Popular option as active by default', () => {
    const { container } = render(<SortOptions onSortChange={mockOnSortChange} />);

    const options = container.querySelectorAll('.places__option');
    const popularOption = Array.from(options).find(
      (option) => option.textContent === SortOption.Popular
    );

    expect(popularOption).toHaveClass('places__option--active');
  });

  it('should call onSortChange when selecting an option', async () => {
    const user = userEvent.setup();
    render(<SortOptions onSortChange={mockOnSortChange} />);

    const priceHighToLowOption = screen.getByText(SortOption.PriceHighToLow);

    await act(async () => {
      await user.click(priceHighToLowOption);
    });

    expect(mockOnSortChange).toHaveBeenCalledWith(SortOption.PriceHighToLow);
    expect(mockOnSortChange).toHaveBeenCalledTimes(1);
  });

  it('should update selected option when clicking on different option', async () => {
    const user = userEvent.setup();
    const { container } = render(<SortOptions onSortChange={mockOnSortChange} />);

    const priceLowToHighOption = screen.getByText(SortOption.PriceLowToHigh);

    await act(async () => {
      await user.click(priceLowToHighOption);
    });

    const sortingType = container.querySelector('.places__sorting-type');
    expect(sortingType).toHaveTextContent(SortOption.PriceLowToHigh);
  });

  it('should close dropdown after selecting an option', async () => {
    const user = userEvent.setup();
    const { container } = render(<SortOptions onSortChange={mockOnSortChange} />);

    const sortingType = container.querySelector('.places__sorting-type') as HTMLElement;

    await act(async () => {
      await user.click(sortingType);
    });

    expect(container.querySelector('.places__options')).toHaveClass('places__options--opened');

    const topRatedOption = screen.getByText(SortOption.TopRatedFirst);

    await act(async () => {
      await user.click(topRatedOption);
    });

    const dropdown = container.querySelector('.places__options');
    expect(dropdown).not.toHaveClass('places__options--opened');
  });

  it('should update active class when selecting new option', async () => {
    const user = userEvent.setup();
    const { container } = render(<SortOptions onSortChange={mockOnSortChange} />);

    const priceHighToLowOption = screen.getByText(SortOption.PriceHighToLow);

    await act(async () => {
      await user.click(priceHighToLowOption);
    });

    const options = container.querySelectorAll('.places__option');
    const selectedOption = Array.from(options).find(
      (option) => option.textContent === SortOption.PriceHighToLow
    );
    const popularOption = Array.from(options).find(
      (option) => option.textContent === SortOption.Popular
    );

    expect(selectedOption).toHaveClass('places__option--active');
    expect(popularOption).not.toHaveClass('places__option--active');
  });

  it('should render sorting arrow icon', () => {
    const { container } = render(<SortOptions onSortChange={mockOnSortChange} />);

    const arrowIcon = container.querySelector('.places__sorting-arrow use');
    expect(arrowIcon).toBeInTheDocument();
    expect(arrowIcon).toHaveAttribute('xlink:href', '#icon-arrow-select');
  });

  it('should have tabIndex on sorting type for keyboard accessibility', () => {
    const { container } = render(<SortOptions onSortChange={mockOnSortChange} />);

    const sortingType = container.querySelector('.places__sorting-type');
    expect(sortingType).toHaveAttribute('tabIndex', '0');
  });

  it('should have tabIndex on all option items for keyboard accessibility', () => {
    const { container } = render(<SortOptions onSortChange={mockOnSortChange} />);

    const options = container.querySelectorAll('.places__option');
    options.forEach((option) => {
      expect(option).toHaveAttribute('tabIndex', '0');
    });
  });

  it('should render form with correct attributes', () => {
    const { container } = render(<SortOptions onSortChange={mockOnSortChange} />);

    const form = container.querySelector('form.places__sorting');
    expect(form).toBeInTheDocument();
    expect(form).toHaveAttribute('action', '#');
    expect(form).toHaveAttribute('method', 'get');
  });

  it('should handle multiple option selections correctly', async () => {
    const user = userEvent.setup();
    const { container } = render(<SortOptions onSortChange={mockOnSortChange} />);


    await act(async () => {
      await user.click(screen.getByText(SortOption.PriceHighToLow));
    });

    expect(mockOnSortChange).toHaveBeenCalledWith(SortOption.PriceHighToLow);
    expect(container.querySelector('.places__sorting-type')).toHaveTextContent(SortOption.PriceHighToLow);

    await act(async () => {
      await user.click(screen.getByText(SortOption.TopRatedFirst));
    });

    expect(mockOnSortChange).toHaveBeenCalledWith(SortOption.TopRatedFirst);
    expect(mockOnSortChange).toHaveBeenCalledTimes(2);
    expect(container.querySelector('.places__sorting-type')).toHaveTextContent(SortOption.TopRatedFirst);
  });
});
