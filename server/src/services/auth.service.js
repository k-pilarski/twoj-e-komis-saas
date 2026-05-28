import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export const registerUserService = async (data) => {
  const { email, password, firstName, lastName, tenantName, tenantSlug } = data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error('EMAIL_EXISTS');

  const existingTenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
  if (existingTenant) throw new Error('SLUG_EXISTS');

  const hashedPassword = await bcrypt.hash(password, 10);

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
          settings: { create: {} }
        }
      }
    },
    include: { tenant: true }
  });

  const token = jwt.sign(
    { userId: newUser.id, tenantId: newUser.tenant.id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { user: newUser, token };
};

export const loginUserService = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { tenant: true }
  });
  if (!user) throw new Error('INVALID_CREDENTIALS');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error('INVALID_CREDENTIALS');

  const token = jwt.sign(
    { userId: user.id, tenantId: user.tenant.id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { user, token };
};