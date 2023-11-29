import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeorm from 'config/typeorm';
import { setEnvironment } from 'infrastructure/environments';
import { UsersModule } from 'infrastructure/ioc/user.module';
import { HealthController } from 'infrastructure/terminus';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: setEnvironment(),
      load: [typeorm],
    }),
    // TypeOrmModule.forRoot({
    //   type: process.env.DB_CONNECTION as any,
    //   host: process.env.DB_HOST,
    //   port: parseInt(process.env.DB_PORT, 10),
    //   username: process.env.DB_USERNAME,
    //   password: process.env.DB_PASSWORD,
    //   database: process.env.DB_DATABASE,

    //   entities: ['dist/infrastructure/database/mapper/*.js'],

    //   synchronize: false,

    //   migrationsTableName: 'migrations',
    //   migrations: ['dist/infrastructure/database/migrations/*.js'],
    // }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    HttpModule,
    TerminusModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
