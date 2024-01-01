import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IStorageService } from 'application/ports/IStorageService';
import { CloudStorageService } from 'infrastructure/service/GGCStorageService';

@Module({
  imports: [ConfigModule],
  providers: [{ provide: IStorageService, useClass: CloudStorageService }],
  exports: [IStorageService],
})
export class StorageModule {}
