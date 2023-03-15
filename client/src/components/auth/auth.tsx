import { useState } from 'react';
import '../index.css';

function Auth() {
  const [username, setUsername] = useState('');

  return (
    <div className="auth">
      <h1 className="auth__title">Чат</h1>
      <form className="auth__form">
        <input
          type="text"
          placeholder="Введите имя"
          className="auth__input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button className="auth__btn" type="button">
          Войти
        </button>
      </form>
    </div>
  );
}

export default Auth;
