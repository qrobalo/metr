import React, { useState } from 'react';
import { Search, Trash2, ExternalLink } from 'lucide-react';

interface NotificationsProps {
  onOpenProject: (id: number) => void;
}

export default function Notifications({ onOpenProject }: NotificationsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<number | null>(3);

  const notifications = [
    {
      id: 1,
      date: '04/11/2025',
      title: 'Vous avez été ajouté à un projet',
      message: null,
      isRead: true
    },
    {
      id: 2,
      date: '02/11/2025',
      title: 'Vous avez été ajouté à une bibliothèque',
      message: null,
      isRead: true
    },
    {
      id: 3,
      date: '31/10/2015',
      title: "Vous avez été supprimé d'un projet",
      message: 'Paul Dupont vous a supprimé du projet "Immeuble Haussmannien".',
      isRead: false,
      projectId: 1
    },
    {
      id: 4,
      date: '28/10/2025',
      title: 'Vous avez été ajouté à une bibliothèque',
      message: null,
      isRead: true
    },
    {
      id: 5,
      date: '24/10/2025',
      title: 'Vous avez été ajouté à un projet',
      message: null,
      isRead: true
    },
    {
      id: 6,
      date: '24/10/2025',
      title: 'Vous avez été ajouté à une bibliothèque',
      message: null,
      isRead: true
    },
    {
      id: 7,
      date: '20/10/2025',
      title: 'Vous avez été ajouté à une bibliothèque',
      message: null,
      isRead: true
    },
    {
      id: 8,
      date: '15/10/2025',
      title: 'Vous avez été ajouté à un projet',
      message: null,
      isRead: true
    },
    {
      id: 9,
      date: '09/10/2025',
      title: "Vous avez été supprimé d'un projet",
      message: null,
      isRead: true
    }
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const selected = notifications.find(n => n.id === selectedNotification);

  return (
    <div className="p-8 max-w-7xl">
      <h2 className="text-3xl font-bold text-primary-900 mb-8">Notifications</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications List */}
        <div className="lg:col-span-1">
          <div className="card">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher dans les notifications"
                className="input-field pl-10"
              />
            </div>

            {/* Stats */}
            <p className="text-sm text-gray-600 mb-4">
              <span className="font-semibold">{notifications.length} Notifications</span> / {unreadCount} Non lues
            </p>

            {/* Notifications Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Titre</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {notifications.map((notification) => (
                    <tr
                      key={notification.id}
                      onClick={() => setSelectedNotification(notification.id)}
                      className={`cursor-pointer transition-colors ${
                        selectedNotification === notification.id
                          ? 'bg-blue-50'
                          : notification.isRead
                          ? 'bg-white hover:bg-gray-50'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {notification.date}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {notification.title}
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-gray-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Notification Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="card">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {selected.title}
                  </h3>
                  <p className="text-sm text-gray-500">{selected.date}</p>
                </div>
              </div>

              {selected.message && (
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed">
                    {selected.message}
                  </p>
                </div>
              )}

              {selected.projectId && (
                <button 
                  onClick={() => onOpenProject(selected.projectId!)}
                  className="btn-primary flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Ouvrir
                </button>
              )}
            </div>
          ) : (
            <div className="card text-center py-12">
              <p className="text-gray-500">
                Sélectionnez une notification pour voir les détails
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}