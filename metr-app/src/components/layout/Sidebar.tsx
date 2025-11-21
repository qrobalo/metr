import React, { useState } from 'react';
import { LayoutGrid, FolderOpen, BookOpen, HelpCircle, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutGrid },
    { id: 'projects', label: 'Projets', icon: FolderOpen },
    { id: 'library', label: 'Bibliothèque', icon: BookOpen },
    { id: 'help', label: 'Aide', icon: HelpCircle },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <div 
      className={`bg-primary-900 h-screen flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <div className="text-white">
            <span className="text-3xl font-bold">Metr</span>
            <span className="text-3xl font-bold text-secondary-500">.</span>
          </div>
        )}
        {isCollapsed && (
          <div className="text-white text-2xl font-bold mx-auto">
            M<span className="text-secondary-500">.</span>
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute left-56 top-6 bg-white rounded-full p-1 shadow-lg hover:bg-gray-100 transition-colors z-10"
        style={{ left: isCollapsed ? '60px' : '224px' }}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        )}
      </button>

      {/* Menu Items */}
      <nav className="flex-1 px-3 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-all ${
                isActive
                  ? 'bg-primary-800 text-white'
                  : 'text-gray-300 hover:bg-primary-800 hover:text-white'
              }`}
              title={isCollapsed ? item.label : ''}
            >
              <Icon className="sidebar-icon flex-shrink-0" />
              {!isCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}