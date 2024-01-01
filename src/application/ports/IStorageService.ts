import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IStorageService {
  abstract setDestination(destination: string): string;
  abstract setFilename(uploadedFile: Express.Multer.File): string;
  abstract uploadFile(
    uploadedFile: Express.Multer.File,
    destination: string,
  ): Promise<string>;
  abstract deleteFile(file: string): Promise<void>;
}
