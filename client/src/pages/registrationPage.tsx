/* eslint-disable react/jsx-props-no-spreading */
import { ReactNode } from 'react';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { useRegistrationMutation } from '../redux/authApi';
import { ReactComponent as ErrorIcon } from '../UI/icons/error.svg';
import Preloader from '../UI/preloader/Preloader';

export default function RegistrationPage() {
  const [signup, { isLoading, isError, error }] = useRegistrationMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: 'onBlur' });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    const { username, password } = data;
    signup({ username, password }).unwrap();
  };

  return (
    <div className="auth">
      <h1 className="auth__title">Регистрация</h1>
      <form className="auth__form" onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Введите логин (имя пользователя)"
          className="auth__input"
          {...register('username', {
            required: 'Поле необходимо заполнить',
            maxLength: {
              value: 15,
              message: 'Логин может содержать максимум 15 символов',
            },
            pattern: {
              value: /^[^\s]+$/,
              message: 'Логин не должнен содержать пробелов',
            },
          })}
        />
        {errors?.username && (
          <div className="auth__error">
            <ErrorIcon />
            <span>{(errors?.username?.message as ReactNode) || 'Error login'}</span>
          </div>
        )}

        <input
          type="password"
          placeholder="Введите пароль"
          className="auth__input"
          {...register('password', {
            required: 'Поле необходимо заполнить',
            minLength: {
              value: 4,
              message: 'Пароль должен содержать минимум 4 символа',
            },
            maxLength: {
              value: 20,
              message: 'Пароль может содержать максимум 20 символов',
            },
            pattern: {
              value: /^[^\s]+$/,
              message: 'Пароль не должен содержать пробелов',
            },
          })}
        />
        {errors?.password && (
          <div className="auth__error">
            <ErrorIcon />
            <span>{(errors?.password?.message as ReactNode) || 'Error password'}</span>
          </div>
        )}
        {isError && (
          <div className="auth__error">
            <ErrorIcon />
            {error && error.data && <span>{error.data.message}</span>}
          </div>
        )}

        <button className="auth__btn" type="submit" disabled={!isValid}>
          Войти
        </button>
      </form>

      {isLoading && <Preloader />}
    </div>
  );
}
