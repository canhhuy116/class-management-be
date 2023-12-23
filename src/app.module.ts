import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeorm from 'config/typeorm';
import { setEnvironment } from 'infrastructure/environments';
import { AuthModule } from 'infrastructure/ioc/auth.module';
import { ClassModule } from 'infrastructure/ioc/class.module';
import { GradeCompositionModule } from 'infrastructure/ioc/grade.composition.module';
import { GradeManagementModule } from 'infrastructure/ioc/grade.management.module';
import { UsersModule } from 'infrastructure/ioc/user.module';
import { HealthController } from 'infrastructure/terminus';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ClassModule,
    GradeCompositionModule,
    GradeManagementModule,
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: setEnvironment(),
      load: [typeorm],
    }),
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
