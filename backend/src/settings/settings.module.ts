import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { UsersController } from './users.controller';

@Module({
  controllers: [SettingsController, UsersController],
  providers: [SettingsService],
})
export class SettingsModule {}
