import { prisma } from "../lib/prisma.js";

export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { tenant: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found in database.' });
    }

    res.status(200).json({
      message: 'Witaj w prywatnym panelu Twojego komisu!',
      secretData: 'Tutaj będą pojawiać się statystyki sprzedaży aut...',
      userData: {
        userId: user.id,
        tenantId: user.tenant.id,
        status: user.tenant.status,
        expiresAt: user.tenant.expiresAt
      }
    });

  } catch (error) {
    console.error('Error fetching real-time dashboard data:', error);
    res.status(500).json({ error: 'Internal server error while fetching user data.' });
  }
};