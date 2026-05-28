import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL }); // instancja adaptera

const prisma = new PrismaClient({ adapter }); // inicjalizacja pisrmy

export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, tenantName, tenantSlug } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Użytkownik z tym adresem email już istnieje.' });
    }

    const existingTenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug }
    });

    if (existingTenant) {
      return res.status(400).json({ error: 'Ten adres URL komisu jest już zajęty.' });
    }

    // Szyfrowanie hasła
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        tenant: {
          create: {
            name: tenantName,
            slug: tenantSlug,
            settings: {
              create: {}
            }
          }
        }
      },
      include: {
        tenant: true 
      }
    });

    // Token JWT
    const token = jwt.sign(
      { 
        userId: newUser.id, 
        tenantId: newUser.tenant.id 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } 
    );

    res.status(201).json({
      message: 'Konto zostało pomyślnie utworzone!',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        tenantSlug: newUser.tenant.slug
      }
    });

  } catch (error) {
    console.error('Błąd podczas rejestracji:', error);
    res.status(500).json({ error: 'Wystąpił wewnętrzny błąd serwera podczas rejestracji.' });
  }
};