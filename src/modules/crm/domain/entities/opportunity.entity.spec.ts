import { Opportunity } from './opportunity.entity.js';
import { CRMPipelineStage, CRMActivityType } from '../enums/crm.enums.js';
import { CRMActivity } from './crm-activity.entity.js';
import { CRMTask } from './crm-task.entity.js';
import { Quotation } from './quotation.entity.js';
import {
  OpportunityAlreadyDeletedException,
  InvalidPipelineStageTransitionException,
} from '../errors/crm.errors.js';

describe('Opportunity Aggregate Entity', () => {
  it('should create a NEW_LEAD opportunity and emit OpportunityCreatedEvent', () => {
    const opp = Opportunity.create({
      code: 'OPP-000001',
      title: 'Boda García - Cobertura Premium',
      personId: crypto.randomUUID(),
      estimatedValue: 5000000,
    });

    expect(opp.id).toBeDefined();
    expect(opp.code).toBe('OPP-000001');
    expect(opp.stage).toBe(CRMPipelineStage.NEW_LEAD);
    expect(opp.estimatedValue).toBe(5000000);
    expect(opp.domainEvents.length).toBe(1);
    expect(opp.domainEvents[0]!.eventName).toBe('crm.opportunity_created');
  });

  it('should transition through pipeline stages and record journey', () => {
    const opp = Opportunity.create({
      code: 'OPP-000002',
      title: 'Quince Años Martínez',
      estimatedValue: 2500000,
    });
    opp.clearDomainEvents();

    opp.transitionTo(CRMPipelineStage.CONTACTED, undefined, 'user-1');
    expect(opp.stage).toBe(CRMPipelineStage.CONTACTED);
    expect(opp.domainEvents.length).toBe(1);
    expect(opp.domainEvents[0]!.eventName).toBe('crm.opportunity_stage_changed');
  });

  it('should throw on invalid stage transition', () => {
    const opp = Opportunity.create({
      code: 'OPP-000003',
      title: 'Evento Corporativo TJ',
      estimatedValue: 8000000,
    });

    expect(() => opp.transitionTo(CRMPipelineStage.CONVERTED)).toThrow(InvalidPipelineStageTransitionException);
  });

  it('should log activity and emit CRMActivityLoggedEvent', () => {
    const opp = Opportunity.create({
      code: 'OPP-000004',
      title: 'Graduación Pérez',
      estimatedValue: 1500000,
    });
    opp.clearDomainEvents();

    const activity = new CRMActivity({
      opportunityId: opp.id,
      activityType: CRMActivityType.CALL,
      title: 'Llamada inicial de presentación',
    });

    opp.logActivity(activity, 'user-1');
    expect(opp.activities.length).toBe(1);
    expect(opp.domainEvents[0]!.eventName).toBe('crm.activity_logged');
  });

  it('should add task to opportunity', () => {
    const opp = Opportunity.create({
      code: 'OPP-000005',
      title: 'Bautizo Rodríguez',
      estimatedValue: 800000,
    });

    const task = new CRMTask({
      opportunityId: opp.id,
      title: 'Enviar propuesta por correo',
      dueDate: new Date('2026-09-01'),
    });

    opp.addTask(task);
    expect(opp.tasks.length).toBe(1);
    expect(task.isCompleted).toBe(false);
    task.complete();
    expect(task.isCompleted).toBe(true);
  });

  it('should approve quotation and emit QuotationStatusChangedEvent', () => {
    const opp = Opportunity.create({
      code: 'OPP-000006',
      title: 'Aniversario Sánchez',
      estimatedValue: 3000000,
    });

    const quotation = new Quotation({
      opportunityId: opp.id,
      quotationNumber: 'COT-000001',
      title: 'Cotización Paquete Estándar',
      subtotalAmount: 2580000,
      totalAmount: 3000000,
      taxAmount: 420000,
    });

    opp.addQuotation(quotation);
    opp.clearDomainEvents();
    opp.approveQuotation(quotation.id, 'user-1');

    expect(quotation.status).toBe('APPROVED');
    expect(opp.domainEvents[0]!.eventName).toBe('crm.quotation_status_changed');
  });

  it('should soft delete and throw on subsequent mutations', () => {
    const opp = Opportunity.create({
      code: 'OPP-000007',
      title: 'Evento Archivable',
      estimatedValue: 0,
    });

    opp.softDelete('user-1');
    expect(opp.isDeleted()).toBe(true);
    expect(opp.stage).toBe(CRMPipelineStage.ARCHIVED);

    expect(() => opp.softDelete('user-1')).toThrow(OpportunityAlreadyDeletedException);
  });
});
