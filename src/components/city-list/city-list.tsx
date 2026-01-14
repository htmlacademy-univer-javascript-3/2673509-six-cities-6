import {useAppDispatch, useAppSelector} from '../../store/hooks/hooks.ts';
import {changeCity} from '../../store/actions/actions.ts';
import {CityName} from '../../internal/enums/city-name-enum.tsx';
import {Link} from 'react-router-dom';

type CityListProps = {
  cities: { name: CityName; location: { longitude: number; latitude: number; zoom: number } }[];
};

export function CityList({cities}: CityListProps): JSX.Element {
  const dispatch = useAppDispatch();
  const handleCityChange = (city: CityName) => {
    dispatch(changeCity(city));
  };
  const currentCity = useAppSelector((state) => state.city);
  return (
    <ul className="locations__list tabs__list">
      {cities.map((city) => (
        <li className="locations__item" onClick={() => handleCityChange(city.name)} key={city.name}>
          <Link className={`locations__item-link tabs__item ${city.name === currentCity.name ? 'tabs__item--active' : ''}`} to="/">
            <span>{city.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
