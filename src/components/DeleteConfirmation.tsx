import React from 'react';
import { AlertTriangle } from 'lucide-react';

type DeleteConfirmationProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
};

function DeleteConfirmation({ isOpen, onClose, onConfirm, title, message }: DeleteConfirmationProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="text-red-500" size={24} />
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
        <p className="text-gray-500 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmation;