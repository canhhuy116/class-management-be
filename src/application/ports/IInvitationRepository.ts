import { Injectable } from '@nestjs/common';
import { Invitation } from 'domain/models/Invitation';
import { IRepository } from './IRepository';

@Injectable()
export abstract class IInvitationRepository extends IRepository<Invitation> {}
