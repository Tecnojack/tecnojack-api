import { Module } from '@nestjs/common';
import { ADMINISTRATION_REPOSITORY } from './application/ports/administration.repository.port.js';
import { PrismaAdministrationRepository } from './infrastructure/persistence/prisma/repositories/prisma-administration.repository.js';
import { ManageSettingsUseCase } from './application/manage-settings/manage-settings.use-case.js';
import { ManageFeatureFlagsUseCase } from './application/manage-feature-flags/manage-feature-flags.use-case.js';
import { ManageCatalogsUseCase } from './application/manage-catalogs/manage-catalogs.use-case.js';
import { ManageWidgetsUseCase } from './application/manage-widgets/manage-widgets.use-case.js';
import { HealthChecksService } from './application/health-checks/health-checks.service.js';
import { AdminController } from './presentation/http/controllers/admin.controller.js';
import { AdministrationFacade } from './public/administration.facade.js';

@Module({
  controllers: [AdminController],
  providers: [
    {
      provide: ADMINISTRATION_REPOSITORY,
      useClass: PrismaAdministrationRepository,
    },
    ManageSettingsUseCase,
    ManageFeatureFlagsUseCase,
    ManageCatalogsUseCase,
    ManageWidgetsUseCase,
    HealthChecksService,
    AdministrationFacade,
  ],
  exports: [AdministrationFacade, ADMINISTRATION_REPOSITORY],
})
export class AdministrationModule {}
