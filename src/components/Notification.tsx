import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface NotificationProps {
  show: boolean;
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({
  show,
  message,
  type = 'success',
  onClose,
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      className={`fixed top-4 right-4 max-w-sm p-4 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-600' : 'bg-red-600'
      } text-white`}
    >
      <div className="flex items-center justify-between">
        <p>{message}</p>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};