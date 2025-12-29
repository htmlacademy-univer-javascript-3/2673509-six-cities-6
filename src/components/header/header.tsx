import {Link} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../store/hooks.ts';
import {AuthStatus} from '../../internal/enums/auth-status-enum.tsx';
import {logoutAction} from '../../store/api-actions.ts';
import {AppRouteEnum} from '../../internal/enums/app-route-enum.tsx';
import {Logo} from '../logo/logo.tsx';

export function Header(): JSX.Element {
  const favoriteOffers =
    useAppSelector((state) => state.offers)
      .filter((offer) => offer.isFavorite);
  const isAuthorized =
    useAppSelector((state) => state.authStatus) ===
    AuthStatus.Auth;
  const dispatch = useAppDispatch();

  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <div className="header__left">
            <Logo/>
          </div>
          <nav className="header__nav">
            <ul className="header__nav-list">
              {isAuthorized && (
                <li className="header__nav-item user">
                  <Link
                    className="header__nav-link header__nav-link--profile"
                    to={AppRouteEnum.FavoritesPage}
                  >
                    <div className="header__avatar-wrapper user__avatar-wrapper"></div>
                    <span className="header__user-name user__name">
                      Oliver.conner@gmail.com
                    </span>
                    <span className="header__favorite-count">
                      {favoriteOffers.length}
                    </span>
                  </Link>
                </li>
              )}
              <li className="header__nav-item">
                {isAuthorized ? (
                  <Link
                    className="header__nav-link"
                    onClick={(evt) => {
                      evt.preventDefault();
                      dispatch(logoutAction());
                    }}
                    to={AppRouteEnum.MainPage}
                  >
                    <span className="header__signout">Sign out</span>
                  </Link>
                ) : (
                  <Link className="header__nav-link" to={AppRouteEnum.LoginPage}>
                    <span className="header__signout">Sign in</span>
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
