import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Document } from './document.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('DocumentsService', () => {
  let service: DocumentsService;
  let repo: Repository<Document>;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        { provide: getRepositoryToken(Document), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    repo = module.get<Repository<Document>>(getRepositoryToken(Document));
  });

  it('should upload a document', async () => {
    mockRepo.create.mockReturnValue({ id: 1 });
    mockRepo.save.mockResolvedValue({ id: 1, title: 'test' });

    const file = { filename: 'doc.pdf', mimetype: 'application/pdf' } as any;
    const metadata = { title: 'test', description: '' };

    const result = await service.upload(file, metadata, 'admin');
    expect(result).toEqual({ id: 1, title: 'test' });
  });

  it('should find all documents', async () => {
    mockRepo.find.mockResolvedValue([{ id: 1, title: 'test' }]);
    const docs = await service.findAll();
    expect(docs.length).toBe(1);
  });

  it('should return undefined for deleted or missing ID', async () => {
    mockRepo.findOneBy.mockResolvedValue(null);
    await expect(service.findOne(100)).rejects.toThrow(NotFoundException);
  });
});
