import React, { useState } from 'react';
import { Bell, Shield, Users, Palette, Download, Trash2, LogOut, Save, Eye, EyeOff, Key, Globe, Clock, FileText, Database, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface SettingsProps {
  onLogout: () => void;
}

export default function Settings({ onLogout }: SettingsProps) {
  const [activeTab, setActiveTab] = useState('notifications');
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [settings, setSettings] = useState({
    emailNotifications: true,
    projectUpdates: true,
    libraryChanges: false,
    weeklyReport: true,
    teamInvitations: true,
    documentUploads: false,
    twoFactorAuth: false,
    sessionTimeout: '30',
    darkMode: false,
    language: 'fr',
    dateFormat: 'dd/mm/yyyy',
    timeZone: 'Europe/Paris',
    theme: 'blue',
    density: 'comfortable'
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'appearance', label: 'Apparence', icon: Palette },
    { id: 'preferences', label: 'Préférences', icon: Globe },
    { id: 'team', label: 'Équipe', icon: Users },
    { id: 'data', label: 'Données & Compte', icon: Download }
  ];

  const toggleSetting = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
    showSaveNotification();
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    showSaveNotification();
  };

  const showSaveNotification = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  const handleChangePassword = () => {
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      alert('⚠️ Veuillez remplir tous les champs');
      return;
    }

    if (passwordData.new.length < 8) {
      alert('⚠️ Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (passwordData.new !== passwordData.confirm) {
      alert('⚠️ Les mots de passe ne correspondent pas');
      return;
    }

    // Simulation API call
    alert('✅ Mot de passe modifié avec succès !');
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  const handleLogout = () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      onLogout();
    }
  };

  const handleExportData = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('success');
      alert('✅ Export de vos données en cours...\n\nVous recevrez un email avec le lien de téléchargement dans quelques minutes.');
    }, 1000);
  };

  const handleDeleteAccount = () => {
    if (confirm('⚠️ ATTENTION ⚠️\n\nÊtes-vous VRAIMENT sûr de vouloir supprimer votre compte ?\n\nCette action est IRRÉVERSIBLE et supprimera :\n- Tous vos projets\n- Toutes vos bibliothèques\n- Tous vos documents\n- Toutes vos données personnelles')) {
      if (confirm('Dernière confirmation : Tapez "SUPPRIMER" pour confirmer')) {
        alert('Pour votre sécurité, veuillez contacter le support à support@metr.fr pour supprimer définitivement votre compte.');
      }
    }
  };

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1e3a8a]"></div>
    </label>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header avec statut de sauvegarde */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#1e3a8a]">Paramètres</h2>
          <p className="text-gray-600 mt-1">Gérez vos préférences et paramètres de compte</p>
        </div>
        
        {/* Save Status Indicator */}
        {saveStatus !== 'idle' && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            saveStatus === 'saving' ? 'bg-blue-50 text-blue-700' :
            saveStatus === 'success' ? 'bg-green-50 text-green-700' :
            'bg-red-50 text-red-700'
          }`}>
            {saveStatus === 'saving' && <Clock className="w-4 h-4 animate-spin" />}
            {saveStatus === 'success' && <CheckCircle className="w-4 h-4" />}
            {saveStatus === 'error' && <XCircle className="w-4 h-4" />}
            <span className="text-sm font-medium">
              {saveStatus === 'saving' && 'Sauvegarde...'}
              {saveStatus === 'success' && 'Modifications enregistrées'}
              {saveStatus === 'error' && 'Erreur de sauvegarde'}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-[#1e3a8a] to-blue-700 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-8">
            
            {/* NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Bell className="w-8 h-8 text-[#1e3a8a]" />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Notifications</h3>
                    <p className="text-gray-600">Gérez vos préférences de notification par email et dans l'application</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Email Notifications */}
                  <div className="border-b pb-6">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Notifications par email
                    </h4>
                    
                    <div className="space-y-4 pl-7">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Notifications générales</p>
                          <p className="text-sm text-gray-500">Recevoir tous les emails importants</p>
                        </div>
                        <ToggleSwitch 
                          checked={settings.emailNotifications}
                          onChange={() => toggleSetting('emailNotifications')}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Mises à jour de projets</p>
                          <p className="text-sm text-gray-500">Modifications, commentaires et changements de statut</p>
                        </div>
                        <ToggleSwitch 
                          checked={settings.projectUpdates}
                          onChange={() => toggleSetting('projectUpdates')}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Modifications de bibliothèques</p>
                          <p className="text-sm text-gray-500">Nouveaux articles et modifications</p>
                        </div>
                        <ToggleSwitch 
                          checked={settings.libraryChanges}
                          onChange={() => toggleSetting('libraryChanges')}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Invitations d'équipe</p>
                          <p className="text-sm text-gray-500">Nouvelles invitations à des projets</p>
                        </div>
                        <ToggleSwitch 
                          checked={settings.teamInvitations}
                          onChange={() => toggleSetting('teamInvitations')}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Uploads de documents</p>
                          <p className="text-sm text-gray-500">Nouveaux plans et documents ajoutés</p>
                        </div>
                        <ToggleSwitch 
                          checked={settings.documentUploads}
                          onChange={() => toggleSetting('documentUploads')}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Reports */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Rapports automatiques
                    </h4>
                    
                    <div className="pl-7">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Rapport hebdomadaire</p>
                          <p className="text-sm text-gray-500">Résumé de votre activité tous les lundis</p>
                        </div>
                        <ToggleSwitch 
                          checked={settings.weeklyReport}
                          onChange={() => toggleSetting('weeklyReport')}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECURITY */}
            {activeTab === 'security' && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-8 h-8 text-[#1e3a8a]" />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Sécurité</h3>
                    <p className="text-gray-600">Protégez votre compte avec un mot de passe fort</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Change Password Section */}
                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Key className="w-5 h-5" />
                      Modifier le mot de passe
                    </h4>

                    <div className="space-y-4">
                      <div>
                        <label className="block font-medium text-gray-900 mb-2">
                          Mot de passe actuel
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword.current ? 'text' : 'password'}
                            value={passwordData.current}
                            onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword({...showPassword, current: !showPassword.current})}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block font-medium text-gray-900 mb-2">
                          Nouveau mot de passe
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword.new ? 'text' : 'password'}
                            value={passwordData.new}
                            onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword({...showPassword, new: !showPassword.new})}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Minimum 8 caractères</p>
                      </div>

                      <div>
                        <label className="block font-medium text-gray-900 mb-2">
                          Confirmer le mot de passe
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword.confirm ? 'text' : 'password'}
                            value={passwordData.confirm}
                            onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword({...showPassword, confirm: !showPassword.confirm})}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <button 
                        onClick={handleChangePassword}
                        className="bg-[#1e3a8a] text-white px-6 py-2.5 rounded-lg hover:bg-[#1e40af] transition-colors font-medium flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Modifier le mot de passe
                      </button>
                    </div>
                  </div>

                  {/* 2FA Section */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <Shield className="w-5 h-5" />
                          Authentification à deux facteurs (2FA)
                        </h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Ajoutez une couche de sécurité supplémentaire avec un code à usage unique
                        </p>
                        {settings.twoFactorAuth && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                            <p className="text-sm text-green-800 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              L'authentification à deux facteurs est activée
                            </p>
                          </div>
                        )}
                      </div>
                      <ToggleSwitch 
                        checked={settings.twoFactorAuth}
                        onChange={() => toggleSetting('twoFactorAuth')}
                      />
                    </div>
                  </div>

                  {/* Session Timeout */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Expiration de session
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Déconnexion automatique après inactivité
                    </p>
                    <select
                      value={settings.sessionTimeout}
                      onChange={(e) => updateSetting('sessionTimeout', e.target.value)}
                      className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] bg-white"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 heure</option>
                      <option value="240">4 heures</option>
                      <option value="never">Jamais</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* APPEARANCE */}
            {activeTab === 'appearance' && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Palette className="w-8 h-8 text-[#1e3a8a]" />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Apparence</h3>
                    <p className="text-gray-600">Personnalisez l'interface selon vos préférences</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Theme */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Thème de couleur</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {['blue', 'purple', 'green'].map(color => (
                        <button
                          key={color}
                          onClick={() => updateSetting('theme', color)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            settings.theme === color
                              ? 'border-[#1e3a8a] bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className={`w-full h-12 rounded ${
                            color === 'blue' ? 'bg-blue-500' :
                            color === 'purple' ? 'bg-purple-500' :
                            'bg-green-500'
                          } mb-2`}></div>
                          <p className="text-sm font-medium capitalize">{color === 'blue' ? 'Bleu' : color === 'purple' ? 'Violet' : 'Vert'}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Density */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Densité d'affichage</h4>
                    <div className="space-y-3">
                      {[
                        { value: 'compact', label: 'Compacte', desc: 'Plus d\'informations à l\'écran' },
                        { value: 'comfortable', label: 'Confortable', desc: 'Équilibre entre espace et contenu' },
                        { value: 'spacious', label: 'Espacée', desc: 'Plus d\'espace entre les éléments' }
                      ].map(option => (
                        <label
                          key={option.value}
                          className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            settings.density === option.value
                              ? 'border-[#1e3a8a] bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="density"
                            value={option.value}
                            checked={settings.density === option.value}
                            onChange={(e) => updateSetting('density', e.target.value)}
                            className="mr-3"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{option.label}</p>
                            <p className="text-sm text-gray-500">{option.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Dark Mode - Désactivé */}
                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 opacity-60">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">Mode sombre</h4>
                        <p className="text-sm text-gray-600">
                          Disponible prochainement 🌙
                        </p>
                      </div>
                      <div className="w-11 h-6 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PREFERENCES */}
            {activeTab === 'preferences' && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="w-8 h-8 text-[#1e3a8a]" />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Préférences</h3>
                    <p className="text-gray-600">Langue, fuseau horaire et formats</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block font-semibold text-gray-900 mb-2">
                      Langue de l'interface
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) => updateSetting('language', e.target.value)}
                      disabled
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] bg-gray-50 cursor-not-allowed"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="de">Deutsch</option>
                    </select>
                    <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      La traduction multilingue sera disponible prochainement
                    </p>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-900 mb-2">
                      Fuseau horaire
                    </label>
                    <select
                      value={settings.timeZone}
                      onChange={(e) => updateSetting('timeZone', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] bg-white"
                    >
                      <option value="Europe/Paris">Paris (GMT+1)</option>
                      <option value="Europe/London">Londres (GMT+0)</option>
                      <option value="America/New_York">New York (GMT-5)</option>
                      <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-900 mb-2">
                      Format de date
                    </label>
                    <select
                      value={settings.dateFormat}
                      onChange={(e) => updateSetting('dateFormat', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] bg-white"
                    >
                      <option value="dd/mm/yyyy">JJ/MM/AAAA (15/12/2025)</option>
                      <option value="mm/dd/yyyy">MM/JJ/AAAA (12/15/2025)</option>
                      <option value="yyyy-mm-dd">AAAA-MM-JJ (2025-12-15)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TEAM */}
            {activeTab === 'team' && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Users className="w-8 h-8 text-[#1e3a8a]" />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Gestion d'équipe</h3>
                    <p className="text-gray-600">Invitez et gérez les membres de votre équipe</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-3">Fonctionnalité Pro</h4>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    La gestion d'équipe est disponible avec un abonnement Pro. Invitez des collaborateurs, gérez les permissions et travaillez ensemble.
                  </p>
                  
                  <div className="bg-white rounded-lg p-6 mb-6 max-w-md mx-auto">
                    <h5 className="font-semibold text-gray-900 mb-3">Fonctionnalités Pro :</h5>
                    <ul className="text-left space-y-2 text-sm text-gray-700">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Jusqu'à 10 membres par équipe
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Gestion des rôles et permissions
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Collaboration en temps réel
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Historique complet des modifications
                      </li>
                    </ul>
                  </div>

                  <button className="bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all font-bold text-lg">
                    Passer à Pro - 29€/mois
                  </button>
                  <p className="text-xs text-gray-500 mt-3">Essai gratuit de 14 jours, sans engagement</p>
                </div>
              </div>
            )}

            {/* DATA */}
            {activeTab === 'data' && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Database className="w-8 h-8 text-[#1e3a8a]" />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Données & Compte</h3>
                    <p className="text-gray-600">Gérez vos données et votre compte</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Export Data */}
                  <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Download className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">Exporter mes données</h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Téléchargez une archive complète de toutes vos données : projets, plans, bibliothèques et documents au format ZIP
                        </p>
                        <button 
                          onClick={handleExportData}
                          className="bg-[#1e3a8a] text-white px-6 py-2.5 rounded-lg hover:bg-[#1e40af] transition-colors font-medium flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Exporter toutes mes données
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Logout */}
                  <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <LogOut className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">Se déconnecter</h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Déconnexion de votre session actuelle. Vous devrez vous reconnecter pour accéder à votre compte.
                        </p>
                        <button 
                          onClick={handleLogout}
                          className="border-2 border-gray-300 bg-white text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Se déconnecter
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Delete Account */}
                  <div className="border-2 border-red-200 rounded-lg p-6 bg-red-50 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Trash2 className="w-6 h-6 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-red-900 mb-2">Supprimer mon compte</h4>
                        <p className="text-sm text-red-700 mb-4">
                          ⚠️ Action irréversible. Cette action supprimera définitivement votre compte et toutes vos données :
                        </p>
                        <ul className="text-sm text-red-700 mb-4 space-y-1 list-disc list-inside">
                          <li>Tous vos projets et plans</li>
                          <li>Toutes vos bibliothèques</li>
                          <li>Tous vos documents</li>
                          <li>Votre historique complet</li>
                        </ul>
                        <button 
                          onClick={handleDeleteAccount}
                          className="bg-red-500 text-white px-6 py-2.5 rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Supprimer définitivement mon compte
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}