import {Link, useNavigate} from 'react-router-dom';
import {Offer} from '../../internal/types/offer-type.tsx';
import React from 'react';
import {useAppDispatch, useAppSelector} from '../../store/hooks.ts';
import {AuthStatus} from '../../internal/enums/auth-status-enum.tsx';
import {APIRoute} from '../../internal/enums/api-route-enum.tsx';
import {addFavouriteAction} from '../../store/api-actions.ts';

type PlaceCardProps = {
  offer: Offer;
  type: 'default' | 'near';
}

export function PlaceCard({offer, type}: PlaceCardProps): React.JSX.Element {
  const placeCardClass = type === 'default' ? 'cities__card place-card' : 'near-places__card place-card';
  const authStatus = useAppSelector((state) => state.authStatus);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  return (
    <article className={`${placeCardClass}`}>
      {offer.isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      )}
      <div className="cities__image-wrapper place-card__image-wrapper">
        <a href="#">
          <img
            className="place-card__image"
            src={offer.previewImage}
            width="260"
            height="200"
            alt="Place image"
          />
        </a>
      </div>
      <div className="place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{offer.price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <button className={
            offer.isFavorite
              ? 'place-card__bookmark-button place-card__bookmark-button--active button'
              : 'place-card__bookmark-button button'
          } type="button"
          onClick={() => {
            if (authStatus !== AuthStatus.Auth) {
              navigate(APIRoute.Login);
            }

            dispatch(addFavouriteAction({offerId: offer.id, status: offer.isFavorite ? 0 : 1}));
          }}
          >
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">To bookmarks</span>
          </button>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{width: `${(Math.round(offer.rating) / 5) * 100}%`}}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <Link to={`/offer/${offer.id}`} state={offer}>
            {offer.title}
          </Link>
        </h2>
        <p className="place-card__type">{offer.type}</p>
      </div>
    </article>
  );
}
