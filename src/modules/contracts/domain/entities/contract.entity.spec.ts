import { Contract } from './contract.entity.js';
import { ContractStatus, ContractTemplateType, ContractPartyRole } from '../enums/contracts.enums.js';
import { ContractVersion } from './contract-version.entity.js';
import { ContractParty } from './contract-party.entity.js';
import { ContractClause } from '../value-objects/contract-clause.value-object.js';
import { ContractAlreadyDeletedException } from '../errors/contracts.errors.js';

describe('Contract Aggregate Entity', () => {
  it('should create a DRAFT contract and emit ContractCreatedEvent', () => {
    const contract = Contract.create({
      code: 'CTR-000001',
      title: 'Contrato de Servicios Fotográficos y de Video',
      eventId: crypto.randomUUID(),
      templateType: ContractTemplateType.SERVICE_AGREEMENT,
    });

    expect(contract.id).toBeDefined();
    expect(contract.code).toBe('CTR-000001');
    expect(contract.status).toBe(ContractStatus.DRAFT);
    expect(contract.currentVersionNumber).toBe(1);
    expect(contract.domainEvents.length).toBe(1);
    expect(contract.domainEvents[0]!.eventName).toBe('contracts.created');
  });

  it('should add a contract version and update currentVersionNumber', () => {
    const contract = Contract.create({
      code: 'CTR-000002',
      title: 'Acuerdo de Derechos de Imagen',
      eventId: crypto.randomUUID(),
    });

    const clause = new ContractClause({
      number: '1.1',
      title: 'Autorización de Uso',
      body: 'El cliente autoriza el uso publicitario de las fotografías.',
    });

    const version = new ContractVersion({
      contractId: contract.id,
      versionNumber: 2,
      title: 'Versión 2 - Cláusulas Revisadas',
      clauses: [clause],
      changeReason: 'Ajuste de cláusula de privacidad',
    });

    contract.addVersion(version);
    expect(contract.versions.length).toBe(1);
    expect(contract.currentVersionNumber).toBe(2);
  });

  it('should add contract party', () => {
    const contract = Contract.create({
      code: 'CTR-000003',
      title: 'Contrato con Cliente',
      eventId: crypto.randomUUID(),
    });

    const party = new ContractParty({
      contractId: contract.id,
      personId: crypto.randomUUID(),
      role: ContractPartyRole.CLIENT,
      isPrimary: true,
    });

    contract.addParty(party);
    expect(contract.parties.length).toBe(1);
    expect(contract.parties[0]!.role).toBe(ContractPartyRole.CLIENT);
  });

  it('should publish contract and mark as executed', () => {
    const contract = Contract.create({
      code: 'CTR-000004',
      title: 'Contrato Oficial',
      eventId: crypto.randomUUID(),
    });

    contract.publish('admin-user');
    expect(contract.status).toBe(ContractStatus.PENDING_SIGNATURE);

    contract.markAsExecuted('admin-user');
    expect(contract.status).toBe(ContractStatus.EXECUTED);
    expect(contract.signedAt).toBeDefined();
  });

  it('should throw exception on invalid transition', () => {
    const contract = Contract.create({
      code: 'CTR-000005',
      title: 'Contrato Fallido',
      eventId: crypto.randomUUID(),
    });

    contract.publish();
    contract.softDelete();

    expect(() => contract.publish()).toThrow(ContractAlreadyDeletedException);
  });
});
