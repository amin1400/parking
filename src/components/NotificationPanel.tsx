import React from 'react';
import { X } from 'lucide-react';
import type { Notification } from '../types';

interface NotificationPanelProps {
  onClose: () => void;
}

export default function NotificationPanel({ onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  React.useEffect(() => {
    // Load notifications from localStorage
    const savedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    setNotifications(savedNotifications);

    // Mark notifications as read
    const updatedNotifications = savedNotifications.map((notification: Notification) => ({
      ...notification,
      read: true
    }));
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  }, []);

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg z-50">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="overflow-y-auto h-full pb-16">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-100 ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
            >
              <h3 className="font-medium">{notification.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
              <span className="text-xs text-gray-500 mt-2 block">
                {new Date(notification.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            No notifications yet
          </div>
        )}
      </div>
    </div>
  );
}