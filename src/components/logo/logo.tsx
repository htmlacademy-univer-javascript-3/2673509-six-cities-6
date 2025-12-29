import { Link } from 'react-router-dom';
import { AppRouteEnum } from '../../internal/enums/app-route-enum.tsx';

export function Logo() {
  return(
    <Link className="header__logo-link header__logo-link--active" to={AppRouteEnum.MainPage}>
      <img
        className="header__logo"
        src="img/logo.svg"
        alt="6 cities logo"
        width={81}
        height={41}
      />
    </Link>
  );
}
