import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Projects from './pages/Projects';
import CreateProject from './pages/CreateProject';
import ProjectDetail from './pages/ProjectDetail';
import Library from './pages/Library';
import Notifications from './pages/Notifications';
import Help from './pages/Help';
import Settings from './pages/Settings';
import PaymentPage from './pages/PaymentPage';
import { authAPI, userAPI, projectAPI, libraryAPI } from './services/api';

type Page = 'login' | 'register' | 'forgotPassword' | 'dashboard' | 'profile' | 'projects' | 'createProject' | 'projectDetail' | 'library' | 'notifications' | 'help' | 'settings' | 'payment';

interface User {
  idUtilisateur: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  telephone?: string;
  dateNaissance?: string;
  genre?: string;
  pays?: string;
  langue?: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [projects, setProjects] = useState([]);
  const [articles, setArticles] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Vérification de l'authentification au chargement
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        try {
          const parsedUser = JSON.parse(user);
          setCurrentUser(parsedUser);
          setIsAuthenticated(true);
          setCurrentPage('dashboard');
          
          // Charger immédiatement les données
          await loadProjects(parsedUser.idUtilisateur);
        } catch (error) {
          console.error('❌ Erreur parsing user:', error);
          handleLogout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Recharger les projets quand on change de page
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      if (currentPage === 'projects' || currentPage === 'dashboard') {
        loadProjects(currentUser.idUtilisateur);
      }
      if (currentPage === 'library') {
        loadArticles();
      }
    }
  }, [currentPage, isAuthenticated, currentUser]);

  const loadProjects = async (userId?: number) => {
    const id = userId || currentUser?.idUtilisateur;
    if (!id) return;
    
    try {
      console.log('🔄 Chargement des projets...');
      const data = await projectAPI.getProjects(id);
      
      // S'assurer que plansCount est défini
      const enrichedProjects = data.map((project: any) => ({
        ...project,
        plansCount: project.plansCount || 0
      }));
      
      setProjects(enrichedProjects);
      console.log(`✅ ${enrichedProjects.length} projets chargés`);
    } catch (error) {
      console.error('❌ Erreur chargement projets:', error);
      // Ne pas afficher d'erreur si c'est juste une erreur réseau
    }
  };

  const loadArticles = async () => {
    try {
      console.log('🔄 Chargement des articles...');
      const data = await libraryAPI.getArticles();
      setArticles(data);
      console.log(`✅ ${data.length} articles chargés`);
    } catch (error) {
      console.error('❌ Erreur chargement articles:', error);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    console.log('🔐 Tentative de connexion:', email);
    
    const response = await authAPI.login(email, password);
    
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    setCurrentUser(response.user);
    setIsAuthenticated(true);
    
    // Charger les projets immédiatement
    await loadProjects(response.user.idUtilisateur);
    
    setCurrentPage('dashboard');
    console.log('✅ Connexion réussie !');
  };

  const handleRegister = async (data: any) => {
    console.log('📝 Tentative d\'inscription:', data.email);
    
    const response = await authAPI.register(data);
    
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    setCurrentUser(response.user);
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
    
    console.log('✅ Inscription réussie !');
  };

  const handleForgotPassword = async (email: string) => {
    try {
      console.log('🔑 Demande de réinitialisation pour:', email);
      
      // Appel API pour envoyer l'email de réinitialisation
      // await authAPI.forgotPassword(email);
      
      // Simulation d'un délai
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('✅ Email de réinitialisation envoyé');
    } catch (error: any) {
      console.error('❌ Erreur réinitialisation:', error);
      throw new Error(error.message || 'Erreur lors de l\'envoi de l\'email');
    }
  };

  const handleLogout = () => {
    console.log('👋 Déconnexion...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCurrentPage('login');
    setProjects([]);
    setArticles([]);
    console.log('✅ Déconnexion réussie');
  };

  const handleSaveProfile = async (data: any) => {
    if (!currentUser) return;
    
    try {
      await userAPI.updateUser(currentUser.idUtilisateur, data);
      
      const updatedUser = { ...currentUser, ...data };
      setCurrentUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      alert('✅ Profil mis à jour avec succès');
    } catch (error: any) {
      alert('❌ ' + (error.message || 'Erreur lors de la mise à jour'));
      throw error;
    }
  };

  const handleCreateProject = async (data: any) => {
    if (!currentUser) return;
    
    try {
      console.log('📝 Création du projet:', data.nom);
      
      // Ajouter le statut par défaut si non défini
      const projectData = {
        ...data,
        idAuteur: currentUser.idUtilisateur,
        statut: data.statut || 'En_attente' // Statut par défaut
      };
      
      const response = await projectAPI.createProject(projectData);
      
      console.log('✅ Projet créé avec ID:', response.idProjet);
      
      // Recharger IMMÉDIATEMENT les projets
      await loadProjects(currentUser.idUtilisateur);
      
      alert(`✅ Projet "${data.nom}" créé avec succès !`);
      
      // Rediriger vers la page projets
      setCurrentPage('projects');
    } catch (error: any) {
      console.error('❌ Erreur création projet:', error);
      alert('❌ ' + (error.message || 'Erreur lors de la création'));
      throw error;
    }
  };

  const handleOpenProject = (id: number) => {
    setSelectedProjectId(id);
    setCurrentPage('projectDetail');
  };

  const handleProjectsChange = async () => {
    // Callback pour recharger les projets après modification
    if (currentUser) {
      await loadProjects(currentUser.idUtilisateur);
    }
  };

  const handleCreateArticle = async (articleData: any) => {
    try {
      console.log('📝 Création article:', articleData.libelle);
      await libraryAPI.createArticle(articleData);
      await loadArticles();
      alert(`✅ Article "${articleData.libelle}" créé avec succès`);
    } catch (error: any) {
      console.error('❌ Erreur création article:', error);
      alert('❌ Erreur lors de la création de l\'article');
      throw error;
    }
  };

  const handlePaymentSuccess = () => {
    alert('🎉 Bienvenue dans Metr Pro !\n\nToutes les fonctionnalités Pro sont maintenant disponibles.');
    setCurrentPage('settings');
  };

  const getCurrentDate = () => {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    const now = new Date();
    return `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  };

  // Affichage du loader pendant la vérification de l'auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#1e3a8a] to-blue-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Chargement de Metr...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (currentPage === 'register') {
      return (
        <Register 
          onRegister={handleRegister}
          onNavigateToLogin={() => setCurrentPage('login')}
        />
      );
    }
    
    if (currentPage === 'forgotPassword') {
      return (
        <ForgotPassword
          onBack={() => setCurrentPage('login')}
          onResetPassword={handleForgotPassword}
        />
      );
    }
    
    return (
      <Login 
        onLogin={handleLogin}
        onNavigateToRegister={() => setCurrentPage('register')}
        onForgotPassword={() => setCurrentPage('forgotPassword')}
      />
    );
  }

  // Page de paiement (affichage plein écran sans sidebar/header)
  if (currentPage === 'payment') {
    return (
      <PaymentPage
        onBack={() => setCurrentPage('settings')}
        onPaymentSuccess={handlePaymentSuccess}
      />
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          userName={currentUser?.prenom || ''}
          date={getCurrentDate()}
          notificationCount={unreadNotifications}
          onNotificationClick={() => setCurrentPage('notifications')}
          onProfileClick={() => setCurrentPage('profile')}
        />
        
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {currentPage === 'dashboard' && (
            <Dashboard 
              projects={projects}
              onCreateProject={() => setCurrentPage('createProject')}
              onOpenProject={handleOpenProject}
              onProjectsChange={handleProjectsChange}
            />
          )}
          
          {currentPage === 'profile' && currentUser && (
            <Profile 
              userData={{
                nom: currentUser.nom,
                prenom: currentUser.prenom,
                email: currentUser.email,
                telephone: currentUser.telephone || '',
                dateNaissance: currentUser.dateNaissance || '',
                genre: currentUser.genre || '',
                pays: currentUser.pays || '',
                langue: currentUser.langue || ''
              }} 
              onSave={handleSaveProfile}
              onLogout={handleLogout}
            />
          )}
          
          {currentPage === 'projects' && (
            <Projects 
              projects={projects}
              onCreateProject={() => setCurrentPage('createProject')}
              onOpenProject={handleOpenProject}
              onProjectsChange={handleProjectsChange}
            />
          )}
          
          {currentPage === 'createProject' && (
            <CreateProject 
              onCancel={() => setCurrentPage('projects')}
              onCreate={handleCreateProject}
            />
          )}
          
          {currentPage === 'projectDetail' && selectedProjectId && (
            <ProjectDetail 
              projectId={selectedProjectId}
              onBack={() => {
                setCurrentPage('projects');
                handleProjectsChange(); // Recharger au retour
              }}
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
            <Notifications 
              onOpenProject={handleOpenProject}
              onNotificationRead={() => setUnreadNotifications(0)}
            />
          )}
          
          {currentPage === 'help' && <Help />}
          
          {currentPage === 'settings' && (
            <Settings 
              onLogout={handleLogout}
              onNavigateToPayment={() => setCurrentPage('payment')}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;