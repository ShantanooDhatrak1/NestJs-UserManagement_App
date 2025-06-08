import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './document.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepo: Repository<Document>,
  ) { }

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
    const doc = await this.documentRepo.findOneBy({ id });
    if (!doc) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }
    return doc;
  }

  async remove(id: number) {
    const doc = await this.documentRepo.findOneBy({ id });
    if (!doc) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }
    return this.documentRepo.remove(doc);
  }

  async getFileById(id: number): Promise<{ path: string; mimetype: string }> {
    const doc = await this.documentRepo.findOneBy({ id });
    if (!doc) throw new Error('Document not found');
    return { path: `uploads/${doc.filename}`, mimetype: doc.mimetype };
  }

}
