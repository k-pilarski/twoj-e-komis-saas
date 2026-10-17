// server/src/services/account.service.js
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/~`]/;

export const getAccountDetailsService = async (tenantId) => {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: {
      owner: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          createdAt: true
        }
      }
    }
  });

  if (!tenant || !tenant.owner) {
    throw new Error('ACCOUNT_NOT_FOUND');
  }

  let daysRemaining = null;
  if (tenant.expiresAt) {
    const diffMs = new Date(tenant.expiresAt).getTime() - Date.now();
    daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  }

  return {
    user: {
      id: tenant.owner.id,
      firstName: tenant.owner.firstName,
      lastName: tenant.owner.lastName,
      email: tenant.owner.email,
      role: tenant.owner.role,
      createdAt: tenant.owner.createdAt
    },
    subscription: {
      tenantId: tenant.id,
      dealerName: tenant.name,
      slug: tenant.slug,
      status: tenant.status,
      expiresAt: tenant.expiresAt,
      daysRemaining,
      createdAt: tenant.createdAt
    }
  };
};

export const updateAccountProfileService = async (tenantId, payload) => {
  const firstName = String(payload.firstName || '').trim();
  const lastName = String(payload.lastName || '').trim();
  const email = String(payload.email || '').trim().toLowerCase();
  const dealerName = String(payload.dealerName || '').trim();

  if (firstName.length < 2) {
    throw new Error('VALIDATION:Imię musi zawierać co najmniej 2 znaki.');
  }
  if (lastName.length < 2) {
    throw new Error('VALIDATION:Nazwisko musi zawierać co najmniej 2 znaki.');
  }
  if (!EMAIL_REGEX.test(email)) {
    throw new Error('VALIDATION:Podaj poprawny adres e-mail.');
  }
  if (dealerName.length < 2) {
    throw new Error('VALIDATION:Nazwa komisu musi zawierać co najmniej 2 znaki.');
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: { owner: true }
  });

  if (!tenant || !tenant.owner) {
    throw new Error('ACCOUNT_NOT_FOUND');
  }

  // Jeśli użytkownik zmienia e-mail, sprawdzamy czy nie jest zajęty przez inne konto
  if (email !== tenant.owner.email) {
    const existingEmailUser = await prisma.user.findUnique({
      where: { email }
    });
    if (existingEmailUser && existingEmailUser.id !== tenant.owner.id) {
      throw new Error('EMAIL_TAKEN');
    }
  }

  const [updatedUser, updatedTenant] = await prisma.$transaction([
    prisma.user.update({
      where: { id: tenant.owner.id },
      data: { firstName, lastName, email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true
      }
    }),
    prisma.tenant.update({
      where: { id: tenantId },
      data: { name: dealerName }
    })
  ]);

  return {
    user: updatedUser,
    dealerName: updatedTenant.name
  };
};

export const changeAccountPasswordService = async (tenantId, payload) => {
  const currentPassword = String(payload.currentPassword || '');
  const newPassword = String(payload.newPassword || '');
  const confirmPassword = String(payload.confirmPassword || '');

  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new Error('VALIDATION:Wypełnij wszystkie pola dotyczące hasła.');
  }

  if (newPassword !== confirmPassword) {
    throw new Error('VALIDATION:Nowe hasło oraz jego potwierdzenie nie są identyczne.');
  }

  if (newPassword.length < 8 || !SPECIAL_CHAR_REGEX.test(newPassword)) {
    throw new Error('VALIDATION:Nowe hasło musi mieć minimum 8 znaków oraz zawierać co najmniej jeden znak specjalny.');
  }

  if (currentPassword === newPassword) {
    throw new Error('VALIDATION:Nowe hasło musi różnić się od obecnego hasła.');
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: { owner: true }
  });

  if (!tenant || !tenant.owner) {
    throw new Error('ACCOUNT_NOT_FOUND');
  }

  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, tenant.owner.password);
  if (!isCurrentPasswordValid) {
    throw new Error('INVALID_CURRENT_PASSWORD');
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: tenant.owner.id },
    data: { password: hashedNewPassword }
  });

  return true;
};