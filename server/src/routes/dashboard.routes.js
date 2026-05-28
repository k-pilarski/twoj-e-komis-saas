import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get('/me', requireAuth, (req, res) => {
  res.status(200).json({
    message: 'Witaj w prywatnym panelu Twojego komisu!',
    secretData: 'Tutaj będą pojawiać się statystyki sprzedaży aut...',
    userData: req.user 
  });
});

export default router;