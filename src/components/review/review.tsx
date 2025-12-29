import {ReviewType} from '../../internal/types/review-type.tsx';

type ReviewProps = {
  review: ReviewType;
};

function getMonthYearDateFormat(dt: string): string {
  const date = new Date(dt);
  return date.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric'
  });
}

export function Review({ review }: ReviewProps) {
  const { date, user, rating, comment } = review;
  return (
    <li className="reviews__item" >
      <div className="reviews__user user">
        <div className="reviews__avatar-wrapper user__avatar-wrapper">
          <img
            className="reviews__avatar user__avatar"
            src={user.avatarUrl}
            width={54}
            height={54}
            alt="Reviews avatar"
          />
        </div>
        <span className="reviews__user-name">{user.name}</span>
      </div>
      <div className="reviews__info">
        <div className="reviews__rating rating">
          <div className="reviews__stars rating__stars">
            <span style={{ width: `${rating * 20}%` }} />
            <span className="visually-hidden">{rating}</span>
          </div>
        </div>
        <p className="reviews__text">{comment}</p>
        <time className="reviews__time" dateTime="2019-04-24">
          {`${getMonthYearDateFormat(date)}`}
        </time>
      </div>
    </li>
  );
}
