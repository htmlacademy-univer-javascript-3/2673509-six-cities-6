import {AppRouteEnum} from '../../internal/enums/app-route-enum.tsx';

export function Footer() {
  return (
    <footer className="footer container">
      <a className="footer__logo-link" href={AppRouteEnum.MainPage}>
        <img className="footer__logo" src="img/logo.svg" alt="6 cities logo" width="64" height="33"/>
      </a>
    </footer>
  );
}
