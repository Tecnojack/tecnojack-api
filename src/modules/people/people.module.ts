import { Module } from '@nestjs/common';
import { PrismaModule } from '../../platform/database/prisma/prisma.module.js';

// Repositories & Ports
import { PERSON_REPOSITORY } from './application/create-person/create-person.use-case.js';
import { ORGANIZATION_REPOSITORY } from './application/create-organization/create-organization.use-case.js';
import { PrismaPersonRepository } from './infrastructure/persistence/prisma/repositories/prisma-person.repository.js';
import { PrismaOrganizationRepository } from './infrastructure/persistence/prisma/repositories/prisma-organization.repository.js';

// Use Cases - Person
import { CreatePersonUseCase } from './application/create-person/create-person.use-case.js';
import { UpdatePersonUseCase } from './application/update-person/update-person.use-case.js';
import { ArchivePersonUseCase } from './application/archive-person/archive-person.use-case.js';
import { RestorePersonUseCase } from './application/restore-person/restore-person.use-case.js';
import { GetPersonUseCase } from './application/get-person/get-person.use-case.js';
import { ListPersonsUseCase } from './application/list-persons/list-persons.use-case.js';

// Use Cases - Organization
import { CreateOrganizationUseCase } from './application/create-organization/create-organization.use-case.js';
import { UpdateOrganizationUseCase } from './application/update-organization/update-organization.use-case.js';
import { ArchiveOrganizationUseCase } from './application/archive-organization/archive-organization.use-case.js';
import { RestoreOrganizationUseCase } from './application/restore-organization/restore-organization.use-case.js';
import { GetOrganizationUseCase } from './application/get-organization/get-organization.use-case.js';
import { ListOrganizationsUseCase } from './application/list-organizations/list-organizations.use-case.js';

// Controllers
import { PersonsController } from './presentation/http/controllers/persons.controller.js';
import { OrganizationsController } from './presentation/http/controllers/organizations.controller.js';

// Public Facade
import { PeopleFacade } from './public/people.facade.js';

@Module({
  imports: [PrismaModule],
  controllers: [PersonsController, OrganizationsController],
  providers: [
    {
      provide: PERSON_REPOSITORY,
      useClass: PrismaPersonRepository,
    },
    {
      provide: ORGANIZATION_REPOSITORY,
      useClass: PrismaOrganizationRepository,
    },
    // Person Use Cases
    CreatePersonUseCase,
    UpdatePersonUseCase,
    ArchivePersonUseCase,
    RestorePersonUseCase,
    GetPersonUseCase,
    ListPersonsUseCase,
    // Organization Use Cases
    CreateOrganizationUseCase,
    UpdateOrganizationUseCase,
    ArchiveOrganizationUseCase,
    RestoreOrganizationUseCase,
    GetOrganizationUseCase,
    ListOrganizationsUseCase,
    // Public Surface
    PeopleFacade,
  ],
  exports: [PeopleFacade],
})
export class PeopleModule {}
