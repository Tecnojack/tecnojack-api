import { CreatePersonUseCase } from './create-person.use-case.js';
import { type PersonRepositoryPort } from '../ports/person.repository.port.js';
import type { Person } from '../../domain/entities/person.entity.js';
import { DuplicateDocumentException } from '../../domain/errors/people.errors.js';
import { DocumentType } from '../../domain/enums/people.enums.js';

describe('CreatePersonUseCase', () => {
  let useCase: CreatePersonUseCase;
  let mockRepo: jest.Mocked<PersonRepositoryPort>;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn().mockImplementation((p: Person) => Promise.resolve(p)),
      findById: jest.fn(),
      findByCode: jest.fn(),
      findByDocument: jest.fn(),
      findAll: jest.fn(),
      nextCode: jest.fn().mockResolvedValue('PER-000001'),
    };
    useCase = new CreatePersonUseCase(mockRepo);
  });

  it('should create a person successfully when valid command provided', async () => {
    const result = await useCase.execute({
      givenNames: 'Gabriel',
      familyNames: 'García Márquez',
      documentIssuingCountry: 'CO',
      documentType: DocumentType.NATIONAL_ID,
      documentNumber: '12345678',
    });

    expect(result.code).toBe('PER-000001');
    expect(result.name.displayName).toBe('Gabriel García Márquez');
    expect(mockRepo.save.mock.calls.length).toBe(1);
  });

  it('should throw DuplicateDocumentException if document already exists', async () => {
    mockRepo.findByDocument.mockResolvedValue({} as Person);

    await expect(
      useCase.execute({
        givenNames: 'Gabriel',
        documentIssuingCountry: 'CO',
        documentType: DocumentType.NATIONAL_ID,
        documentNumber: '12345678',
      }),
    ).rejects.toThrow(DuplicateDocumentException);
  });
});
