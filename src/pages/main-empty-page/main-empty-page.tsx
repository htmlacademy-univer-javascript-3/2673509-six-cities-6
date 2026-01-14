import React from 'react';
import {useAppDispatch, useAppSelector} from '../../store/hooks/hooks.ts';
import {Header} from '../../components/header/header.tsx';
import {Cities} from '../../constants';
import {changeCity} from '../../store/actions/actions.ts';
import {Link} from 'react-router-dom';

export function MainEmptyPage(): React.JSX.Element {
  const currentCity = useAppSelector((state) => state.city);
  const dispatch = useAppDispatch();
  return (
    <div className="page page--gray page--main">
      <Header />
      <main className="page__main page__main--index page__main--index-empty">
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <section className="locations container">
            <ul className="locations__list tabs__list">
              {Cities.map((city) => {
                const activeCity = city.name === currentCity.name ? 'tabs__item--active' : '';
                return (
                  <li className="locations__item" key={city.name}
                    onClick={() => {
                      dispatch(changeCity(city.name));
                    }}
                  >
                    <Link className={`locations__item-link tabs__item ${activeCity}`} to="/">
                      <span>{city.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
        <div className="cities">
          <div className="cities__places-container cities__places-container--empty container">
            <section className="cities__no-places">
              <div className="cities__status-wrapper tabs__content">
                <b className="cities__status">No places to stay available</b>
              </div>
            </section>
            <div className="cities__right-section"></div>
          </div>
        </div>
      </main>
    </div>
  );
}
