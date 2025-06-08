import {
    Controller, Post, UseInterceptors, UploadedFile,
    Body, Get, Param, Delete, UseGuards, Request,
    Res,
    ParseIntPipe,
    NotFoundException,
    StreamableFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Express, Response } from 'express';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import * as fs from 'fs';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) { }

    @Post('upload')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('editor', 'admin')
    @UseInterceptors(FileInterceptor('file', {
        dest: './uploads',
        limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    }))

    upload(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: { title: string; description?: string },
        @Request() req
    ) {
        const user = req.user;
        return this.documentsService.upload(file, body, user.username);
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'editor', 'viewer')
    findAll() {
        return this.documentsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.documentsService.findOne(+id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.documentsService.remove(+id);
    }

    @Get(':id/download')
    @UseGuards(JwtAuthGuard)
    async download(@Param('id', ParseIntPipe) id: number, @Res({ passthrough: true }) res: Response): Promise<StreamableFile> {
        const doc = await this.documentsService.findOne(id);
        const filePath = join(__dirname, '..', '..', 'uploads', doc.filename);

        if (!fs.existsSync(filePath)) {
            throw new NotFoundException('File not found on server');
        }

        res.set({
            'Content-Type': doc.mimetype,
            'Content-Disposition': `attachment; filename="${doc.filename.replace(/[^a-zA-Z0-9.\-_]/g, '_')}"`,
        });


        const file = fs.createReadStream(filePath);
        return new StreamableFile(file);
    }
}
