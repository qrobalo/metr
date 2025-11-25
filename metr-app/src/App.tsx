import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Projects from './pages/Projects';
import CreateProject from './pages/CreateProject';
import Library from './pages/Library';
import Notifications from './pages/Notifications';
import Help from './pages/Help';
import Settings from './pages/Settings';
import { authAPI, userAPI, projectAPI, libraryAPI } from './services/api';

type Page = 'login' | 'register' | 'dashboard' | 'profile' | 'projects' | 'createProject' | 'library' | 'notifications' | 'help' | 'settings';

interface User {
  idUtilisateur: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [projects, setProjects] = useState([]);
  const [articles, setArticles] = useState([]);

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        setCurrentUser(JSON.parse(user));
        setIsAuthenticated(true);
        setCurrentPage('dashboard');
      } catch (error) {
        console.error('Erreur parsing user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Charger les données
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      if (currentPage === 'projects' || currentPage === 'dashboard') {
        loadProjects();
      }
      if (currentPage === 'library') {
        loadArticles();
      }
    }
  }, [currentPage, isAuthenticated, currentUser]);

  const handleLogin = async (email: string, password: string) => {
    try {
      console.log('🔐 Tentative de connexion:', email);
      
      const response = await authAPI.login(email, password);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setCurrentUser(response.user);
      setIsAuthenticated(true);
      setCurrentPage('dashboard');
      
      console.log('✅ Connexion réussie !');
    } catch (error: any) {
      console.error('❌ Erreur de connexion:', error);
      throw new Error(error.message || 'Impossible de se connecter. Vérifiez que le backend est lancé.');
    }
  };

  const handleRegister = async (data: any) => {
    try {
      console.log('📝 Tentative d\'inscription:', data);
      
      const response = await authAPI.register(data);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setCurrentUser(response.user);
      setIsAuthenticated(true);
      setCurrentPage('dashboard');
      
      console.log('✅ Inscription réussie !');
    } catch (error: any) {
      console.error('❌ Erreur d\'inscription:', error);
      throw new Error(error.message || 'Impossible de créer le compte.');
    }
  };

  const loadProjects = async () => {
    if (!currentUser) return;
    
    try {
      const data = await projectAPI.getProjects(currentUser.idUtilisateur);
      setProjects(data);
      console.log('✅ Projets chargés:', data.length);
    } catch (error) {
      console.error('❌ Erreur chargement projets:', error);
    }
  };

  const handleSaveProfile = async (data: any) => {
    if (!currentUser) return;
    
    try {
      await userAPI.updateUser(currentUser.idUtilisateur, data);
      
      const updatedUser = { ...currentUser, ...data };
      setCurrentUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      alert('Profil mis à jour avec succès');
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleCreateProject = async (data: any) => {
    if (!currentUser) return;
    
    try {
      await projectAPI.createProject({
        ...data,
        idAuteur: currentUser.idUtilisateur
      });
      
      alert('Projet créé avec succès');
      setCurrentPage('projects');
      loadProjects();
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la création');
    }
  };

  const loadArticles = async () => {
    try {
      const data = await libraryAPI.getArticles();
      setArticles(data);
      console.log('✅ Articles chargés:', data.length);
    } catch (error) {
      console.error('❌ Erreur chargement articles:', error);
    }
  };

  const handleCreateArticle = () => {
    alert('Fonctionnalité de création d\'article en développement');
    loadArticles();
  };

  const getCurrentDate = () => {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    const now = new Date();
    return `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  };

  // Auth pages
  if (!isAuthenticated) {
    if (currentPage === 'register') {
      return (
        <Register 
          onRegister={handleRegister}
          onNavigateToLogin={() => setCurrentPage('login')}
        />
      );
    }
    return (
      <Login 
        onLogin={handleLogin}
        onNavigateToRegister={() => setCurrentPage('register')}
      />
    );
  }

  // Main app
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          userName={currentUser?.prenom || ''}
          date={getCurrentDate()}
          notificationCount={1}
          onNotificationClick={() => setCurrentPage('notifications')}
          onProfileClick={() => setCurrentPage('profile')}
        />
        
        <main className="flex-1 overflow-y-auto">
          {currentPage === 'dashboard' && (
            <Dashboard 
              projects={projects}
              onCreateProject={() => setCurrentPage('createProject')}
              onOpenProject={(id) => console.log('Ouvrir projet', id)}
            />
          )}
          
          {currentPage === 'profile' && currentUser && (
            <Profile 
              userData={{
                nom: currentUser.nom,
                prenom: currentUser.prenom,
                email: currentUser.email,
                telephone: '',
                dateNaissance: '',
                genre: '',
                pays: '',
                langue: ''
              }} 
              onSave={handleSaveProfile} 
            />
          )}
          
          {currentPage === 'projects' && (
            <Projects 
              projects={projects}
              onCreateProject={() => setCurrentPage('createProject')}
              onOpenProject={(id) => console.log('Ouvrir projet', id)}
            />
          )}
          
          {currentPage === 'createProject' && (
            <CreateProject 
              onCancel={() => setCurrentPage('projects')}
              onCreate={handleCreateProject}
            />
          )}
          
          {currentPage === 'library' && (
            <Library 
              articles={articles}
              onCreateArticle={handleCreateArticle}
              onImportLibrary={() => alert('Import en développement')}
              onManageLibraries={() => console.log('Manage')}
            />
          )}
          
          {currentPage === 'notifications' && (
            <Notifications onOpenProject={(id) => console.log('Open', id)} />
          )}
          
          {currentPage === 'help' && <Help />}
          
          {currentPage === 'settings' && <Settings />}
        </main>
      </div>
    </div>
  );
}

export default App;