import { useState } from 'react';
import { SortOption } from '../../internal/enums/sort-option-enum.tsx';

type SortOptionsProps = {
  onSortChange: (option: SortOption) => void;
}

export function SortOptions({ onSortChange }: SortOptionsProps): JSX.Element {
  const [selectedOption, setSelectedOption] = useState(SortOption.Popular);
  const [isOpen, setIsOpen] = useState(false);

  const handleSortChange = (option: SortOption) => {
    setSelectedOption(option);
    onSortChange(option);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <form className="places__sorting" action="#" method="get">
      <span className="places__sorting-caption">Sort by </span>
      <span
        className="places__sorting-type"
        tabIndex={0}
        onClick={toggleDropdown}
      >
        {selectedOption}
        <svg className="places__sorting-arrow" width="7" height="4">
          <use xlinkHref="#icon-arrow-select"></use>
        </svg>
      </span>
      <ul
        className={`places__options places__options--custom ${
          isOpen ? 'places__options--opened' : ''
        }`}
      >
        {Object.values(SortOption).map((option) => (
          <li
            key={option}
            className={`places__option ${
              option === selectedOption ? 'places__option--active' : ''
            }`}
            tabIndex={0}
            onClick={() => handleSortChange(option)}
          >
            {option}
          </li>
        ))}
      </ul>
    </form>
  );
}
