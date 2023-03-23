/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useEffect, useRef, useState } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { ReactComponent as SendIcon } from '../../UI/icons/sendIcon.svg';
import { ReactComponent as MesMenuIcon } from '../../UI/icons/MesMenuIcon.svg';
import Spiner from '../../UI/spiner/spiner';
import { useGetMessagesQuery } from '../../redux/messageApi';
import IMessage from '../../types/IMessage';
import transformDate from '../../utils/transformDate';
// import Auth from '../auth/auth';
import '../index.css';
import MessMenu from './messMenu';

function Chat() {
  const socket = useRef<WebSocket | undefined>();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState('');
  const [value, setValue] = useState('');
  const [notEmptyMessage, setNotEmptyMessage] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [showMessInfo, setShowMessInfo] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<number>(0);
  const textareaFocus = useRef<HTMLTextAreaElement>(null);
  const messagesAutoScroll = useRef<HTMLDivElement>(null);
  const {
    data: messData,
    isLoading,
    error,
    isFetching,
  } = useGetMessagesQuery({
    limit: 20,
    offset: 0,
  });

  useEffect(() => {
    textareaFocus.current?.focus();
  }, [connected]);

  useEffect(() => {
    if (messData) {
      setMessages(messData);
    }
  }, [messData]);

  useEffect(() => {
    messagesAutoScroll.current?.scrollIntoView({ behavior: 'smooth' }); // scroll bottom after send message
  }, [messages]);

  const clickCountRef = useRef(0);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      clickCountRef.current += 1;
      const target = event.target as Element;
      if (clickCountRef.current > 1 && showPicker && !target.closest('.chat__picker')) {
        setShowPicker(false);
      }
      if (clickCountRef.current > 1 && showMessInfo && !target.closest('.chat__mes-menu')) {
        setShowMessInfo(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      clickCountRef.current = 0;
    };
  }, [showMessInfo, showPicker]);

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

    socket.current.onclose = () => {
      const message = {
        event: 'disconnection',
        username,
      };
      if (socket.current) socket.current.send(JSON.stringify(message));
      localStorage.removeItem('user');
      setConnected(false);
      socket.current = undefined;
    };

    socket.current.onerror = (err) => {
      setConnected(false);
      socket.current = undefined;
      console.log(err);
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
      textarea.style.height = '21px';
    }
  }
  if (error) {
    return <h1>Упс... что-то пошло не так</h1>;
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
              username.trim().length > 0 ? { pointerEvents: 'auto' } : { pointerEvents: 'none' }
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
  const handleToggleMessInfo = (id: number) => {
    setSelectedMessageId(id);
    setShowMessInfo(!showMessInfo);
  };

  const ownUser = localStorage.getItem('user');

  return (
    <div className="chat">
      <h1 className="chat__title">Чат</h1>
      <div className="chat__messages">
        {messages.map((mess) =>
          // eslint-disable-next-line no-nested-ternary
          mess.event === 'connection' ? (
            <div className="chat__message_connection" key={mess.id} ref={messagesAutoScroll}>
              Пользователь <span>{mess.username}</span> подключился
            </div>
          ) : mess.event === 'disconnection' ? (
            <div className="chat__message_disconnection" key={mess.id} ref={messagesAutoScroll}>
              Пользователь <span>{mess.username}</span> покинул чат
            </div>
          ) : (
            <div
              className={mess.username === ownUser ? 'chat__message_own' : 'chat__message'}
              key={mess.id}
              ref={messagesAutoScroll}
            >
              <div className="chat__message_info">
                <span className="chat__message_username">
                  {mess.username === ownUser ? 'Вы' : mess.username}
                </span>
                {mess.username === ownUser && (
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => handleToggleMessInfo(mess.id)}
                      type="button"
                      className="chat__btn-mes-menu"
                    >
                      <MesMenuIcon />
                    </button>
                    {showMessInfo && mess.id === selectedMessageId && <MessMenu id={mess.id} />}
                  </div>
                )}
              </div>
              <div className="chat__message_text">{mess.text}</div>
              <span className="chat__message_date">{String(transformDate(mess.createdAt))}</span>
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
            e.target.value.trim().length > 0 ? setNotEmptyMessage(true) : setNotEmptyMessage(false);
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
              textarea.style.height = `${textarea.offsetHeight + 21}px`;
            }
          }}
        />

        <button onClick={handleTogglePicker} type="button" className="chat__btn-emoji">
          😀
        </button>

        <button className="chat__btn-submit" type="button" onClick={sendMessage}>
          <SendIcon
            style={
              notEmptyMessage ? { stroke: '#1D9BF0', strokeWidth: '2' } : { stroke: '#9ea1a1' }
            }
          />
        </button>
      </form>
    </div>
  );
}

export default Chat;
