import { PersonsController } from './persons.controller.js';
import { Person } from '../../../domain/entities/person.entity.js';
import { PersonName } from '../../../domain/value-objects/person-name.value-object.js';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { PersonNotFoundException, DuplicateDocumentException } from '../../../domain/errors/people.errors.js';
import type { CreatePersonUseCase } from '../../../application/create-person/create-person.use-case.js';
import type { UpdatePersonUseCase } from '../../../application/update-person/update-person.use-case.js';
import type { ArchivePersonUseCase } from '../../../application/archive-person/archive-person.use-case.js';
import type { RestorePersonUseCase } from '../../../application/restore-person/restore-person.use-case.js';
import type { GetPersonUseCase } from '../../../application/get-person/get-person.use-case.js';
import type { ListPersonsUseCase } from '../../../application/list-persons/list-persons.use-case.js';

describe('PersonsController', () => {
  let controller: PersonsController;
  let mockCreateUseCase: jest.Mocked<CreatePersonUseCase>;
  let mockUpdateUseCase: jest.Mocked<UpdatePersonUseCase>;
  let mockArchiveUseCase: jest.Mocked<ArchivePersonUseCase>;
  let mockRestoreUseCase: jest.Mocked<RestorePersonUseCase>;
  let mockGetUseCase: jest.Mocked<GetPersonUseCase>;
  let mockListUseCase: jest.Mocked<ListPersonsUseCase>;

  const samplePerson = Person.create({
    code: 'PER-000001',
    name: new PersonName({ givenNames: 'Gabriel', familyNames: 'García' }),
  });

  beforeEach(() => {
    mockCreateUseCase = { execute: jest.fn().mockResolvedValue(samplePerson) } as unknown as jest.Mocked<CreatePersonUseCase>;
    mockUpdateUseCase = { execute: jest.fn().mockResolvedValue(samplePerson) } as unknown as jest.Mocked<UpdatePersonUseCase>;
    mockArchiveUseCase = { execute: jest.fn().mockResolvedValue(samplePerson) } as unknown as jest.Mocked<ArchivePersonUseCase>;
    mockRestoreUseCase = { execute: jest.fn().mockResolvedValue(samplePerson) } as unknown as jest.Mocked<RestorePersonUseCase>;
    mockGetUseCase = { execute: jest.fn().mockResolvedValue(samplePerson) } as unknown as jest.Mocked<GetPersonUseCase>;
    mockListUseCase = {
      execute: jest.fn().mockResolvedValue({
        data: [samplePerson],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      }),
    } as unknown as jest.Mocked<ListPersonsUseCase>;

    controller = new PersonsController(
      mockCreateUseCase,
      mockUpdateUseCase,
      mockArchiveUseCase,
      mockRestoreUseCase,
      mockGetUseCase,
      mockListUseCase,
    );
  });

  it('should return person DTO on create', async () => {
    const res = await controller.create({ givenNames: 'Gabriel' });
    expect(res.code).toBe('PER-000001');
    expect(res.name.givenNames).toBe('Gabriel');
  });

  it('should map DuplicateDocumentException to ConflictException', async () => {
    mockCreateUseCase.execute.mockRejectedValue(new DuplicateDocumentException('12345678', 'CO'));
    await expect(controller.create({ givenNames: 'Gabriel' })).rejects.toThrow(ConflictException);
  });

  it('should map PersonNotFoundException to NotFoundException', async () => {
    mockGetUseCase.execute.mockRejectedValue(new PersonNotFoundException('PER-999999'));
    await expect(controller.findOne('PER-999999')).rejects.toThrow(NotFoundException);
  });

  it('should list persons with pagination format', async () => {
    const res = await controller.findAll({ page: 1, limit: 20 });
    expect(res.data).toHaveLength(1);
    expect(res.meta.total).toBe(1);
  });
});
