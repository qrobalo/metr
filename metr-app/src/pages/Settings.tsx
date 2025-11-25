import React, { useState } from 'react';
import { Bell, Shield, Users, Palette, Globe, Download, Trash2, LogOut } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('notifications');
  const [settings, setSettings] = useState({
    emailNotifications: true,
    projectUpdates: true,
    libraryChanges: false,
    weeklyReport: true,
    twoFactorAuth: false,
    darkMode: false,
    language: 'fr',
    dateFormat: 'dd/mm/yyyy'
  });

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'team', label: 'Équipe', icon: Users },
    { id: 'preferences', label: 'Préférences', icon: Palette },
    { id: 'data', label: 'Données', icon: Download }
  ];

  const toggleSetting = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-[#1e3a8a] mb-8">Paramètres</h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-[#1e3a8a] font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-8">
            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Notifications</h3>
                <p className="text-gray-600 mb-6">Gérez vos préférences de notification</p>

                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-6 border-b">
                    <div>
                      <p className="font-medium text-gray-900">Notifications par email</p>
                      <p className="text-sm text-gray-500">Recevoir des emails pour les événements importants</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={() => toggleSetting('emailNotifications')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1e3a8a]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between pb-6 border-b">
                    <div>
                      <p className="font-medium text-gray-900">Mises à jour de projets</p>
                      <p className="text-sm text-gray-500">Être notifié quand un projet est modifié</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.projectUpdates}
                        onChange={() => toggleSetting('projectUpdates')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1e3a8a]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between pb-6 border-b">
                    <div>
                      <p className="font-medium text-gray-900">Modifications de bibliothèques</p>
                      <p className="text-sm text-gray-500">Notifications pour les changements dans vos bibliothèques</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.libraryChanges}
                        onChange={() => toggleSetting('libraryChanges')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1e3a8a]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Rapport hebdomadaire</p>
                      <p className="text-sm text-gray-500">Recevoir un résumé de votre activité chaque semaine</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.weeklyReport}
                        onChange={() => toggleSetting('weeklyReport')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1e3a8a]"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Sécurité</h3>
                <p className="text-gray-600 mb-6">Protégez votre compte</p>

                <div className="space-y-6">
                  <div>
                    <label className="block font-medium text-gray-900 mb-2">
                      Mot de passe actuel
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-900 mb-2">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-900 mb-2">
                      Confirmer le mot de passe
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                    />
                  </div>

                  <button className="bg-[#1e3a8a] text-white px-6 py-2 rounded-lg hover:bg-[#1e40af] transition-colors font-medium">
                    Modifier le mot de passe
                  </button>

                  <div className="pt-6 border-t mt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Authentification à deux facteurs</p>
                        <p className="text-sm text-gray-500">Ajoutez une couche de sécurité supplémentaire</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.twoFactorAuth}
                          onChange={() => toggleSetting('twoFactorAuth')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1e3a8a]"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences */}
            {activeTab === 'preferences' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Préférences</h3>
                <p className="text-gray-600 mb-6">Personnalisez votre expérience</p>

                <div className="space-y-6">
                  <div>
                    <label className="block font-medium text-gray-900 mb-2">
                      Langue
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) => setSettings({...settings, language: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-gray-900 mb-2">
                      Format de date
                    </label>
                    <select
                      value={settings.dateFormat}
                      onChange={(e) => setSettings({...settings, dateFormat: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                    >
                      <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                      <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                      <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t">
                    <div>
                      <p className="font-medium text-gray-900">Mode sombre</p>
                      <p className="text-sm text-gray-500">Activer le thème sombre (bientôt disponible)</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.darkMode}
                        onChange={() => toggleSetting('darkMode')}
                        disabled
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-disabled:opacity-50"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Data */}
            {activeTab === 'data' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Données</h3>
                <p className="text-gray-600 mb-6">Gérez vos données</p>

                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Download className="w-8 h-8 text-blue-500" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">Exporter mes données</h4>
                        <p className="text-sm text-gray-500">Téléchargez toutes vos données au format ZIP</p>
                      </div>
                      <button className="bg-[#1e3a8a] text-white px-6 py-2 rounded-lg hover:bg-[#1e40af] transition-colors font-medium">
                        Exporter
                      </button>
                    </div>
                  </div>

                  <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                    <div className="flex items-center gap-4 mb-4">
                      <Trash2 className="w-8 h-8 text-red-500" />
                      <div className="flex-1">
                        <h4 className="font-medium text-red-900">Supprimer mon compte</h4>
                        <p className="text-sm text-red-700">Cette action est irréversible</p>
                      </div>
                      <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium">
                        Supprimer
                      </button>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center gap-4">
                      <LogOut className="w-8 h-8 text-gray-500" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">Se déconnecter</h4>
                        <p className="text-sm text-gray-500">Déconnexion de votre session actuelle</p>
                      </div>
                      <button className="border border-gray-300 bg-white text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                        Déconnexion
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Team */}
            {activeTab === 'team' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Équipe</h3>
                <p className="text-gray-600 mb-6">Gérez les membres de votre équipe</p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                  <Users className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                  <h4 className="font-medium text-gray-900 mb-2">Fonctionnalité Pro</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    La gestion d'équipe est disponible avec un compte Pro
                  </p>
                  <button className="bg-[#f97316] text-white px-6 py-2 rounded-lg hover:bg-[#ea580c] transition-colors font-medium">
                    Passer à Pro
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}