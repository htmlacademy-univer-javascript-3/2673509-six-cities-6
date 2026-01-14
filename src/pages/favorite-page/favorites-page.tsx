import React from 'react';
import {Header} from '../../components/header/header.tsx';
import {useAppSelector} from '../../store/hooks/hooks.ts';
import {Footer} from '../../components/footer/footer.tsx';
import {Cities} from '../../constants';
import {AppRouteEnum} from '../../internal/enums/app-route-enum.tsx';
import {PlaceCard} from '../../components/place-card/place-card.tsx';
import {Link} from 'react-router-dom';

export function FavoritesPage(): React.JSX.Element {
  const offers = useAppSelector((state) => state.offers);
  const favoriteOffers = offers.filter((offer) => offer.isFavorite);
  if (!favoriteOffers.length) {
    return (
      <div className="page">
        <Header/>
        <main className="page__main page__main--favorites">
          <div className="page__favorites-container container">
            <section className="favorites favorites--empty">
              <h1 className="visually-hidden">
                Favorites (empty)
              </h1>
              <div className="favorites__status-wrapper">
                <b className="favorites__status">
                  Nothing yet saved.
                </b>
                <p className="favorites__status-description">
                  Save properties to narrow down search or plan your future trips.
                </p>
              </div>
            </section>
          </div>
        </main>
        <Footer/>
      </div>
    );
  }
  return (
    <div className="page">
      <Header/>
      <main className="page__main page__main--favorites">
        <div className="page__favorites-container container">
          <section className="favorites">
            <ul className="favorites__list">
              {Cities.map((city) => {
                const filteredByCurrentCity = favoriteOffers.filter((offer) => offer.city.name === city.name);
                if (filteredByCurrentCity.length !== 0) {
                  return (
                    <li className="favorites__locations-items" key={city.name}>
                      <div className="favorites__locations locations locations--current">
                        <div className="locations__item">
                          <Link className="locations__item-link" to={AppRouteEnum.MainPage}>
                            <span>{city.name}</span>
                          </Link>
                        </div>
                      </div>
                      <div className="favorites__places">
                        {filteredByCurrentCity.map((favorite) => (
                          <PlaceCard key={favorite.id} offer={favorite} type="favorites"/>
                        ))}
                      </div>
                    </li>
                  );
                }
              })}
            </ul>
          </section>
        </div>
      </main>
      <Footer/>
    </div>
  );
}
