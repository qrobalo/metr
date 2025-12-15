import React, { useState } from 'react';
import { Search, Trash2, Bell, User } from 'lucide-react';

interface NotificationsProps {
  onOpenProject: (id: number) => void;
  onNotificationRead?: () => void;
}

export default function Notifications({ onOpenProject, onNotificationRead }: NotificationsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<number | null>(null);
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      date: '13/12/2025',
      time: '16:45',
      title: 'Nouveau collaborateur ajouté',
      message: 'Sophie Martin a été ajoutée au projet "Résidence Les Mimosas" avec les droits d\'édition. Elle peut désormais consulter et modifier tous les plans du projet.',
      isRead: false,
      type: 'team',
      projectId: 5,
      author: 'Jean Dupont'
    },
    {
      id: 2,
      date: '13/12/2025',
      time: '14:30',
      title: 'Plan modifié - Modifications importantes',
      message: 'Le plan "Rez-de-chaussée - Version 3.dwg" du projet "Villa Méditerranée" a été mis à jour par Marie Leclerc. 15 éléments ont été modifiés.',
      isRead: false,
      type: 'project',
      projectId: 1,
      author: 'Marie Leclerc'
    },
    {
      id: 3,
      date: '13/12/2025',
      time: '11:20',
      title: 'Commentaire sur votre plan',
      message: 'Paul Durand a commenté le plan "Étage 1" : "Attention aux dimensions de la salle de bain principale, il faut respecter les normes PMR."',
      isRead: false,
      type: 'project',
      projectId: 1,
      author: 'Paul Durand'
    },
    {
      id: 4,
      date: '12/12/2025',
      time: '18:00',
      title: 'Document ajouté au projet',
      message: 'Un nouveau document "Facture Prestataire - Décembre 2025.pdf" (2.4 MB) a été ajouté au projet "Villa Méditerranée" dans la section Documents annexes.',
      isRead: false,
      type: 'project',
      projectId: 1
    },
    {
      id: 5,
      date: '12/12/2025',
      time: '16:30',
      title: 'Projet marqué comme terminé',
      message: 'Le projet "Immeuble Haussmannien" a été marqué comme terminé. Tous les plans ont été validés et archivés. Félicitations pour ce projet achevé !',
      isRead: true,
      type: 'project',
      projectId: 2
    },
    {
      id: 6,
      date: '12/12/2025',
      time: '14:15',
      title: 'Rappel : Date de livraison proche',
      message: 'Le projet "Centre Commercial Westfield" doit être livré dans 5 jours (17/12/2025). Pensez à finaliser les derniers plans et à préparer les exports.',
      isRead: true,
      type: 'system',
      projectId: 3
    },
    {
      id: 7,
      date: '12/12/2025',
      time: '09:45',
      title: 'Invitation acceptée',
      message: 'Thomas Bernard a accepté votre invitation à rejoindre le projet "Rénovation Mairie". Il a maintenant accès en lecture seule à tous les documents.',
      isRead: true,
      type: 'team',
      projectId: 4,
      author: 'Thomas Bernard'
    },
    {
      id: 8,
      date: '11/12/2025',
      time: '17:30',
      title: 'Export de projet terminé',
      message: 'L\'export du projet "Villa Méditerranée" au format PDF est prêt. Vous pouvez le télécharger depuis la page du projet (taille: 45.2 MB).',
      isRead: true,
      type: 'system',
      projectId: 1
    },
    {
      id: 9,
      date: '11/12/2025',
      time: '15:20',
      title: 'Bibliothèque partagée avec vous',
      message: 'L\'administrateur a partagé la bibliothèque "Matériaux Premium 2025" avec vous. Elle contient 350 articles avec prix mis à jour.',
      isRead: true,
      type: 'team'
    },
    {
      id: 10,
      date: '11/12/2025',
      time: '10:30',
      title: 'Projet archivé',
      message: 'Le projet "Tour de bureaux - Phase 1" a été archivé. Les données restent accessibles en consultation mais ne peuvent plus être modifiées.',
      isRead: true,
      type: 'project',
      projectId: 6
    },
    {
      id: 11,
      date: '10/12/2025',
      time: '16:00',
      title: 'Mise à jour système - Nouvelles fonctionnalités',
      message: 'Metr a été mis à jour ! Nouvelles fonctionnalités : export Excel amélioré, mesures automatiques sur plans, et synchronisation en temps réel.',
      isRead: true,
      type: 'system'
    },
    {
      id: 12,
      date: '10/12/2025',
      time: '11:45',
      title: 'Nouveau plan ajouté',
      message: 'Un nouveau plan "Façade Sud - Vue détaillée.dwg" a été ajouté au projet "Villa Méditerranée" par Sophie Martin.',
      isRead: true,
      type: 'project',
      projectId: 1,
      author: 'Sophie Martin'
    }
  ]);

  const handleDeleteNotification = (notifId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Supprimer cette notification ?')) {
      setNotifications(prev => prev.filter(n => n.id !== notifId));
      if (selectedNotification === notifId) {
        setSelectedNotification(null);
      }
      if (onNotificationRead) onNotificationRead();
    }
  };

  const handleMarkAsRead = (notifId: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === notifId ? { ...n, isRead: true } : n)
    );
    if (onNotificationRead) onNotificationRead();
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    if (onNotificationRead) onNotificationRead();
  };

  const handleDeleteRead = () => {
    if (confirm('Supprimer toutes les notifications lues ?')) {
      setNotifications(prev => prev.filter(n => !n.isRead));
      setSelectedNotification(null);
      if (onNotificationRead) onNotificationRead();
    }
  };

  const handleSelectNotification = (notif: any) => {
    setSelectedNotification(notif.id);
    if (!notif.isRead) {
      handleMarkAsRead(notif.id);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesSearch = 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.author && n.author.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const selected = notifications.find(n => n.id === selectedNotification);

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header - Style Figma */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tout marquer comme lu
            </button>
            <button
              onClick={handleDeleteRead}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT - Liste des notifications (style tableau) */}
        <div className="w-2/3 bg-white border-r border-gray-200 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher dans les notifications"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div className="mt-3 text-sm text-gray-600">
              {notifications.length} Notifications / {unreadCount} Non lues
            </div>
          </div>

          {/* Table Header */}
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
            <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-700 uppercase">
              <div className="col-span-3">Date</div>
              <div className="col-span-7">Titre</div>
              <div className="col-span-2 text-center">Actions</div>
            </div>
          </div>

          {/* Liste des notifications */}
          <div className="flex-1 overflow-y-auto">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => handleSelectNotification(notif)}
                  className={`px-4 py-3 border-b border-gray-200 cursor-pointer transition-colors ${
                    selectedNotification === notif.id
                      ? 'bg-blue-50'
                      : !notif.isRead
                      ? 'bg-blue-50/30 hover:bg-blue-50/50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-3 text-sm text-gray-600">
                      {notif.date}
                    </div>
                    <div className="col-span-7">
                      <div className="flex items-center gap-2">
                        {!notif.isRead && (
                          <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                        )}
                        <span className="text-sm text-gray-900 font-medium truncate">
                          {notif.title}
                        </span>
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectNotification(notif);
                        }}
                        className="p-1.5 hover:bg-orange-100 rounded transition-colors"
                        title="Voir détails"
                      >
                        <Bell className="w-4 h-4 text-orange-500" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteNotification(notif.id, e)}
                        className="p-1.5 hover:bg-red-100 rounded transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center py-12">
                  <Bell className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Aucune notification</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {searchQuery ? 'Aucun résultat trouvé' : 'Vous êtes à jour !'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT - Détail de la notification */}
        <div className="w-1/3 bg-white flex flex-col">
          {selected ? (
            <div className="flex-1 flex flex-col p-6">
              {/* Header du détail */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 pr-8">{selected.title}</h3>
                  <button
                    onClick={(e) => handleDeleteNotification(selected.id, e as any)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                    title="Supprimer"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  {selected.date}
                </div>
              </div>

              {/* Message */}
              <div className="flex-1 mb-6">
                <p className="text-sm text-gray-700 leading-relaxed">{selected.message}</p>
              </div>

              {/* Actions */}
              {selected.projectId && (
                <div className="border-t border-gray-200 pt-4">
                  <button
                    onClick={() => onOpenProject(selected.projectId!)}
                    className="w-full px-4 py-2.5 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm"
                  >
                    Suivre
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium mb-1">Sélectionnez une notification</p>
                <p className="text-sm text-gray-400">
                  Cliquez sur une notification pour voir les détails
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}