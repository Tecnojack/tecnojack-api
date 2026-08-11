import { CreateOrganizationUseCase } from './create-organization.use-case.js';
import { type OrganizationRepositoryPort } from '../ports/organization.repository.port.js';
import type { Organization } from '../../domain/entities/organization.entity.js';
import { DuplicateTaxIdException } from '../../domain/errors/people.errors.js';

describe('CreateOrganizationUseCase', () => {
  let useCase: CreateOrganizationUseCase;
  let mockRepo: jest.Mocked<OrganizationRepositoryPort>;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn().mockImplementation((org: Organization) => Promise.resolve(org)),
      findById: jest.fn(),
      findByCode: jest.fn(),
      findByTaxId: jest.fn(),
      findAll: jest.fn(),
      nextCode: jest.fn().mockResolvedValue('ORG-000001'),
    };
    useCase = new CreateOrganizationUseCase(mockRepo);
  });

  it('should create an organization successfully', async () => {
    const result = await useCase.execute({
      legalName: 'Tecnojack Producciones S.A.S.',
      tradeName: 'TECNOJACK',
      taxIdIssuingCountry: 'CO',
      taxIdNumber: '901234567',
    });

    expect(result.code).toBe('ORG-000001');
    expect(result.name.legalName).toBe('Tecnojack Producciones S.A.S.');
    expect(mockRepo.save.mock.calls.length).toBe(1);
  });

  it('should throw DuplicateTaxIdException if tax ID exists', async () => {
    mockRepo.findByTaxId.mockResolvedValue({} as Organization);

    await expect(
      useCase.execute({
        legalName: 'Tecnojack Producciones S.A.S.',
        taxIdIssuingCountry: 'CO',
        taxIdNumber: '901234567',
      }),
    ).rejects.toThrow(DuplicateTaxIdException);
  });
});
