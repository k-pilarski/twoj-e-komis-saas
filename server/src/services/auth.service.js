// server/src/services/auth.service.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';

const SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/;

export const registerUserService = async (data) => {
  const { password, firstName, lastName, tenantName, tenantSlug, expiresAt } = data;
  const email = String(data.email || '').trim().toLowerCase();

  if (!password || password.length < 8 || !SPECIAL_CHAR_REGEX.test(password)) {
    throw new Error('WEAK_PASSWORD');
  }

  if (!tenantSlug || !/^[a-z0-9-]+$/.test(tenantSlug)) {
    throw new Error('INVALID_SLUG');
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error('EMAIL_EXISTS');

  const existingTenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
  if (existingTenant) throw new Error('SLUG_EXISTS');

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      tenant: {
        create: {
          name: tenantName?.trim(),
          slug: tenantSlug,
          expiresAt,
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

export const loginUserService = async (rawEmail, password) => {
  const email = String(rawEmail || '').trim().toLowerCase();

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