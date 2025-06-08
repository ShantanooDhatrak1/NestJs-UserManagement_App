import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DocumentsModule } from './documents/documents.module';
import { Document } from './documents/document.entity';

   @Module({
     imports: [
       ConfigModule.forRoot({
         isGlobal: true,
         envFilePath: '.env',
       }),
       TypeOrmModule.forRootAsync({
         imports: [ConfigModule],
         useFactory: (configService: ConfigService) => ({
           type: configService.get<string>('DB_TYPE') as 'postgres',
           host: configService.get<string>('DB_HOST'),
           port: configService.get<number>('DB_PORT'),
           username: configService.get<string>('DB_USERNAME'),
           password: configService.get<string>('DB_PASSWORD'),
           database: configService.get<string>('DB_DATABASE'),
           entities: [User,Document],
           synchronize: true,
         }),
         inject: [ConfigService],
       }),
       UsersModule,
       AuthModule,
       DocumentsModule,
     ],
   })
   export class AppModule {}