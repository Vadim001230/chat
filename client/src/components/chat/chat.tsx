import { useRef, useState } from 'react';
import './chat.css';

function Chat() {
  const socket = useRef<WebSocket | undefined>();
  const [connected, setConnected] = useState(false);
  const [value, setValue] = useState('');

  function connect() {
    if (socket.current?.readyState === WebSocket.OPEN) {
      return;
    }
    socket.current = new WebSocket('ws://localhost:5000'); // wss??

    socket.current.onopen = () => {
      setConnected(true);
    };

    socket.current.onmessage = () => {

    };

    socket.current.onclose = (event) => {
      setConnected(false);
      socket.current = undefined;
      if (event.wasClean) {
        console.log(
          `Соединение закрыто чисто, код=${event.code} причина=${event.reason}`
        );
      } else {
        console.log('Соединение прервано');
      }
    };

    socket.current.onerror = (error) => {
      setConnected(false);
      socket.current = undefined;
      console.log(error);
    };
  }

  return (
    <div className="chat">
      <h1 className="chat__title">Чат</h1>
      <form className="chat__form">
        <textarea
          placeholder="Отправить сообщение"
          className="chat__input"
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="submit" className="chat__btn-submit">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            className="submit-icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}

export default Chat;
