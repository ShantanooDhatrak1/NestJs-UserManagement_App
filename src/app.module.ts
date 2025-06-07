import { Module } from '@nestjs/common';
   import { TypeOrmModule } from '@nestjs/typeorm';
   import { ConfigModule, ConfigService } from '@nestjs/config';
   import { User } from './users/user.entity'; // Adjust path as needed
   import { UsersModule } from './users/users.module'; // Adjust path as needed
   import { AuthModule } from './auth/auth.module'; // Adjust path as needed

   @Module({
     imports: [
       ConfigModule.forRoot({
         isGlobal: true, // Makes ConfigModule available globally
         envFilePath: '.env', // Path to the .env file
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
           entities: [User],
           synchronize: true, // Note: Set to false in production
         }),
         inject: [ConfigService],
       }),
       UsersModule,
       AuthModule,
     ],
   })
   export class AppModule {}