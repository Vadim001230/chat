import { useCallback, useEffect, useRef, useState } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import InfiniteScroll from 'react-infinite-scroll-component';
import useAuth from '../hoc/useAuth';
import { useGetMessagesQuery } from '../redux/messageApi';
import { ReactComponent as SettingsIcon } from '../UI/icons/settings.svg';
import { ReactComponent as SendIcon } from '../UI/icons/sendIcon.svg';
import { ReactComponent as MesMenuIcon } from '../UI/icons/mesMenuIcon.svg';
import Spiner from '../UI/spiner/spiner';
import IMessage from '../types/IMessage';
import transformDate from '../utils/transformDate';
import MessMenu from '../components/chat/messMenu';
import ChatSettings from '../components/chat/chatSettings';
import ChatUsers from '../components/chat/chatUsers';
import '../index.scss';

export default function Chat() {
  const socket = useRef<WebSocket | undefined>();
  const { user, logOut } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [connected, setConnected] = useState(localStorage.getItem('isConnected') || false);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [value, setValue] = useState('');
  const [notEmptyMessage, setNotEmptyMessage] = useState(false);
  const [showChatSettings, setShowChatSettings] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [showMessInfo, setShowMessInfo] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<number>(0);
  const textareaFocus = useRef<HTMLTextAreaElement>(null);
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const clickCountRef = useRef(0);

  const {
    data: messData,
    isLoading,
    isError,
    isFetching,
  } = useGetMessagesQuery({
    limit,
    offset,
  });

  useEffect(() => {
    textareaFocus.current?.focus();
    localStorage.setItem('isConnected', 'true');
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

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

  const connect = useCallback(() => {
    if (socket.current?.readyState === WebSocket.OPEN) {
      return;
    }
    socket.current = new WebSocket('ws://localhost:5001');

    socket.current.onopen = () => {
      const message = {
        event: 'connection',
        username: user?.username,
      };
      if (socket.current && !connected) {
        socket.current.send(JSON.stringify(message));
        setConnected(true);
      }
    };

    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.event === 'delete_message' || message.event === 'update_message') {
        setLimit((prevLimit) => prevLimit + 1);
        setShowMessInfo(false);
      } else {
        setMessages((prevMessages) => [message, ...prevMessages]);
      }
    };

    socket.current.onclose = () => {
      socket.current = undefined;
      setMessages([]);
    };

    socket.current.onerror = () => {
      socket.current = undefined;
    };
  }, [user, connected]);

  useEffect(() => {
    if (!socket.current) connect();
  });
  useEffect(() => {
    if (messData) setMessages(messData.messages);
  }, [connect, messData]);

  function disconnect() {
    const message = {
      event: 'disconnection',
      username: user?.username,
    };
    if (socket.current) {
      setConnected(false);
      localStorage.setItem('isConnected', 'false');
      socket.current.send(JSON.stringify(message));
      socket.current.close();
      logOut();
    }
  }

  function sendMessage() {
    const message = {
      text: value.trim().toString(),
      username: user?.username,
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

  const loadMoreMessages = () => {
    setLimit((prev) => prev + 20);
  };
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  const handleEmojiSelect = (emoji: { native: string }) => {
    setValue(value + emoji.native);
    setNotEmptyMessage(true);
  };
  const handleToggleMessInfo = (id: number) => {
    setSelectedMessageId(id);
    setShowMessInfo(!showMessInfo);
  };

  if (isError) {
    return <h1 className="chat__error">Упс... что-то пошло не так</h1>;
  }

  return (
    <div className="chat">
      <div className="chat__info">
        <h1 className="chat__title">Чатик</h1>
        <ChatUsers />
        <button
          onClick={() => setShowChatSettings(!showChatSettings)}
          type="button"
          className="chat__btn-settings"
        >
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
          {messages.map((mess) => {
            switch (mess.event) {
              case 'connection':
                return (
                  <div className="chat__message_connection" key={mess.id}>
                    Пользователь <span>{mess.username}</span> подключился
                  </div>
                );
              case 'disconnection':
                return (
                  <div className="chat__message_disconnection" key={mess.id}>
                    Пользователь <span>{mess.username}</span> покинул чат
                  </div>
                );
              default:
                return (
                  <div
                    className={
                      mess.username === user?.username ? 'chat__message_own' : 'chat__message'
                    }
                    key={mess.id}
                  >
                    <div className="chat__message_info">
                      <span className="chat__message_username">
                        {mess.username === user?.username ? 'Вы' : mess.username}
                      </span>
                      {mess.username === user?.username && (
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
                      {new Date(mess.createdAt).getTime() !==
                        new Date(mess.updatedAt).getTime() && <span>изменено</span>}
                      <span>{String(transformDate(mess.createdAt))}</span>
                    </div>
                  </div>
                );
            }
          })}
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
              (textarea.scrollHeight / 21 > textarea.rows && textarea.rows < 5)
            ) {
              textarea.rows += 1;
              textarea.style.height = `${textarea.offsetHeight + 21}px`;
            }
          }}
        />

        <button
          onClick={() => setShowPicker(!showPicker)}
          type="button"
          className="chat__btn-emoji"
        >
          😀
        </button>

        <button className="chat__btn-submit" type="button" onClick={sendMessage}>
          <SendIcon
            style={
              notEmptyMessage ? { stroke: 'var(--thumb)', strokeWidth: '2' } : { stroke: '#9ea1a1' }
            }
          />
        </button>
      </form>
    </div>
  );
}
