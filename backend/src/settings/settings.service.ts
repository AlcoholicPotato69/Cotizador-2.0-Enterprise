import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  private globalSettings = { timezone: 'UTC', currency: 'USD', language: 'en' };

  constructor(private prisma: PrismaService) {}

  async resolveEffectiveSettings(tenantId: string) {
    const tenantSettings = await this.prisma.tenantSettings.findUnique({
      where: { tenantId },
    });
    if (!tenantSettings) {
      return this.globalSettings;
    }
    return {
      ...this.globalSettings,
      timezone: tenantSettings.timezone,
      currency: tenantSettings.currency,
      language: tenantSettings.language,
    };
  }

  async updateSettings(tenantId: string, updates: any) {
    const current = await this.resolveEffectiveSettings(tenantId);
    await this.prisma.settingsHistory.create({
      data: { tenantId, previousState: current, newState: updates },
    });
    return await this.prisma.tenantSettings.upsert({
      where: { tenantId },
      update: updates,
      create: {
        tenantId,
        ...updates,
        timezone: updates.timezone || this.globalSettings.timezone,
        currency: updates.currency || this.globalSettings.currency,
        language: updates.language || this.globalSettings.language,
      },
    });
  }

  async rollbackSettings(tenantId: string, versionId: string) {
    const history = await this.prisma.settingsHistory.findUnique({
      where: { id: versionId },
    });
    if (!history)
      throw new NotFoundException('Versión histórica no encontrada');
    const previousState: any = history.previousState;
    return this.updateSettings(tenantId, {
      timezone: previousState.timezone,
      currency: previousState.currency,
      language: previousState.language,
    });
  }
}
