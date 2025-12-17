import React from 'react';
import { Bell, User } from 'lucide-react';

interface HeaderProps {
  userName: string;
  date: string;
  notificationCount?: number;
  onNotificationClick: () => void;
  onProfileClick: () => void;
}

export default function Header({ 
  userName, 
  date, 
  notificationCount = 0,
  onNotificationClick,
  onProfileClick 
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Welcome Message */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bienvenue {userName}
          </h1>
          <p className="text-sm text-gray-500">{date}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications - Pastille uniquement si > 0 */}
          <button
            onClick={onNotificationClick}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors bg-transparent border-0 p-0 m-0"
          >
            <Bell className="w-6 h-6 text-gray-600" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>

          {/* Profile */}
          <button
            onClick={onProfileClick}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors bg-transparent border-0 p-0 m-0"
          >
            <User className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
}