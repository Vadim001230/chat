import { useState } from 'react';
import { useUpdateMessageMutation, useDeleteMessageMutation } from '../../redux/messageApi';
import Preloader from '../../UI/preloader/Preloader';
import { ReactComponent as DeleteIcon } from '../../UI/icons/deleteIcon.svg';
import { ReactComponent as UpdateIcon } from '../../UI/icons/updateIcon.svg';
import { ReactComponent as OkIcon } from '../../UI/icons/ok.svg';
import { ReactComponent as CancelIcon } from '../../UI/icons/cancel.svg';

export default function MessMenu({ id, text }: { id: number; text: string | null }) {
  const [updatedMessage, setUpdatedMessage] = useState(text || '');
  const [showUpdatedMessage, setShowUpdatedMessage] = useState(false);
  const [deleteMess, { isLoading, isError }] = useDeleteMessageMutation();
  const [updateMess, { isLoading: isLoadingUpdate, isError: isErrorUpdate }] =
    useUpdateMessageMutation();

  const handleDeleteMess = async () => {
    await deleteMess({ id }).unwrap();
  };

  const handleUpdateMess = async () => {
    if (text !== updatedMessage && updatedMessage.trim().length > 0) {
      await updateMess({ id, text: updatedMessage }).unwrap();
      setShowUpdatedMessage(false);
    }
  };

  if (isLoading || isLoadingUpdate) return <Preloader />;

  return (
    <div className="chat__mes-menu">
      <div
        onClick={handleDeleteMess}
        onKeyDown={(event) => {
          if (event.key === 'Enter') handleDeleteMess();
        }}
        role="button"
        tabIndex={0}
        title="Delete"
        className="chat__btn-mess-delete"
      >
        <span>Удалить</span>
        <DeleteIcon />
      </div>

      <div
        onClick={() => setShowUpdatedMessage(!showUpdatedMessage)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') setShowUpdatedMessage(!showUpdatedMessage);
        }}
        role="button"
        tabIndex={0}
        title="Update"
        className="chat__btn-mess-update"
      >
        <span>Изменить</span>
        <UpdateIcon />
      </div>

      {showUpdatedMessage && (
        <div className="update__modal">
          <div className="update__container">
            <div className="chat__update-old-text">
              Изменить сообщение: <span>{text}</span>
            </div>
            <form className="chat__update-form chat__form">
              <textarea
                className="chat__textarea"
                rows={1}
                value={updatedMessage}
                onChange={(e) => {
                  setUpdatedMessage(e.target.value);
                }}
                onKeyDown={(event) => {
                  const textarea = event.target as HTMLTextAreaElement;
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    handleUpdateMess();
                  } else if (
                    (event.key === 'Enter' && event.shiftKey && textarea.rows < 5) ||
                    (textarea.scrollHeight / 21 > textarea.rows && textarea.rows < 5)
                  ) {
                    textarea.rows += 1;
                    textarea.style.height = `${textarea.offsetHeight + 21}px`;
                  }
                }}
              />
              <button className="update-btn" type="button" onClick={handleUpdateMess}>
                <OkIcon
                  style={
                    text !== updatedMessage && updatedMessage.trim().length > 0
                      ? { pointerEvents: 'auto', stroke: '#3bee35' }
                      : { pointerEvents: 'none' }
                  }
                />
              </button>
              <button
                className="update-btn"
                type="button"
                onClick={() => setShowUpdatedMessage(false)}
              >
                <CancelIcon />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
