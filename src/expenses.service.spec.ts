import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpensesService } from './expenses.service';
import { Expenses } from './expenses.entity';
import { ExpensesAggregation } from './expenses-aggregation.entity';
import { ListFilterDTO } from './dto/list-filter.dto';
import { ExpensesCreateDTO, Status } from './dto/expenses-create.dto';
import { ExpensesUpdateStatusDTO } from './dto/expenses-update-status.dto';
import { AggregationFilterDTO } from './dto/aggregation-filter.dto';
import { PaginationDTO } from './dto/pagination.dto';

describe('ExpensesService', () => {
  let service: ExpensesService;
  let expensesRepository: jest.Mocked<Repository<Expenses>>;
  let aggregationRepository: jest.Mocked<Repository<ExpensesAggregation>>;

  const mockExpenses: Expenses[] = [
    {
      id: 'uuid-1',
      amount: 100,
      currency: 'USD',
      category: 'Food',
      description: 'Lunch',
      clientId: 'client-1',
      status: Status.pending,
      creationDate: new Date('2026-06-01'),
      year: 2026,
      month: 6,
      day: 1,
    } as Expenses,
    {
      id: 'uuid-2',
      amount: 200,
      currency: 'USD',
      category: 'Transport',
      description: 'Taxi',
      clientId: 'client-1',
      status: Status.reviewed,
      creationDate: new Date('2026-06-02'),
      year: 2026,
      month: 6,
      day: 2,
    } as Expenses,
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        {
          provide: getRepositoryToken(Expenses),
          useValue: {
            createQueryBuilder: jest.fn(),
            findOneBy: jest.fn(),
            insert: jest.fn(),
            orIgnore: jest.fn(),
            returning: jest.fn(),
            execute: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ExpensesAggregation),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
            createQueryBuilder: jest.fn(),
            getMany: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ExpensesService>(ExpensesService);
    expensesRepository = module.get(getRepositoryToken(Expenses));
    aggregationRepository = module.get(getRepositoryToken(ExpensesAggregation));
  });

  describe('create', () => {
    it('should create an expense and update aggregation', async () => {
      const dto: ExpensesCreateDTO = {
        amount: 100,
        currency: 'USD',
        category: 'Food',
        description: 'Test expense',
        clientId: 'client-1',
        status: Status.pending,
      };

      const mockQueryBuilder = {
        insert: jest.fn().mockReturnThis(),
        into: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        orIgnore: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({ raw: [mockExpenses[0]] }),
      };

      const mockAggQueryBuilder = {
        insert: jest.fn().mockReturnThis(),
        into: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        orIgnore: jest.fn().mockReturnThis(),
        onConflict: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({}),
      };

      expensesRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      aggregationRepository.query = jest.fn().mockResolvedValue({});

      const result = await service.create(dto);

      expect(result).toEqual(mockExpenses[0]);
      expect(expensesRepository.createQueryBuilder).toHaveBeenCalled();
      expect(aggregationRepository.query).toHaveBeenCalled();
    });

    it('should throw ConflictException if expense already exists', async () => {
      const dto: ExpensesCreateDTO = {
        amount: 100,
        currency: 'USD',
        category: 'Food',
        description: 'Test expense',
        clientId: 'client-1',
        status: Status.pending,
      };

      const mockQueryBuilder = {
        insert: jest.fn().mockReturnThis(),
        into: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        orIgnore: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({ raw: [] }),
      };

      expensesRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await expect(service.create(dto)).rejects.toThrow('Already exists');
    });
  });

  describe('list', () => {
    it('should return paginated expenses with filters', async () => {
      const dto: ListFilterDTO = {
        queryFilter: 'Food',
        fromDate: new Date('2026-06-01'),
        toDate: new Date('2026-06-02'),
        pagination: new PaginationDTO(),
      };

      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockExpenses[0]], 1]),
      };

      expensesRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.list(dto);

      expect(result).toEqual({
        data: [mockExpenses[0]],
        page: 1,
        limit: 25,
        sort: 'asc',
        totalItems: 1,
      });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
      expect(mockQueryBuilder.orderBy).toHaveBeenCalled();
    });

    it('should return expenses without filters', async () => {
      const dto: ListFilterDTO = {
        pagination: new PaginationDTO(),
      };

      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockExpenses, 2]),
      };

      expensesRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.list(dto);

      expect(result).toEqual({
        data: mockExpenses,
        page: 1,
        limit: 25,
        sort: 'asc',
        totalItems: 2,
      });
    });
  });

  describe('getOne', () => {
    it('should return an expense by ID', async () => {
      expensesRepository.findOneBy.mockResolvedValue(mockExpenses[0]);

      const result = await service.getOne('uuid-1');

      expect(result).toEqual(mockExpenses[0]);
      expect(expensesRepository.findOneBy).toHaveBeenCalledWith({ id: 'uuid-1' });
    });

    it('should return null if expense not found', async () => {
      expensesRepository.findOneBy.mockResolvedValue(null);

      const result = await service.getOne('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('changeStatus', () => {
    it('should update expense status', async () => {
      const mockQueryBuilder = {
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({ raw: [mockExpenses[0]] }),
      };

      expensesRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const dto: ExpensesUpdateStatusDTO = { status: Status.reviewed };
      const result = await service.changeStatus('uuid-1', dto);

      expect(result).toEqual(mockExpenses[0]);
      expect(mockQueryBuilder.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException if expense not found or invalid', async () => {
      const mockQueryBuilder = {
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({ raw: [] }),
      };

      expensesRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const dto: ExpensesUpdateStatusDTO = { status: Status.reviewed };

      await expect(service.changeStatus('uuid-1', dto)).rejects.toThrow(
        'Expense not found or its status is not valid',
      );
    });
  });

  describe('getAggregations', () => {
    it('should return filtered aggregations', async () => {
      const filter: AggregationFilterDTO = {
        clientId: 'client-1',
        category: 'Food',
        year: 2026,
      };

      const mockAggregations: ExpensesAggregation[] = [
        {
          clientId: 'client-1',
          category: 'Food',
          year: 2026,
          month: 6,
          day: 1,
          currency: 'USD',
          count: 1,
          totalAmount: 100,
          creationDate: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockAggregations),
      };

      aggregationRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder,
      );

      const result = await service.getAggregations(filter);

      expect(result).toEqual(mockAggregations);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(3);
    });

    it('should return all aggregations without filters', async () => {
      const filter: AggregationFilterDTO = {};

      const mockAggregations: ExpensesAggregation[] = [
        {
          clientId: 'client-1',
          category: 'Food',
          year: 2026,
          month: 6,
          day: 1,
          currency: 'USD',
          count: 1,
          totalAmount: 100,
          creationDate: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockAggregations),
      };

      aggregationRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder,
      );

      const result = await service.getAggregations(filter);

      expect(result).toEqual(mockAggregations);
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
    });
  });

  describe('updateAggregation', () => {
    it('should execute raw SQL to upsert aggregation', async () => {
      const expense = mockExpenses[0];

      aggregationRepository.query = jest.fn().mockResolvedValue({});

      await service.updateAggregation(expense);

      expect(aggregationRepository.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO expenses_aggregation'),
        [
          expense.clientId,
          expense.category,
          expense.year,
          expense.month,
          expense.day,
          expense.currency,
          expense.amount,
        ],
      );
    });

    it('should update aggregation on conflict', async () => {
      const expense = mockExpenses[0];

      aggregationRepository.query = jest.fn().mockResolvedValue({});

      await service.updateAggregation(expense);

      expect(aggregationRepository.query).toHaveBeenCalledWith(
        expect.stringContaining('ON CONFLICT'),
        expect.arrayContaining([
          expense.clientId,
          expense.category,
          expense.year,
          expense.month,
          expense.day,
          expense.currency,
          expense.amount,
        ]),
      );
    });
  });
});
