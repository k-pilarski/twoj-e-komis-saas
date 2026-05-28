import jwt from 'jsonwebtoken';

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