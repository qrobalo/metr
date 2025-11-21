import { Router, Request, Response } from 'express';
import pool from '../config/database';

const router = Router();

// Pour l'instant, nous allons créer une table temporaire pour les notifications
// Vous pourrez l'ajouter à votre schéma SQL plus tard

// GET /api/notifications - Récupérer toutes les notifications
router.get('/', async (req: Request, res: Response) => {
  try {
    // Pour l'instant, renvoyer des notifications statiques
    // À remplacer par une vraie requête SQL quand la table sera créée
    const notifications = [
      {
        id: 1,
        date: '04/11/2025',
        titre: 'Vous avez été ajouté à un projet',
        message: '',
        isRead: true,
        type: 'projet'
      },
      {
        id: 2,
        date: '02/11/2025',
        titre: 'Vous avez été ajouté à une bibliothèque',
        message: '',
        isRead: true,
        type: 'bibliotheque'
      }
    ];

    res.json(notifications);
  } catch (error) {
    console.error('Erreur récupération notifications:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;