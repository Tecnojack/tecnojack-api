import { OrganizationsController } from './organizations.controller.js';
import { Organization } from '../../../domain/entities/organization.entity.js';
import { OrganizationName } from '../../../domain/value-objects/organization-name.value-object.js';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { OrganizationNotFoundException, DuplicateTaxIdException } from '../../../domain/errors/people.errors.js';
import type { CreateOrganizationUseCase } from '../../../application/create-organization/create-organization.use-case.js';
import type { UpdateOrganizationUseCase } from '../../../application/update-organization/update-organization.use-case.js';
import type { ArchiveOrganizationUseCase } from '../../../application/archive-organization/archive-organization.use-case.js';
import type { RestoreOrganizationUseCase } from '../../../application/restore-organization/restore-organization.use-case.js';
import type { GetOrganizationUseCase } from '../../../application/get-organization/get-organization.use-case.js';
import type { ListOrganizationsUseCase } from '../../../application/list-organizations/list-organizations.use-case.js';

describe('OrganizationsController', () => {
  let controller: OrganizationsController;
  let mockCreateUseCase: jest.Mocked<CreateOrganizationUseCase>;
  let mockUpdateUseCase: jest.Mocked<UpdateOrganizationUseCase>;
  let mockArchiveUseCase: jest.Mocked<ArchiveOrganizationUseCase>;
  let mockRestoreUseCase: jest.Mocked<RestoreOrganizationUseCase>;
  let mockGetUseCase: jest.Mocked<GetOrganizationUseCase>;
  let mockListUseCase: jest.Mocked<ListOrganizationsUseCase>;

  const sampleOrg = Organization.create({
    code: 'ORG-000001',
    name: new OrganizationName({ legalName: 'Tecnojack Producciones S.A.S.' }),
  });

  beforeEach(() => {
    mockCreateUseCase = { execute: jest.fn().mockResolvedValue(sampleOrg) } as unknown as jest.Mocked<CreateOrganizationUseCase>;
    mockUpdateUseCase = { execute: jest.fn().mockResolvedValue(sampleOrg) } as unknown as jest.Mocked<UpdateOrganizationUseCase>;
    mockArchiveUseCase = { execute: jest.fn().mockResolvedValue(sampleOrg) } as unknown as jest.Mocked<ArchiveOrganizationUseCase>;
    mockRestoreUseCase = { execute: jest.fn().mockResolvedValue(sampleOrg) } as unknown as jest.Mocked<RestoreOrganizationUseCase>;
    mockGetUseCase = { execute: jest.fn().mockResolvedValue(sampleOrg) } as unknown as jest.Mocked<GetOrganizationUseCase>;
    mockListUseCase = {
      execute: jest.fn().mockResolvedValue({
        data: [sampleOrg],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      }),
    } as unknown as jest.Mocked<ListOrganizationsUseCase>;

    controller = new OrganizationsController(
      mockCreateUseCase,
      mockUpdateUseCase,
      mockArchiveUseCase,
      mockRestoreUseCase,
      mockGetUseCase,
      mockListUseCase,
    );
  });

  it('should return organization DTO on create', async () => {
    const res = await controller.create({ legalName: 'Tecnojack Producciones S.A.S.' });
    expect(res.code).toBe('ORG-000001');
    expect(res.name.legalName).toBe('Tecnojack Producciones S.A.S.');
  });

  it('should map DuplicateTaxIdException to ConflictException', async () => {
    mockCreateUseCase.execute.mockRejectedValue(new DuplicateTaxIdException('901234567', 'CO'));
    await expect(controller.create({ legalName: 'Tecnojack' })).rejects.toThrow(ConflictException);
  });

  it('should map OrganizationNotFoundException to NotFoundException', async () => {
    mockGetUseCase.execute.mockRejectedValue(new OrganizationNotFoundException('ORG-999999'));
    await expect(controller.findOne('ORG-999999')).rejects.toThrow(NotFoundException);
  });
});
