// server/src/services/public.service.js
import { prisma } from "../lib/prisma.js";

export const getPublicStorefrontService = async (rawSlug) => {
  const slug = String(rawSlug || '').trim().toLowerCase();

  if (!slug) {
    throw new Error('STOREFRONT_NOT_FOUND');
  }

  const tenant = await prisma.tenant.findUnique({
    where: { slug },
    include: {
      settings: true,
      vehicles: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!tenant) {
    throw new Error('STOREFRONT_NOT_FOUND');
  }

  // Weryfikacja licencji - nieopłacony lub wygasły komis nie wyświetla strony publicznej
  const isExpiredByDate = tenant.expiresAt && new Date() > new Date(tenant.expiresAt);
  if (tenant.status !== 'ACTIVE' || isExpiredByDate) {
    throw new Error('STOREFRONT_INACTIVE');
  }

  // Odfiltrowanie wewnętrznych danych technicznych przed wysłaniem do klienta końcowego
  const publicVehicles = tenant.vehicles.map(({ tenantId, updatedAt, ...publicVehicleData }) => publicVehicleData);

  return {
    dealerName: tenant.name,
    slug: tenant.slug,
    settings: {
      primaryColor: tenant.settings?.primaryColor || '#2563eb',
      layoutType: tenant.settings?.layoutType || 'GRID',
      fontStyle: tenant.settings?.fontStyle || 'SANS',
      hasContactPage: tenant.settings?.hasContactPage ?? true,
      hasRegulationsPage: tenant.settings?.hasRegulationsPage ?? false,
      phoneNumber: tenant.settings?.phoneNumber || null,
      address: tenant.settings?.address || null
    },
    vehicles: publicVehicles
  };
};