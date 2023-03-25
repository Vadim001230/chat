import { ReactComponent as LogOutIcon } from '../../UI/icons/logout.svg';

export default function ChatSettings({ onDisconnect }: { onDisconnect: () => void }) {
  return (
    <div className="chat__settings">
      <div
        onClick={onDisconnect}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            onDisconnect();
          }
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
