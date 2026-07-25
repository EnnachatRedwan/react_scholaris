import AppModal from './AppModal';
import { Btn } from './ui';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

const DeleteModal = ({ open, onClose, onConfirm, itemName }: Props) => (
  <AppModal show={open} onClose={onClose} size="sm">
    <div className="text-center py-2">
      <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-400 dark:text-red-500" />
      <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-100">Delete confirmation</h3>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Are you sure you want to delete{' '}
        <span className="font-semibold text-gray-700 dark:text-gray-200">{itemName}</span>?
        <br />This action cannot be undone.
      </p>
      <div className="flex justify-center gap-3">
        <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
        <Btn variant="danger" onClick={onConfirm}>Yes, delete</Btn>
      </div>
    </div>
  </AppModal>
);

export default DeleteModal;
