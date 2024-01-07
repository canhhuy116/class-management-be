import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ISeederService } from 'application/ports/ISeederService';
import { IUsersRepository } from 'application/ports/IUserRepository';
import { User } from 'domain/models/User';

@Injectable()
export class SeederService implements OnModuleInit, ISeederService {
  private readonly adminName = this.configService.get('ADMIN_NAME');
  private readonly adminEmail = this.configService.get('ADMIN_EMAIL');
  private readonly adminPassword = this.configService.get('ADMIN_PASSWORD');

  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: IUsersRepository,
  ) {}

  async onModuleInit() {
    const adminExists = await this.userRepository.count({
      where: {
        email: this.adminEmail,
      },
    });

    if (adminExists === 0) {
      await this.createAdmin();
    }
  }

  async createAdmin() {
    const admin = new User(this.adminName, this.adminEmail);
    await admin.hashPassword(this.adminPassword);
    admin.belongsToAdmin();

    await this.userRepository.save(admin);
  }
}
