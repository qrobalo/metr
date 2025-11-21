import { Router, Request, Response } from 'express';
import pool from '../config/database';

const router = Router();

// GET /api/users/:id - Récupérer un utilisateur
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [users]: any = await pool.query(
      'SELECT idUtilisateur, nom, prenom, email, role FROM Utilisateurs WHERE idUtilisateur = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Erreur récupération utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// PUT /api/users/:id - Mettre à jour un utilisateur
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nom, prenom, email, telephone, dateNaissance, genre, pays, langue } = req.body;

    await pool.query(
      'UPDATE Utilisateurs SET nom = ?, prenom = ?, email = ? WHERE idUtilisateur = ?',
      [nom, prenom, email, id]
    );

    res.json({ message: 'Profil mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur mise à jour utilisateur:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour' });
  }
});

export default router;