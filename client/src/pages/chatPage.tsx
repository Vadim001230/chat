/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useEffect, useRef, useState } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ReactComponent as SettingsIcon } from '../UI/icons/settings.svg';
import { ReactComponent as SendIcon } from '../UI/icons/sendIcon.svg';
import { ReactComponent as MesMenuIcon } from '../UI/icons/MesMenuIcon.svg';
import Spiner from '../UI/spiner/spiner';
import { useGetMessagesQuery } from '../redux/messageApi';
import IMessage from '../types/IMessage';
import transformDate from '../utils/transformDate';
import MessMenu from '../components/chat/messMenu';
import ChatSettings from '../components/chat/chatSettings';
import '../index.css';

export default function Chat() {
  const socket = useRef<WebSocket | undefined>();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [connected, setConnected] = useState(true);
  const [username, setUsername] = useState('');
  const [value, setValue] = useState('');
  const [notEmptyMessage, setNotEmptyMessage] = useState(false);
  const [showChatSettings, setShowChatSettings] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [showMessInfo, setShowMessInfo] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<number>(0);
  const textareaFocus = useRef<HTMLTextAreaElement>(null);
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const {
    data: messData,
    isLoading,
    error,
    isFetching,
  } = useGetMessagesQuery({
    limit,
    offset,
  });

  useEffect(() => {
    textareaFocus.current?.focus();
  }, [connected]);

  useEffect(() => {
    if (messData) {
      setMessages(messData.messages);
    }
  }, [messData]);

  const loadMoreMessages = () => {
    setLimit((prev) => prev + 20); // to do сделать через offset
  };

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const clickCountRef = useRef(0);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      clickCountRef.current += 1;
      const target = event.target as Element;
      if (clickCountRef.current > 1 && showChatSettings && !target.closest('.chat__settings')) {
        setShowChatSettings(false);
      }
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
  }, [showChatSettings, showMessInfo, showPicker]);

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
      message.event === 'delete_message' || message.event === 'update_message'
        ? (setLimit((prevLimit) => prevLimit + 1), setShowMessInfo(false))
        : setMessages((prevMessages) => [message, ...prevMessages]);
    };

    socket.current.onclose = () => {
      localStorage.removeItem('user');
      setConnected(false);
      socket.current = undefined;
      setMessages([]);
    };

    socket.current.onerror = (err) => {
      setConnected(false);
      socket.current = undefined;
    };
  }

  function disconnect() {
    const message = {
      event: 'disconnection',
      username,
    };
    if (socket.current) {
      socket.current.send(JSON.stringify(message));
      socket.current.close();
      setLimit((prevLimit) => prevLimit - 1); // удалить потом эту строчку
    }
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

  connect();

  const handleToggleChatSettings = () => {
    setShowChatSettings(!showChatSettings);
  };
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
      <div className="chat__info">
        <h1 className="chat__title">Чат</h1>
        <button onClick={handleToggleChatSettings} type="button" className="chat__btn-settings">
          <SettingsIcon />
          {showChatSettings && (
            <ChatSettings onDisconnect={() => disconnect()} onTheme={() => toggleTheme()} />
          )}
        </button>
      </div>
      <div className="chat__messages" id="scrollableDiv">
        <InfiniteScroll
          dataLength={messages.length}
          next={loadMoreMessages}
          hasMore={messages.length < messData?.count}
          loader={(isFetching || isLoading) && <Spiner />}
          className="chat__messages"
          scrollableTarget="scrollableDiv"
          inverse
        >
          {messages.map((mess) =>
            // eslint-disable-next-line no-nested-ternary
            mess.event === 'connection' ? (
              <div className="chat__message_connection" key={mess.id}>
                Пользователь <span>{mess.username}</span> подключился
              </div>
            ) : mess.event === 'disconnection' ? (
              <div className="chat__message_disconnection" key={mess.id}>
                Пользователь <span>{mess.username}</span> покинул чат
              </div>
            ) : (
              <div
                className={mess.username === ownUser ? 'chat__message_own' : 'chat__message'}
                key={mess.id}
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
                      {showMessInfo && mess.id === selectedMessageId && (
                        <MessMenu id={mess.id} text={mess.text} />
                      )}
                    </div>
                  )}
                </div>
                <div className="chat__message_text">{mess.text}</div>
                <div className="chat__message_date">
                  {new Date(mess.createdAt).getTime() !== new Date(mess.updatedAt).getTime() && (
                    <span style={{ marginRight: '5px' }}>изменено</span>
                  )}
                  <span>{String(transformDate(mess.createdAt))}</span>
                </div>
              </div>
            )
          )}
        </InfiniteScroll>
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
            setNotEmptyMessage(e.target.value.trim().length > 0);
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
