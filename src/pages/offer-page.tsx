import React, {useMemo, useEffect} from 'react';
import { CommentForm } from '../components/comment-form/comment-form.tsx';
import {Map} from '../components/map/map.tsx';
import {useAppDispatch, useAppSelector} from '../store/hooks.ts';
import {Header} from '../components/header/header.tsx';
import {useNavigate, useParams} from 'react-router-dom';
import {addFavouriteAction, getOfferInfoAction} from '../store/api-actions.ts';
import {AuthStatus} from '../internal/enums/auth-status-enum.tsx';
import {OffersList} from '../components/offers-list/offers-list.tsx';
import {APIRoute} from '../internal/enums/api-route-enum.tsx';
import {Spinner} from '../components/spinner/spinner.tsx';
import {NotFoundPage} from './not-found-page.tsx';
import {selectNearbyOffers, selectOfferInfo, selectReviews} from '../store/selectors.ts';
import {Point} from '../internal/types/point.tsx';
import {Footer} from '../components/footer/footer.tsx';
import {Review} from '../components/review/review.tsx';

export function OfferPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const selectedOffer = useAppSelector(selectOfferInfo);
  const nearbyOffers = useAppSelector(selectNearbyOffers);
  const reviews = useAppSelector(selectReviews);

  const points: Point[] = useMemo(() => nearbyOffers.map((offer) => ({
    id: offer.id,
    location: offer.location,
  })), [nearbyOffers]);

  const mapPoints: Point[] = useMemo(() => selectedOffer
    ? [...points.slice(0, 3), { id: selectedOffer.id, location: selectedOffer.location }]
    : points.slice(0, 3), [points, selectedOffer]);

  const sortedReviewList = useMemo(() => reviews
    .slice()
    .sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    ).slice(0, 10), [reviews]);

  const authStatus = useAppSelector((state) => state.authStatus);
  const isFetchSingleOffer = useAppSelector((state) => state.isFetchSingleOffer);

  useEffect(() => {
    if (id) {
      dispatch(getOfferInfoAction({ id }));
    }
  }, [dispatch, id]);

  if (isFetchSingleOffer) {
    return <Spinner />;
  }


  if (!selectedOffer) {
    return <NotFoundPage />;
  }

  return (
    <div className="page">
      <Header/>
      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {selectedOffer.images.map((url) => (
                <div className="offer__image-wrapper" key={url}>
                  <img className="offer__image" src={url} alt="Photo studio" />
                </div>
              ))}
            </div>
          </div>
          <div className="offer__container container">
            <div className="offer__wrapper">
              <div className="offer__mark">
                {selectedOffer.isPremium && (
                  <div className="offer__mark">
                    <span>Premium</span>
                  </div>
                )}
              </div>
              <div className="offer__name-wrapper">
                <h1 className="offer__name">
                  {selectedOffer.title}
                </h1>
                <button className={
                  selectedOffer.isFavorite
                    ? 'offer__bookmark-button offer__bookmark-button--active button'
                    : 'offer__bookmark-button button'
                } type="button"
                onClick={() => {
                  if (authStatus !== AuthStatus.Auth) {
                    navigate(APIRoute.Login);
                  }

                  dispatch(addFavouriteAction({offerId: selectedOffer.id, status: selectedOffer.isFavorite ? 0 : 1}));
                }}
                >
                  <svg className="offer__bookmark-icon" width="31" height="33">
                    <use xlinkHref="#icon-bookmark"></use>
                  </svg>
                  <span className="visually-hidden">To bookmarks</span>
                </button>
              </div>
              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{width: `${Math.round(selectedOffer.rating) * 20}%`}}></span>
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">{Math.round(selectedOffer.rating)}</span>
              </div>
              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">
                  {selectedOffer.type}
                </li>
                <li className="offer__feature offer__feature--bedrooms">
                  {`${selectedOffer.bedrooms} Bedrooms`}
                </li>
                <li className="offer__feature offer__feature--adults">
                  {`Max ${selectedOffer.maxAdults} adults`}
                </li>
              </ul>
              <div className="offer__price">
                <b className="offer__price-value">&euro;{selectedOffer.price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>
              <div className="offer__inside">
                <h2 className="offer__inside-title">What&apos;s inside</h2>
                <ul className="offer__inside-list">
                  {selectedOffer.goods.map((item) => (
                    <li className="offer__inside-item" key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>
                <div className="offer__host-user user">
                  <div className={`offer__avatar-wrapper ${selectedOffer.host.isPro ? 'offer__avatar-wrapper--pro' : ''} user__avatar-wrapper`}>
                    <img
                      className="offer__avatar user__avatar"
                      src={selectedOffer.host.avatarUrl}
                      width="74"
                      height="74"
                      alt="Host avatar"
                    />
                  </div>
                  <span className="offer__user-name">
                    {selectedOffer.host.name}
                  </span>
                  {selectedOffer.host.isPro && <span className="offer__user-status">Pro</span>}
                </div>
                <div className="offer__description">
                  <p className="offer__text">
                    {selectedOffer.description}
                  </p>
                </div>
              </div>
              <section className="offer__reviews reviews">
                <h2 className="reviews__title">
                  Reviews &middot; <span className="reviews__amount">{reviews.length}</span>
                </h2>
                <ul className="reviews__list">
                  {sortedReviewList.map((review) => (
                    <Review key={review.id} review={review}/>
                  ))}
                </ul>
                {authStatus === AuthStatus.Auth && <CommentForm id={id!}/>}
              </section>
            </div>
          </div>
          <Map city={selectedOffer.city} points={mapPoints} activeOfferId={selectedOffer.id}/>
        </section>
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">
              Other places in the neighbourhood
            </h2>
            <OffersList offers={nearbyOffers.slice(0, 3)} listType="near" />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
