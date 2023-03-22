/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useEffect, useRef, useState } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import IMessage from '../../types/IMessage';
import transformDate from '../../utils/transformDate';
// import Auth from '../auth/auth';
import '../index.css';

function Chat() {
  const socket = useRef<WebSocket | undefined>();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState('');
  const [value, setValue] = useState('');
  const [notEmptyMessage, setNotEmptyMessage] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const textareaFocus = useRef<HTMLTextAreaElement>(null);
  const messagesAutoScroll = useRef<HTMLDivElement>(null);

  useEffect(() => {
    textareaFocus.current?.focus();
  }, [connected]);

  useEffect(() => {
    messagesAutoScroll.current?.scrollIntoView({ behavior: 'smooth' }); // scroll bottom after send message
  }, [messages]);

  const clickCountRef = useRef(0);
  useEffect(() => {
    function handleClickOutsidePicker(event: MouseEvent) {
      clickCountRef.current += 1;
      const target = event.target as Element;
      if (
        clickCountRef.current > 1 &&
        showPicker &&
        !target.closest('.chat__picker')
      ) {
        setShowPicker(false);
      }
    }
    document.addEventListener('click', handleClickOutsidePicker);
    return () => {
      document.removeEventListener('click', handleClickOutsidePicker);
      clickCountRef.current = 0;
    };
  }, [showPicker]);

  function connect() {
    if (socket.current?.readyState === WebSocket.OPEN) {
      return;
    }
    socket.current = new WebSocket('ws://localhost:5001'); // wss?

    socket.current.onopen = () => {
      const message = {
        event: 'connection',
        username,
      };
      if (socket.current && username.trim().length > 0) {
        setConnected(true);
        socket.current.send(JSON.stringify(message));
        localStorage.setItem('user', username);
      }
    };

    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
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

  function sendMessage() {
    const message = {
      text: value.trim().toString(),
      username,
      event: 'message',
    };
    if (socket.current && value.trim().length > 0) {
      socket.current.send(JSON.stringify(message));
      setValue('');
      setNotEmptyMessage(false);
      const textarea = textareaFocus.current as HTMLTextAreaElement;
      textarea.rows = 1;
    }
  }

  if (!connected) {
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
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                if (username.trim().length > 0) connect();
              }
            }}
          />
          <button
            className="auth__btn"
            type="button"
            style={
              username.trim().length > 0
                ? { pointerEvents: 'auto' }
                : { pointerEvents: 'none' }
            }
            onClick={connect}
          >
            Войти
          </button>
        </form>
      </div>
    );
  }

  const handleEmojiSelect = (emoji: { native: string }) => {
    setValue(value + emoji.native);
    setNotEmptyMessage(true);
  };
  const handleTogglePicker = () => {
    setShowPicker(!showPicker);
  };

  return (
    <div className="chat">
      <h1 className="chat__title">Чат</h1>
      <div className="chat__messages">
        {messages.map((mess) =>
          mess.event === 'connection' ? (
            <div
              className="chat__message_conection"
              key={mess.id}
              ref={messagesAutoScroll}
            >
              Пользователь <span>{mess.username}</span> подключился
            </div>
          ) : (
            <div
              className={
                mess.username === localStorage.getItem('user')
                  ? 'chat__message_own'
                  : 'chat__message'
              }
              key={mess.id}
              ref={messagesAutoScroll}
            >
              <div className="chat__message_info">
                <span className="chat__message_username">
                  {mess.username === localStorage.getItem('user')
                    ? 'Вы'
                    : mess.username}
                </span>
                <span className="chat__message_date">
                  {String(transformDate(mess.createdAt))}
                </span>
              </div>
              <div className="chat__message_text">{mess.text}</div>
            </div>
          )
        )}
      </div>

      <div className="chat__picker">
        {showPicker && <Picker data={data} onEmojiSelect={handleEmojiSelect} />}
      </div>

      <form className="chat__form">
        <textarea
          ref={textareaFocus}
          placeholder="Отправить сообщение"
          className="chat__textarea"
          rows={1}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            e.target.value.trim().length > 0
              ? setNotEmptyMessage(true)
              : setNotEmptyMessage(false);
          }}
          onKeyDown={(event) => {
            const textarea = event.target as HTMLTextAreaElement;
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              sendMessage();
            } else if (
              (event.key === 'Enter' && event.shiftKey && textarea.rows < 5) ||
              (textarea.scrollHeight / 21 > textarea.rows && textarea.rows < 5) // 21 this textarea height 1 row
            ) {
              textarea.rows += 1;
            }
          }}
        />

        <button
          onClick={handleTogglePicker}
          type="button"
          className="chat__btn-emoji"
        >
          😀
        </button>

        <button
          className="chat__btn-submit"
          type="button"
          onClick={sendMessage}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            className="submit-icon"
            style={
              notEmptyMessage
                ? { stroke: '#1D9BF0', strokeWidth: '2' }
                : { stroke: '#9ea1a1' }
            }
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
