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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { tenant: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'Nieprawidłowy adres email lub hasło.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Nieprawidłowy adres email lub hasło.' });
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        tenantId: user.tenant.id 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } 
    );

    res.status(200).json({
      message: 'Zalogowano pomyślnie!',
      token,
      user: {
        id: user.id,
        email: user.email,
        tenantSlug: user.tenant.slug
      }
    });
  } catch (error) {
    console.error('Błąd podczas logowania:', error);
    res.status(500).json({ error: 'Wystąpił wewnętrzny błąd serwera podczas logowania.'});
  }
}