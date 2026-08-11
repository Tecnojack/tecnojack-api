import { Module } from '@nestjs/common';
import { PeopleModule } from '../people/people.module.js';
import { OPPORTUNITY_REPOSITORY } from './application/ports/opportunity.repository.port.js';
import { PrismaOpportunityRepository } from './infrastructure/persistence/prisma/repositories/prisma-opportunity.repository.js';
import { CreateOpportunityUseCase } from './application/create-opportunity/create-opportunity.use-case.js';
import { GetOpportunityUseCase } from './application/get-opportunity/get-opportunity.use-case.js';
import { UpdateOpportunityUseCase } from './application/update-opportunity/update-opportunity.use-case.js';
import { ManageOpportunityStageUseCase } from './application/manage-opportunity-stage/manage-opportunity-stage.use-case.js';
import { ManageQuotationsUseCase } from './application/manage-quotations/manage-quotations.use-case.js';
import { ManageCRMActivitiesUseCase } from './application/manage-crm-activities/manage-crm-activities.use-case.js';
import { ListOpportunitiesUseCase } from './application/list-opportunities/list-opportunities.use-case.js';
import { CRMController } from './presentation/http/controllers/crm.controller.js';
import { CRMFacade } from './public/crm.facade.js';

@Module({
  imports: [PeopleModule],
  controllers: [CRMController],
  providers: [
    {
      provide: OPPORTUNITY_REPOSITORY,
      useClass: PrismaOpportunityRepository,
    },
    CreateOpportunityUseCase,
    GetOpportunityUseCase,
    UpdateOpportunityUseCase,
    ManageOpportunityStageUseCase,
    ManageQuotationsUseCase,
    ManageCRMActivitiesUseCase,
    ListOpportunitiesUseCase,
    CRMFacade,
  ],
  exports: [CRMFacade, OPPORTUNITY_REPOSITORY],
})
export class CRMModule {}
