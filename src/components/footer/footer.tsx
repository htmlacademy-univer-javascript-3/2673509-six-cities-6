import {AppRouteEnum} from '../../internal/enums/app-route-enum.tsx';
import {Link} from 'react-router-dom';

export function Footer() {
  return (
    <footer className="footer container">
      <Link className="footer__logo-link" to={AppRouteEnum.MainPage}>
        <img className="footer__logo" src="img/logo.svg" alt="6 cities logo" width="64" height="33"/>
      </Link>
    </footer>
  );
}
