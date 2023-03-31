import { useState } from 'react';
import { useGetUsersQuery } from '../../redux/authApi';
import useAuth from '../../hoc/useAuth';
import Spiner from '../../UI/spiner/spiner';
import IUser from '../../types/IUser';
import transformDate from '../../utils/transformDate';
import { ReactComponent as CancelIcon } from '../../UI/icons/cancel.svg';

export default function ChatUsers() {
  const { user: ownUser } = useAuth();
  const token = ownUser?.token || '';
  const { data, isLoading, isFetching } = useGetUsersQuery(token);
  const [showUsers, setShowUsers] = useState(false);

  if (isLoading || isFetching) return <Spiner />;

  return (
    <div className="chat__users">
      <div
        onClick={() => setShowUsers(!showUsers)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') setShowUsers(!showUsers);
        }}
        role="button"
        tabIndex={0}
        title="Users"
        className="chat__users-title"
      >
        Участников в чате: {data.count}
      </div>

      {showUsers && (
        <div className="users__modal">
          <div className="users__modal-container">
            <button className="users__modal-btn" type="button" onClick={() => setShowUsers(false)}>
              <CancelIcon />
            </button>
            {data?.users.map((user: IUser) => {
              return (
                <div className="users__modal-user" key={user.id}>
                  <span>{user.username}</span>
                  <span>Присоединился: {String(transformDate(user.createdAt))}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
