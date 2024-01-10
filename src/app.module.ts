import { HttpModule } from '@nestjs/axios';
import { Module, OnModuleDestroy } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeorm from 'config/typeorm';
import { setEnvironment } from 'infrastructure/environments';
import { AdminModule } from 'infrastructure/ioc/admin.module';
import { AuthModule } from 'infrastructure/ioc/auth.module';
import { ClassModule } from 'infrastructure/ioc/class.module';
import { GradeCompositionModule } from 'infrastructure/ioc/grade.composition.module';
import { GradeManagementModule } from 'infrastructure/ioc/grade.management.module';
import { GradeReviewModule } from 'infrastructure/ioc/grade.review.module';
import { SeederModule } from 'infrastructure/ioc/seeder.module';
import { UsersModule } from 'infrastructure/ioc/user.module';
import { HealthController } from 'infrastructure/terminus';
import { Connection } from 'typeorm';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ClassModule,
    GradeCompositionModule,
    GradeManagementModule,
    GradeReviewModule,
    SeederModule,
    AdminModule,
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
export class AppModule implements OnModuleDestroy {
  constructor(private readonly connection: Connection) {}

  onModuleDestroy() {
    // Close the TypeORM connection when the module is destroyed (app is stopping)
    this.connection
      .destroy()
      .then(() => console.log('TypeORM connection closed.'));
  }
}
