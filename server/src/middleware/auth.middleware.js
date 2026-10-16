// server/src/middleware/auth.middleware.js
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Brak autoryzacji. Token nie został dostarczony.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userId: decoded.userId,
      tenantId: decoded.tenantId
    };

    next();
  } catch (error) {
    console.error('Błąd autoryzacji middleware:', error);
    return res.status(401).json({ error: 'Sesja wygasła lub token jest nieprawidłowy.' });
  }
};

// NOWY MIDDLEWARE: Blokuje operacje biznesowe (np. dodawanie aut) dla nieaktywnych komisów
export const requireActiveTenant = async (req, res, next) => {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id: req.user.tenantId },
      select: { status: true, expiresAt: true }
    });

    if (!tenant) {
      return res.status(404).json({ error: 'Nie znaleziono przypisanego komisu.' });
    }

    const isExpiredByDate = tenant.expiresAt && new Date() > new Date(tenant.expiresAt);

    if (tenant.status !== 'ACTIVE' || isExpiredByDate) {
      return res.status(403).json({
        error: 'Twoje konto oczekuje na aktywację lub wygasło. Opłać subskrypcję, aby zarządzać inwentarzem.'
      });
    }

    next();
  } catch (error) {
    console.error('Błąd weryfikacji statusu komisu:', error);
    return res.status(500).json({ error: 'Błąd weryfikacji uprawnień konta.' });
  }
};