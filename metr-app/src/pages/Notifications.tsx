import React, { useEffect, useMemo, useState } from 'react';
import { Search, Trash2, ExternalLink, Check, CheckCheck } from 'lucide-react';

interface Notification {
  id: number;
  date: string;
  title: string;
  message?: string | null;
  isRead: boolean;
  projectId?: number;
  projectRemoved?: boolean;
}

interface NotificationsProps {
  onOpenProject: (id: number) => void;
  onNotificationRead?: () => void;
}

export default function Notifications({
  onOpenProject,
  onNotificationRead
}: NotificationsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<number | null>(3);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      date: '04/11/2025',
      title: 'Ajout à un projet',
      message: 'Vous avez été ajouté au projet "Tour Verre La Défense".',
      isRead: true,
      projectId: 2
    },
    {
      id: 2,
      date: '02/11/2025',
      title: 'Ajout à une bibliothèque',
      message: 'Une bibliothèque de matériaux a été partagée avec vous.',
      isRead: true
    },
    {
      id: 3,
      date: '31/10/2025',
      title: "Suppression d'un projet",
      message:
        'Paul Dupont vous a supprimé du projet "Immeuble Haussmannien". Vous n’avez plus accès à ce projet.',
      isRead: false,
      projectId: 1,
      projectRemoved: true
    }
  ]);

  /* ---------------------------------- */
  /* UTILITIES                          */
  /* ---------------------------------- */

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications = useMemo(() => {
    return notifications
      .filter(n =>
        (n.title + (n.message ?? '')).toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [notifications, searchQuery]);

  const selected = notifications.find(n => n.id === selectedNotification);

  /* ---------------------------------- */
  /* ACTIONS                            */
  /* ---------------------------------- */

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
    onNotificationRead?.();
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    onNotificationRead?.();
  };

  const deleteNotification = (id: number) => {
    if (!confirm('Supprimer cette notification ?')) return;

    setNotifications(prev => prev.filter(n => n.id !== id));
    if (selectedNotification === id) setSelectedNotification(null);
  };

  const deleteReadNotifications = () => {
    if (!confirm('Supprimer toutes les notifications lues ?')) return;
    setNotifications(prev => prev.filter(n => !n.isRead));
  };

  /* ---------------------------------- */
  /* SIDE EFFECTS                       */
  /* ---------------------------------- */

  useEffect(() => {
    if (selected && !selected.isRead) {
      markAsRead(selected.id);
    }
  }, [selected]);

  /* ---------------------------------- */
  /* RENDER                             */
  /* ---------------------------------- */

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-[#1e3a8a] mb-8">Notifications</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">

          {/* Search */}
          <div className="relative mb-4">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Rechercher une notification"
              className="w-full pl-10 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#1e3a8a]"
            />
          </div>

          {/* Stats + Actions */}
          <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
            <span>
              <strong>{notifications.length}</strong> notifications •{' '}
              <strong>{unreadCount}</strong> non lues
            </span>

            <div className="flex gap-3">
              <button
                onClick={markAllAsRead}
                className="hover:text-[#1e3a8a]"
                title="Tout marquer comme lu"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
              <button
                onClick={deleteReadNotifications}
                className="hover:text-red-500"
                title="Supprimer les lues"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="border rounded-lg flex-1 overflow-hidden">
            <div className="max-h-[520px] overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                  Aucune notification
                </div>
              ) : (
                <table className="w-full">
                  <tbody className="divide-y">
                    {filteredNotifications.map(n => (
                      <tr
                        key={n.id}
                        onClick={() => setSelectedNotification(n.id)}
                        className={`cursor-pointer transition ${
                          selectedNotification === n.id
                            ? 'bg-blue-50'
                            : n.isRead
                            ? 'hover:bg-gray-50'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {!n.isRead && (
                              <span className="w-2 h-2 bg-blue-600 rounded-full" />
                            )}
                            <div>
                              <p className="font-medium text-sm">{n.title}</p>
                              <p className="text-xs text-gray-500">{n.date}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              deleteNotification(n.id);
                            }}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-8">
          {selected ? (
            <>
              <div className="flex justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold">{selected.title}</h3>
                  <p className="text-sm text-gray-500">{selected.date}</p>
                </div>

                <button
                  onClick={() => deleteNotification(selected.id)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {selected.message && (
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {selected.message}
                </p>
              )}

              {selected.projectId && !selected.projectRemoved && (
                <button
                  onClick={() => onOpenProject(selected.projectId!)}
                  className="bg-[#1e3a8a] text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-[#1e40af]"
                >
                  <ExternalLink className="w-4 h-4" />
                  Ouvrir le projet
                </button>
              )}
            </>
          ) : (
            <div className="text-center text-gray-500 py-12">
              Sélectionnez une notification
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
