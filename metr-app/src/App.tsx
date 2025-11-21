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
import { authAPI, userAPI, projectAPI, libraryAPI, notificationAPI } from './services/api';

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
  const [loading, setLoading] = useState(false);

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(user));
      setCurrentPage('dashboard');
    }
  }, []);

  // Charger les données quand l'utilisateur change de page
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

  // Handlers
  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authAPI.login(email, password);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setCurrentUser(response.user);
      setIsAuthenticated(true);
      setCurrentPage('dashboard');
    } catch (error: any) {
      alert(error.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: any) => {
    try {
      setLoading(true);
      const response = await authAPI.register(data);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setCurrentUser(response.user);
      setIsAuthenticated(true);
      setCurrentPage('dashboard');
    } catch (error: any) {
      alert(error.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
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

  const loadProjects = async () => {
    if (!currentUser) return;
    
    try {
      const data = await projectAPI.getProjects(currentUser.idUtilisateur);
      setProjects(data);
    } catch (error) {
      console.error('Erreur chargement projets:', error);
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

  const handleOpenProject = (id: number) => {
    console.log('Ouvrir projet:', id);
  };

  const loadArticles = async () => {
    try {
      const data = await libraryAPI.getArticles();
      setArticles(data);
    } catch (error) {
      console.error('Erreur chargement articles:', error);
    }
  };

  const handleCreateArticle = async (data: any) => {
    try {
      await libraryAPI.createArticle(data);
      alert('Article créé avec succès');
      loadArticles();
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la création');
    }
  };

  const handleImportLibrary = () => {
    console.log('Import library');
  };

  const handleManageLibraries = () => {
    console.log('Manage libraries');
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
    <div className="flex h-screen overflow-hidden">
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          userName={currentUser?.prenom || ''}
          date={getCurrentDate()}
          notificationCount={1}
          onNotificationClick={() => setCurrentPage('notifications')}
          onProfileClick={() => setCurrentPage('profile')}
        />
        
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {currentPage === 'dashboard' && (
            <Dashboard 
              projects={projects}
              onCreateProject={() => setCurrentPage('createProject')}
              onOpenProject={handleOpenProject}
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
              onOpenProject={handleOpenProject}
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
              onImportLibrary={handleImportLibrary}
              onManageLibraries={handleManageLibraries}
            />
          )}
          
          {currentPage === 'notifications' && (
            <Notifications onOpenProject={handleOpenProject} />
          )}
          
          {currentPage === 'help' && (
            <div className="p-8">
              <h2 className="text-3xl font-bold text-primary-900">Aide</h2>
              <p className="text-gray-600 mt-4">Page d'aide en construction...</p>
            </div>
          )}
          
          {currentPage === 'settings' && (
            <div className="p-8">
              <h2 className="text-3xl font-bold text-primary-900">Paramètres</h2>
              <p className="text-gray-600 mt-4">Page de paramètres en construction...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;