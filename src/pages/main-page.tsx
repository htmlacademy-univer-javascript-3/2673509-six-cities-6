import React, { useMemo, useState } from 'react';
import { OffersList } from '../components/offers-list/offers-list.tsx';
import { Map } from '../components/map/map.tsx';
import { useAppDispatch, useAppSelector } from '../store/hooks.ts';
import { Offer } from '../internal/types/offer-type.tsx';
import { CityList } from '../components/city-list/city-list.tsx';
import { Cities } from '../constants';
import { SortOption } from '../internal/enums/sort-option-enum.tsx';
import { SortOptions } from '../components/sort-options/sort-options.tsx';
import { setSortOption } from '../store/actions.ts';
import {Header} from '../components/header/header.tsx';
import {MainEmptyPage} from './main-empty-page.tsx';

export function MainPage(): React.JSX.Element {
  const [activeOffer, setActiveOffer] = useState<Offer | null>(null);
  const offers = useAppSelector((state) => state.offers);
  const city = useAppSelector((state) => state.city);
  const currentCityOffers = useMemo(() => offers.filter((offer) => offer.city.name === city.name), [city, offers]);
  const dispatch = useAppDispatch();

  if (!offers) {
    return (
      <MainEmptyPage />
    );
  }

  return (
    <div className="page page--gray page--main">
      <Header/>
      <main className={`page__main page__main--index ${currentCityOffers.length === 0 ? 'page__main--index-empty' : ''}`}>
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <section className="locations container">
            <CityList cities={Cities} />
          </section>
        </div>
        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">{`${currentCityOffers.length} places to stay in ${city.name}`}</b>
              <SortOptions
                onSortChange={(option: SortOption) => {
                  dispatch(setSortOption(option));
                }}
              />
              <OffersList offers={currentCityOffers} listType={'default'} activeOfferChange={setActiveOffer}/>
            </section>
            <div className="cities__right-section">
              <section className="cities__map map">
                <Map city={city} points={currentCityOffers} activeOfferId={activeOffer?.id}/>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
