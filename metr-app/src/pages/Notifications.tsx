import React, { useState, useEffect } from 'react';
import { Search, Trash2, ExternalLink, Bell, CheckCircle, User, FileText, Users, Calendar, AlertCircle, MessageCircle, Upload, Download, Archive, Check, Filter, ChevronDown } from 'lucide-react';

interface NotificationsProps {
  onOpenProject: (id: number) => void;
  onNotificationRead?: () => void;
}

export default function Notifications({ onOpenProject, onNotificationRead }: NotificationsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'project' | 'team' | 'system'>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      date: '13/12/2025',
      time: '16:45',
      title: 'Nouveau collaborateur ajouté',
      message: 'Sophie Martin a été ajoutée au projet "Résidence Les Mimosas" avec les droits d\'édition. Elle peut désormais consulter et modifier tous les plans du projet.',
      isRead: false,
      type: 'team',
      icon: Users,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-100',
      projectId: 5,
      author: 'Jean Dupont',
      priority: 'normal'
    },
    {
      id: 2,
      date: '13/12/2025',
      time: '14:30',
      title: 'Plan modifié - Modifications importantes',
      message: 'Le plan "Rez-de-chaussée - Version 3.dwg" du projet "Villa Méditerranée" a été mis à jour par Marie Leclerc. 15 éléments ont été modifiés.',
      isRead: false,
      type: 'project',
      icon: FileText,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100',
      projectId: 1,
      author: 'Marie Leclerc',
      priority: 'high'
    },
    {
      id: 3,
      date: '13/12/2025',
      time: '11:20',
      title: 'Commentaire sur votre plan',
      message: 'Paul Durand a commenté le plan "Étage 1" : "Attention aux dimensions de la salle de bain principale, il faut respecter les normes PMR."',
      isRead: false,
      type: 'project',
      icon: MessageCircle,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-100',
      projectId: 1,
      author: 'Paul Durand',
      priority: 'normal'
    },
    {
      id: 4,
      date: '12/12/2025',
      time: '18:00',
      title: 'Document ajouté au projet',
      message: 'Un nouveau document "Facture Prestataire - Décembre 2025.pdf" (2.4 MB) a été ajouté au projet "Villa Méditerranée" dans la section Documents annexes.',
      isRead: false,
      type: 'project',
      icon: Upload,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-100',
      projectId: 1,
      priority: 'low'
    },
    {
      id: 5,
      date: '12/12/2025',
      time: '16:30',
      title: 'Projet marqué comme terminé',
      message: 'Le projet "Immeuble Haussmannien" a été marqué comme terminé. Tous les plans ont été validés et archivés. Félicitations pour ce projet achevé !',
      isRead: true,
      type: 'project',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-100',
      projectId: 2,
      priority: 'normal'
    },
    {
      id: 6,
      date: '12/12/2025',
      time: '14:15',
      title: 'Rappel : Date de livraison proche',
      message: 'Le projet "Centre Commercial Westfield" doit être livré dans 5 jours (17/12/2025). Pensez à finaliser les derniers plans et à préparer les exports.',
      isRead: true,
      type: 'system',
      icon: AlertCircle,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-100',
      projectId: 3,
      priority: 'high'
    },
    {
      id: 7,
      date: '12/12/2025',
      time: '09:45',
      title: 'Invitation acceptée',
      message: 'Thomas Bernard a accepté votre invitation à rejoindre le projet "Rénovation Mairie". Il a maintenant accès en lecture seule à tous les documents.',
      isRead: true,
      type: 'team',
      icon: User,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-100',
      projectId: 4,
      author: 'Thomas Bernard',
      priority: 'low'
    },
    {
      id: 8,
      date: '11/12/2025',
      time: '17:30',
      title: 'Export de projet terminé',
      message: 'L\'export du projet "Villa Méditerranée" au format PDF est prêt. Vous pouvez le télécharger depuis la page du projet (taille: 45.2 MB).',
      isRead: true,
      type: 'system',
      icon: Download,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100',
      projectId: 1,
      priority: 'normal'
    },
    {
      id: 9,
      date: '11/12/2025',
      time: '15:20',
      title: 'Bibliothèque partagée avec vous',
      message: 'L\'administrateur a partagé la bibliothèque "Matériaux Premium 2025" avec vous. Elle contient 350 articles avec prix mis à jour.',
      isRead: true,
      type: 'team',
      icon: Users,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-100',
      priority: 'low'
    },
    {
      id: 10,
      date: '11/12/2025',
      time: '10:30',
      title: 'Projet archivé',
      message: 'Le projet "Tour de bureaux - Phase 1" a été archivé. Les données restent accessibles en consultation mais ne peuvent plus être modifiées.',
      isRead: true,
      type: 'project',
      icon: Archive,
      iconColor: 'text-gray-600',
      bgColor: 'bg-gray-100',
      projectId: 6,
      priority: 'low'
    },
    {
      id: 11,
      date: '10/12/2025',
      time: '16:00',
      title: 'Mise à jour système - Nouvelles fonctionnalités',
      message: 'Metr a été mis à jour ! Nouvelles fonctionnalités : export Excel amélioré, mesures automatiques sur plans, et synchronisation en temps réel.',
      isRead: true,
      type: 'system',
      icon: Bell,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100',
      priority: 'normal'
    },
    {
      id: 12,
      date: '10/12/2025',
      time: '11:45',
      title: 'Nouveau plan ajouté',
      message: 'Un nouveau plan "Façade Sud - Vue détaillée.dwg" a été ajouté au projet "Villa Méditerranée" par Sophie Martin.',
      isRead: true,
      type: 'project',
      icon: Upload,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-100',
      projectId: 1,
      author: 'Sophie Martin',
      priority: 'normal'
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

  const handleMarkAsRead = (notifId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
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
    
    const matchesFilter = 
      filterType === 'all' ? true :
      filterType === 'unread' ? !n.isRead :
      n.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const selected = notifications.find(n => n.id === selectedNotification);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'project': return 'Projet';
      case 'team': return 'Équipe';
      case 'system': return 'Système';
      default: return 'Info';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-red-500';
      case 'normal': return 'border-l-4 border-blue-500';
      case 'low': return 'border-l-4 border-gray-300';
      default: return '';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-[#1e3a8a] flex items-center gap-3">
              <Bell className="w-8 h-8" />
              Centre de notifications
            </h2>
            <p className="text-gray-600 mt-1">
              Suivez l'activité de vos projets en temps réel
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#1e40af] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <CheckCircle className="w-4 h-4" />
              Tout marquer comme lu
            </button>
            <button
              onClick={handleDeleteRead}
              className="flex items-center gap-2 px-4 py-2.5 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
            >
              <Trash2 className="w-4 h-4" />
              Supprimer les lues
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Bell className="w-6 h-6 opacity-80" />
              <span className="text-sm opacity-90">Total</span>
            </div>
            <p className="text-3xl font-bold">{notifications.length}</p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-6 h-6 opacity-80" />
              <span className="text-sm opacity-90">Non lues</span>
            </div>
            <p className="text-3xl font-bold">{unreadCount}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-6 h-6 opacity-80" />
              <span className="text-sm opacity-90">Projets</span>
            </div>
            <p className="text-3xl font-bold">{notifications.filter(n => n.type === 'project').length}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-6 h-6 opacity-80" />
              <span className="text-sm opacity-90">Équipe</span>
            </div>
            <p className="text-3xl font-bold">{notifications.filter(n => n.type === 'team').length}</p>
          </div>

          <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Bell className="w-6 h-6 opacity-80" />
              <span className="text-sm opacity-90">Système</span>
            </div>
            <p className="text-3xl font-bold">{notifications.filter(n => n.type === 'system').length}</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT - Notifications List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex flex-col">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {[
              { value: 'all', label: 'Toutes', count: notifications.length },
              { value: 'unread', label: 'Non lues', count: unreadCount },
              { value: 'project', label: 'Projets', count: notifications.filter(n => n.type === 'project').length },
              { value: 'team', label: 'Équipe', count: notifications.filter(n => n.type === 'team').length },
              { value: 'system', label: 'Système', count: notifications.filter(n => n.type === 'system').length }
            ].map(filter => (
              <button
                key={filter.value}
                onClick={() => setFilterType(filter.value as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  filterType === filter.value
                    ? 'bg-[#1e3a8a] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label} <span className="opacity-75">({filter.count})</span>
              </button>
            ))}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto -mx-6 px-6" style={{ maxHeight: '650px' }}>
            {filteredNotifications.length > 0 ? (
              <div className="space-y-3">
                {filteredNotifications.map(notif => {
                  const Icon = notif.icon;
                  return (
                    <div
                      key={notif.id}
                      onClick={() => handleSelectNotification(notif)}
                      className={`p-4 rounded-xl cursor-pointer transition-all ${getPriorityColor(notif.priority)} ${
                        selectedNotification === notif.id
                          ? 'bg-blue-50 border-2 border-[#1e3a8a] shadow-md'
                          : notif.isRead
                          ? 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm'
                          : 'bg-yellow-50 border-2 border-yellow-400 hover:border-yellow-500 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${notif.bgColor}`}>
                          <Icon className={`w-6 h-6 ${notif.iconColor}`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className={`font-bold text-sm ${!notif.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notif.title}
                            </p>
                            {!notif.isRead && (
                              <div className="w-2.5 h-2.5 bg-orange-500 rounded-full flex-shrink-0 mt-1 animate-pulse"></div>
                            )}
                          </div>
                          
                          <p className="text-xs text-gray-500 mb-2 flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            {notif.date} • {notif.time}
                          </p>
                          
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              notif.type === 'project' ? 'bg-blue-100 text-blue-700' :
                              notif.type === 'team' ? 'bg-purple-100 text-purple-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {getTypeLabel(notif.type)}
                            </span>
                            {notif.author && (
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {notif.author}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={(e) => handleDeleteNotification(notif.id, e)}
                          className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <Bell className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-semibold text-lg">Aucune notification</p>
                <p className="text-sm text-gray-400 mt-2">
                  {searchQuery ? 'Aucun résultat' : 'Vous êtes à jour !'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT - Notification Detail */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-200 p-8 min-h-[700px] flex flex-col">
          {selected ? (
            <>
              <div className="flex items-start gap-5 mb-6 pb-6 border-b-2 border-gray-200">
                {(() => {
                  const Icon = selected.icon;
                  return (
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${selected.bgColor}`}>
                      <Icon className={`w-8 h-8 ${selected.iconColor}`} />
                    </div>
                  );
                })()}
                
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{selected.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="flex items-center gap-1.5 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {selected.date} à {selected.time}
                    </span>
                    {selected.author && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className="flex items-center gap-1.5 text-gray-600">
                          <User className="w-4 h-4" />
                          {selected.author}
                        </span>
                      </>
                    )}
                    <span className="text-gray-300">•</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      selected.type === 'project' ? 'bg-blue-100 text-blue-700' :
                      selected.type === 'team' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {getTypeLabel(selected.type)}
                    </span>
                    {selected.priority === 'high' && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Priorité haute
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={(e) => handleDeleteNotification(selected.id, e as any)}
                  className="p-2.5 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                  title="Supprimer"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-6 border border-gray-200">
                  <p className="text-gray-700 leading-relaxed text-base">{selected.message}</p>
                </div>

                {/* Actions */}
                {selected.projectId && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => onOpenProject(selected.projectId!)}
                      className="px-8 py-3.5 rounded-lg font-semibold bg-gradient-to-r from-[#1e3a8a] to-blue-700 text-white hover:shadow-lg flex items-center gap-2 transition-all"
                    >
                      <ExternalLink className="w-5 h-5" />
                      Ouvrir le projet
                    </button>
                    {!selected.isRead && (
                      <button
                        onClick={(e) => handleMarkAsRead(selected.id, e as any)}
                        className="px-8 py-3.5 rounded-lg font-semibold border-2 border-green-500 text-green-600 hover:bg-green-50 flex items-center gap-2 transition-all"
                      >
                        <Check className="w-5 h-5" />
                        Marquer comme lu
                      </button>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bell className="w-12 h-12 text-blue-600" />
                </div>
                <p className="text-gray-500 font-bold text-xl mb-2">Sélectionnez une notification</p>
                <p className="text-gray-400 text-sm">
                  Cliquez sur une notification pour voir les détails complets
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}