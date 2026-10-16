import { prisma } from "../lib/prisma.js";

export const getSettingsService = async (tenantId) => {
  const settings = await prisma.settings.findUnique({
    where: { tenantId }
  });

  if (!settings) {
    throw new Error('NOT_FOUND');
  }

  return settings;
};

export const updateSettingsService = async (tenantId, settingsData) => {
  // Sprawdzamy czy ustawienia istnieją dla danego tenanta
  const existingSettings = await prisma.settings.findUnique({
    where: { tenantId }
  });

  if (!existingSettings) {
    throw new Error('NOT_FOUND');
  }

  return await prisma.settings.update({
    where: { tenantId },
    data: {
      primaryColor: settingsData.primaryColor,
      layoutType: settingsData.layoutType,
      fontStyle: settingsData.fontStyle,
      hasContactPage: Boolean(settingsData.hasContactPage),
      hasRegulationsPage: Boolean(settingsData.hasRegulationsPage),
      phoneNumber: settingsData.phoneNumber ? String(settingsData.phoneNumber).trim() : null,
      address: settingsData.address ? String(settingsData.address).trim() : null,
    }
  });
};