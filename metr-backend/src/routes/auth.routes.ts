import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database';

const router = Router();

// POST /api/auth/register - Inscription
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { nom, prenom, email, telephone } = req.body;

    // Vérifier si l'email existe déjà
    const [existingUsers]: any = await pool.query(
      'SELECT * FROM Utilisateurs WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Créer l'utilisateur
    const [result]: any = await pool.query(
      'INSERT INTO Utilisateurs (nom, prenom, email, role) VALUES (?, ?, ?, ?)',
      [nom, prenom, email, 'Utilisateur']
    );

    // Générer un token JWT
    const token = jwt.sign(
      { idUtilisateur: result.insertId, email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Inscription réussie',
      token,
      user: {
        idUtilisateur: result.insertId,
        nom,
        prenom,
        email,
        role: 'Utilisateur'
      }
    });
  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ message: 'Erreur lors de l\'inscription' });
  }
});

// POST /api/auth/login - Connexion
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Rechercher l'utilisateur
    const [users]: any = await pool.query(
      'SELECT * FROM Utilisateurs WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const user = users[0];

    // Générer un token JWT
    const token = jwt.sign(
      { idUtilisateur: user.idUtilisateur, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        idUtilisateur: user.idUtilisateur,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
});

export default router;