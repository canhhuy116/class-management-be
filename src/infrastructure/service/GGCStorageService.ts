import { Bucket, Storage } from '@google-cloud/storage';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { parse } from 'path';

@Injectable()
export class CloudStorageService {
  private bucket: Bucket;
  private storage: Storage;

  constructor(private readonly configService: ConfigService) {
    const privateKeyString = this.configService.get('PRIVATE_KEY');
    const privateKeyData = privateKeyString.replace(/\\n/g, '\n');

    this.storage = new Storage({
      projectId: this.configService.get('PROJECT_ID'),
      credentials: {
        client_email: this.configService.get('CLIENT_EMAIL'),
        private_key: privateKeyData,
      },
    });
    this.bucket = this.storage.bucket(
      this.configService.get('STORAGE_MEDIA_BUCKET'),
    );
  }

  private setDestination(destination: string): string {
    let escDestination = '';
    escDestination += destination
      .replace(/^\.+/g, '')
      .replace(/^\/+|\/+$/g, '');
    if (escDestination !== '') escDestination = escDestination + '/';
    return escDestination;
  }

  private setFilename(uploadedFile: Express.Multer.File): string {
    const fileName = parse(uploadedFile.originalname);
    return `${fileName.name}-${Date.now()}${fileName.ext}`
      .replace(/^\.+/g, '')
      .replace(/^\/+/g, '')
      .replace(/\r|\n/g, '_');
  }

  async uploadFile(
    uploadedFile: Express.Multer.File,
    destination: string,
  ): Promise<String> {
    const fileName =
      this.setDestination(destination) + this.setFilename(uploadedFile);
    const file = this.bucket.file(fileName);
    try {
      await file.save(uploadedFile.buffer, {
        contentType: uploadedFile.mimetype,
      });
    } catch (error) {
      throw new BadRequestException(error?.message);
    }

    return file.publicUrl();
  }

  async removeFile(fileName: string): Promise<void> {
    const file = this.bucket.file(fileName);
    try {
      await file.delete();
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }
}
