import { useUpdateMessageMutation, useDeleteMessageMutation } from '../../redux/messageApi';
import Preloader from '../../UI/preloader/Preloader';
import { ReactComponent as DeleteIcon } from '../../UI/icons/deleteIcon.svg';
import { ReactComponent as UpdateIcon } from '../../UI/icons/updateIcon.svg';
import '../index.css';

export default function MessMenu({ id }: { id: number }) {
  const [deleteMess, { isLoading, isError }] = useDeleteMessageMutation();
  const [updateMess, { isLoading: isLoadingUpdate, isError: isErrorUpdate }] =
    useUpdateMessageMutation();

  const handleDeleteMess = async () => {
    await deleteMess({ id }).unwrap();
  };
  const handleUpdateMess = async () => {
    await updateMess({ id }).unwrap();
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
        onClick={handleUpdateMess}
        onKeyDown={(event) => {
          if (event.key === 'Enter') handleUpdateMess();
        }}
        role="button"
        tabIndex={0}
        title="Update"
        className="chat__btn-mess-update"
      >
        <span>Изменить</span>
        <UpdateIcon />
      </div>
    </div>
  );
}
