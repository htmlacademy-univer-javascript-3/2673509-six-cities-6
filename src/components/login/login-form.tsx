import {FormEvent, useEffect, useState} from 'react';
import {loginAction} from '../../store/api-actions.ts';
import {useAppDispatch, useAppSelector} from '../../store/hooks.ts';
import {useNavigate} from 'react-router-dom';
import {AppRouteEnum} from '../../internal/enums/app-route-enum.tsx';
import {AuthStatus} from '../../internal/enums/auth-status-enum.tsx';
import {setError} from '../../store/actions.ts';

export function LoginForm(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthorized =
    useAppSelector((state) => state.authStatus) ===
    AuthStatus.Auth;

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (email.length > 0 && password.length > 0 && /[a-z]/.test(password) && /[0-9]/.test(password)) {
      dispatch(
        loginAction({email, password})
      );
    } else {
      dispatch(setError('Password should contain at least 1 letter and digit'));
      setTimeout(() => dispatch(setError(null)), 2000);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      navigate(AppRouteEnum.MainPage);
    }
  }, [navigate, isAuthorized]);

  return (
    <form className="login__form form" onSubmit={handleSubmit}>
      <div className="login__input-wrapper form__input-wrapper">
        <label className="visually-hidden">
          E-mail
        </label>
        <input
          className="login__input form__input"
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          required
        />
      </div>
      <div className="login__input-wrapper form__input-wrapper">
        <label className="visually-hidden">
          Password
        </label>
        <input
          className="login__input form__input"
          type="password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          required
        />
      </div>
      <button className="login__submit form__submit button" type="submit">
        Sign in
      </button>
    </form>
  );
}
