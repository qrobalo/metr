// src/routes/auth.routes.ts
import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const SALT_ROUNDS = 10;

// ============================
// INSCRIPTION
// ============================
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { nom, prenom, email, telephone, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    const [existing]: any = await pool.execute(
      "SELECT idUtilisateur FROM Utilisateurs WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const [result]: any = await pool.execute(
      "INSERT INTO Utilisateurs (nom, prenom, email, password, telephone, role) VALUES (?, ?, ?, ?, ?, ?)",
      [nom || "", prenom || "", email, hashedPassword, telephone || null, "Utilisateur"]
    );

    const userId = result.insertId;

    const token = jwt.sign(
      { idUtilisateur: userId, email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      token,
      user: {
        idUtilisateur: userId,
        nom,
        prenom,
        email,
        role: "Utilisateur",
      },
    });
  } catch (error) {
    console.error("Erreur inscription :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

// ============================
// CONNEXION
// ============================
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    const [rows]: any = await pool.execute(
      "SELECT idUtilisateur, nom, prenom, email, role, password FROM Utilisateurs WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    const user = rows[0];

    const isValid = await bcrypt.compare(password, user.password || "");

    if (!isValid) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    const token = jwt.sign(
      { idUtilisateur: user.idUtilisateur, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userSafe = {
      idUtilisateur: user.idUtilisateur,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
    };

    return res.json({ token, user: userSafe });
  } catch (error) {
    console.error("Erreur connexion :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
