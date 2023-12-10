import { IInvitationRepository } from 'application/ports/IInvitationRepository';
import { InvitationEntity } from '../mapper/InvitationEntity';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { BaseRepository } from './BaseRepository';
import { Invitation } from 'domain/models/Invitation';

@Injectable()
export class InvitationRepository
  extends BaseRepository<Invitation>
  implements IInvitationRepository
{
  constructor(@InjectConnection() connection: Connection) {
    super(connection, InvitationEntity);
  }
}
