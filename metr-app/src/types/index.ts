// Types pour l'utilisateur
export interface User {
  idUtilisateur: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  dateNaissance?: string;
  genre?: 'M' | 'F' | 'Autre';
  pays?: string;
  langue?: string;
  role: 'Administrateur' | 'Utilisateur' | 'Invite';
  idEntreprise?: number;
}

// Types pour les projets
export interface Project {
  idProjet: number;
  nom: string;
  client: string;
  referenceInterne?: string;
  typologie?: string;
  adresse?: string;
  dateLivraison?: string;
  statut: 'En_attente' | 'En_cours' | 'Termine' | 'Archive';
  idAuteur: number;
  dateCreation: string;
  idEntreprise?: number;
  tags?: Tag[];
}

// Types pour les tags
export interface Tag {
  idTag: number;
  nom: string;
  couleur: 'Vert' | 'Orange' | 'Rouge' | 'Bleu' | 'Jaune';
}

// Types pour les plans
export interface Plan {
  idPlan: number;
  nom: string;
  niveau?: string;
  zone?: string;
  idProjet: number;
  dateUpload?: string;
  progression?: number;
}

// Types pour les fichiers
export interface File {
  idFichier: number;
  nom: string;
  type: string;
  taille: string;
  dateUpload: string;
  idPlan?: number;
}

// Types pour les bibliothèques
export interface Library {
  idBibliotheque: number;
  nom: string;
  portee: 'Personnelle' | 'Projet' | 'Entreprise';
  dateCreation: string;
  articlesCount?: number;
}

// Types pour les articles
export interface Article {
  idArticle: number;
  libelle: string;
  description?: string;
  lot?: string;
  sousCategorie?: string;
  unite: 'm' | 'm^2' | 'm^3' | 'litre' | 'kg' | 'sans_unite';
  prix?: number;
  dateCreation: string;
  isFavorite?: boolean;
}

// Types pour les notifications
export interface Notification {
  id: number;
  date: string;
  titre: string;
  message: string;
  isRead: boolean;
  type: 'projet' | 'bibliotheque' | 'systeme';
}

// Types pour les formulaires
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  prenom: string;
  nom: string;
  telephone: string;
  email: string;
}

export interface ProjectForm {
  nom: string;
  client: string;
  referenceInterne?: string;
  typologie?: string;
  adresse?: string;
  dateLivraison?: string;
}

export interface ProfileForm {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: string;
  genre: string;
  pays: string;
  langue: string;
}