import {ChangeEvent, FormEvent, useState} from 'react';
import {useAppDispatch} from '../../store/hooks/hooks.ts';
import {Rating} from '../../internal/types/rating.tsx';
import {sendReviewAction} from '../../store/api-actions/api-actions.ts';

type CommentFromProps = {
  id: string;
};

export function CommentForm({ id }: CommentFromProps) {
  const [formState, setFormState] = useState<Rating>({
    rating: '',
    comment: '',
  });
  const dispatch = useAppDispatch();
  const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFormState((prevState) => ({
      ...prevState,
      comment: e.target.value,
    }));
  };
  const handleRatingChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormState((prevState) => ({
      ...prevState,
      rating: e.target.value,
    }));
  };
  const isValid = () =>
    formState.comment.trim().length > 49
    && formState.comment.trim().length < 300
    && formState.rating !== '';

  const handleFromSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    dispatch(
      sendReviewAction({
        id,
        comment: {
          comment: formState.comment,
          rating: Number(formState.rating),
        },
      })
    );
    setFormState((prevState) => ({
      ...prevState,
      rating: '',
      comment: '',
    }));
  };

  return (
    <form className="reviews__form form" onSubmit={handleFromSubmit}>
      <label className="reviews__label form__label" htmlFor="review">
        Your review
      </label>
      <div className="reviews__rating-form form__rating">
        <input
          className="form__rating-input visually-hidden"
          name="rating"
          defaultValue={5}
          id="5-stars"
          type="radio"
          onChange={handleRatingChange}
          checked={formState.rating === '5'}
        />
        <label
          htmlFor="5-stars"
          className="reviews__rating-label form__rating-label"
          title="perfect"
        >
          <svg className="form__star-image" width={37} height={33}>
            <use xlinkHref="#icon-star" />
          </svg>
        </label>
        <input
          className="form__rating-input visually-hidden"
          name="rating"
          defaultValue={4}
          id="4-stars"
          type="radio"
          onChange={handleRatingChange}
          checked={formState.rating === '4'}
        />
        <label
          htmlFor="4-stars"
          className="reviews__rating-label form__rating-label"
          title="good"
        >
          <svg className="form__star-image" width={37} height={33}>
            <use xlinkHref="#icon-star" />
          </svg>
        </label>
        <input
          className="form__rating-input visually-hidden"
          name="rating"
          defaultValue={3}
          id="3-stars"
          type="radio"
          onChange={handleRatingChange}
          checked={formState.rating === '3'}
        />
        <label
          htmlFor="3-stars"
          className="reviews__rating-label form__rating-label"
          title="not bad"
        >
          <svg className="form__star-image" width={37} height={33}>
            <use xlinkHref="#icon-star" />
          </svg>
        </label>
        <input
          className="form__rating-input visually-hidden"
          name="rating"
          defaultValue={2}
          id="2-stars"
          type="radio"
          onChange={handleRatingChange}
          checked={formState.rating === '2'}
        />
        <label
          htmlFor="2-stars"
          className="reviews__rating-label form__rating-label"
          title="badly"
        >
          <svg className="form__star-image" width={37} height={33}>
            <use xlinkHref="#icon-star" />
          </svg>
        </label>
        <input
          className="form__rating-input visually-hidden"
          name="rating"
          defaultValue={1}
          id="1-star"
          type="radio"
          onChange={handleRatingChange}
          checked={formState.rating === '1'}
        />
        <label
          htmlFor="1-star"
          className="reviews__rating-label form__rating-label"
          title="terribly"
        >
          <svg className="form__star-image" width={37} height={33}>
            <use xlinkHref="#icon-star" />
          </svg>
        </label>
      </div>
      <textarea
        className="reviews__textarea form__textarea"
        id="review"
        name="review"
        placeholder="Tell how was your stay, what you like and what can be improved"
        onChange={handleCommentChange}
        value={formState.comment}
      >
      </textarea>
      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please make sure to set{' '}
          <span className="reviews__star">rating</span> and describe your stay
          with at least <b className="reviews__text-amount">50 characters</b>.
        </p>
        <button
          className="reviews__submit form__submit button"
          type="submit"
          disabled={!isValid()}
        >
          Submit
        </button>
      </div>
    </form>
  );
}
