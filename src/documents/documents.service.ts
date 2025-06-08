import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './document.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepo: Repository<Document>,
  ) {}

  async upload(file: Express.Multer.File, metadata: { title: string; description?: string }, uploadedBy: string) {
    const doc = this.documentRepo.create({
      title: metadata.title,
      description: metadata.description,
      filename: file.filename,
      mimetype: file.mimetype,
      uploadedBy,
    });

    return this.documentRepo.save(doc);
  }

  async findAll() {
    return this.documentRepo.find();
  }

  async findOne(id: number) {
    return this.documentRepo.findOneBy({ id });
  }

  async remove(id: number) {
    return this.documentRepo.delete(id);
  }
}
