/* eslint-disable react/jsx-props-no-spreading */
import { ReactNode } from 'react';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { ReactComponent as ErrorIcon } from '../UI/icons/error.svg';

export default function RegistrationPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    reset();
  };

  return (
    <div className="auth">
      <h1 className="auth__title">Регистрация</h1>
      <form className="auth__form" onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Введите логин"
          className="auth__input"
          {...register('username', {
            required: 'Поле необходимо заполнить',
            maxLength: {
              value: 15,
              message: 'Максимум 15 символов',
            },
            pattern: {
              value: /^[^\s]+$/,
              message: 'Поле не должно содержать пробелов',
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
              message: 'Минимум 4 символа',
            },
            maxLength: {
              value: 12,
              message: 'Максимум 12 символов',
            },
            pattern: {
              value: /^[^\s]+$/,
              message: 'Поле не должно содержать пробелов',
            },
          })}
        />
        {errors?.password && (
          <div className="auth__error">
            <ErrorIcon />
            <span>{(errors?.password?.message as ReactNode) || 'Error password'}</span>
          </div>
        )}

        <button className="auth__btn" type="submit" disabled={!isValid}>
          Войти
        </button>
      </form>
    </div>
  );
}
