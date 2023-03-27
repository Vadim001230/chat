import { ReactComponent as LogOutIcon } from '../../UI/icons/logout.svg';
import { ReactComponent as DarkIcon } from '../../UI/icons/darkIcon.svg';
import { ReactComponent as LightIcon } from '../../UI/icons/LightIcon.svg';

export default function ChatSettings({
  onDisconnect,
  onTheme,
}: {
  onDisconnect: () => void;
  onTheme: () => void;
}) {
  const theme = localStorage.getItem('theme');

  return (
    <div className="chat__settings">
      <div
        onClick={onTheme}
        onKeyDown={(event) => {
          if (event.key === 'Enter') onTheme();
        }}
        role="button"
        tabIndex={0}
        title="Toggle theme"
        className="chat__btn-theme"
      >
        <span>{theme === 'light' ? 'Темная тема' : 'Светлая тема'}</span>
        {theme === 'light' ? <DarkIcon /> : <LightIcon />}
      </div>

      <div
        onClick={onDisconnect}
        onKeyDown={(event) => {
          if (event.key === 'Enter') onDisconnect();
        }}
        role="button"
        tabIndex={0}
        title="Log out"
        className="chat__btn-logout"
      >
        <span>Покинуть чат</span>
        <LogOutIcon />
      </div>
    </div>
  );
}
