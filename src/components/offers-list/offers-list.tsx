import {PlaceCard} from '../place-card/place-card.tsx';
import {Offer} from '../../internal/types/offer-type.tsx';
import {useAppSelector} from '../../store/hooks/hooks.ts';
import {SortOption} from '../../internal/enums/sort-option-enum.tsx';

type OffersListProps = {
  offers: Offer[];
  listType: 'default' | 'near';
  activeOfferChange?: (offer: Offer | null) => void;
}

export function OffersList({ offers, listType, activeOfferChange}: OffersListProps) {
  const selectedSortType = useAppSelector((state) => state.sortOption);
  const sortedOffers = [...offers];
  switch (selectedSortType) {
    case SortOption.Popular:
      break;
    case SortOption.PriceLowToHigh:
      sortedOffers.sort((low, high) => low.price - high.price);
      break;
    case SortOption.PriceHighToLow:
      sortedOffers.sort((low, high) => high.price - low.price);
      break;
    case SortOption.TopRatedFirst:
      sortedOffers.sort((low, high) => high.rating - low.rating);
      break;
  }
  const baseClass = 'places__list';
  const additionalClass = listType === 'default' ? 'cities__places-list tabs__content' : 'near-places__list';
  if (!activeOfferChange) {
    return (
      <div className={`${baseClass} ${additionalClass} `}>
        {sortedOffers.map((offer) => (
          <PlaceCard key={offer.id} offer={offer} type={listType}/>
        ))}
      </div>
    );
  }
  return (
    <div className={`${baseClass} ${additionalClass} `}>
      {sortedOffers.map((offer) => (
        <div
          key={offer.id}
          onMouseEnter={() => activeOfferChange(offer)}
          onMouseLeave={() => activeOfferChange(null)}
        >
          <PlaceCard key={offer.id} offer={offer} type={listType}/>
        </div>
      ))}
    </div>
  );
}
