import { CRMController } from './crm.controller.js';
import type { CreateOpportunityUseCase } from '../../../application/create-opportunity/create-opportunity.use-case.js';
import type { GetOpportunityUseCase } from '../../../application/get-opportunity/get-opportunity.use-case.js';
import type { UpdateOpportunityUseCase } from '../../../application/update-opportunity/update-opportunity.use-case.js';
import type { ManageOpportunityStageUseCase } from '../../../application/manage-opportunity-stage/manage-opportunity-stage.use-case.js';
import type { ManageQuotationsUseCase } from '../../../application/manage-quotations/manage-quotations.use-case.js';
import type { ManageCRMActivitiesUseCase } from '../../../application/manage-crm-activities/manage-crm-activities.use-case.js';
import type { ListOpportunitiesUseCase } from '../../../application/list-opportunities/list-opportunities.use-case.js';
import { Opportunity } from '../../../domain/entities/opportunity.entity.js';
import { CRMActivityType, CRMPipelineStage } from '../../../domain/enums/crm.enums.js';

describe('CRMController', () => {
  let controller: CRMController;
  let sampleOpp: Opportunity;

  beforeEach(() => {
    sampleOpp = Opportunity.create({
      code: 'OPP-000001',
      title: 'Boda García - Cobertura Premium',
      estimatedValue: 5000000,
    });

    const createUseCase = { execute: jest.fn().mockResolvedValue(sampleOpp) } as unknown as CreateOpportunityUseCase;
    const getUseCase = { execute: jest.fn().mockResolvedValue(sampleOpp) } as unknown as GetOpportunityUseCase;
    const updateUseCase = { execute: jest.fn().mockResolvedValue(sampleOpp) } as unknown as UpdateOpportunityUseCase;
    const stageUseCase = {
      transitionTo: jest.fn().mockResolvedValue(sampleOpp),
      convert: jest.fn().mockResolvedValue(sampleOpp),
      archive: jest.fn().mockResolvedValue(sampleOpp),
      restore: jest.fn().mockResolvedValue(sampleOpp),
    } as unknown as ManageOpportunityStageUseCase;
    const quotationUseCase = {
      addQuotation: jest.fn().mockResolvedValue(sampleOpp),
      approveQuotation: jest.fn().mockResolvedValue(sampleOpp),
      rejectQuotation: jest.fn().mockResolvedValue(sampleOpp),
    } as unknown as ManageQuotationsUseCase;
    const activitiesUseCase = {
      logActivity: jest.fn().mockResolvedValue(sampleOpp),
      addTask: jest.fn().mockResolvedValue(sampleOpp),
      completeTask: jest.fn().mockResolvedValue(sampleOpp),
    } as unknown as ManageCRMActivitiesUseCase;
    const listUseCase = {
      execute: jest.fn().mockResolvedValue({
        data: [sampleOpp],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      }),
    } as unknown as ListOpportunitiesUseCase;

    controller = new CRMController(
      createUseCase, getUseCase, updateUseCase, stageUseCase,
      quotationUseCase, activitiesUseCase, listUseCase,
    );
  });

  it('should create opportunity', async () => {
    const res = await controller.create({ title: 'Boda García - Cobertura Premium' });
    expect(res.code).toBe('OPP-000001');
  });

  it('should get opportunity by identifier', async () => {
    const res = await controller.findOne('OPP-000001');
    expect(res.stage).toBe(CRMPipelineStage.NEW_LEAD);
  });

  it('should list opportunities', async () => {
    const res = await controller.findAll({});
    expect(res.data.length).toBe(1);
    expect(res.total).toBe(1);
  });

  it('should log activity', async () => {
    const res = await controller.logActivity('opp-id', {
      activityType: CRMActivityType.CALL,
      title: 'Primer contacto',
    });
    expect(res.code).toBe('OPP-000001');
  });
});
