import React from 'react';
import { Bell, Home, Ticket, Crown } from 'lucide-react';
import NotificationPanel from './NotificationPanel';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(2);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">Highfly-AG Parking</h1>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full hover:bg-gray-100"
          >
            <Bell className="h-6 w-6 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around h-16">
            <a href="/" className="flex flex-col items-center justify-center w-full hover:text-blue-600">
              <Home className="h-6 w-6" />
              <span className="text-sm mt-1">Home</span>
            </a>
            <a href="/tickets" className="flex flex-col items-center justify-center w-full hover:text-blue-600">
              <Ticket className="h-6 w-6" />
              <span className="text-sm mt-1">My Tickets</span>
            </a>
            <a href="/premium" className="flex flex-col items-center justify-center w-full hover:text-blue-600">
              <Crown className="h-6 w-6" />
              <span className="text-sm mt-1">Premium</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Notification Panel */}
      {showNotifications && (
        <NotificationPanel onClose={() => setShowNotifications(false)} />
      )}
    </div>
  );
}