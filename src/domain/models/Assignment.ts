import { BaseModel } from './BaseModel';

export class Assignment extends BaseModel {
  name: string;
  maxScore: number;
  gradeCompositionId: number;

  constructor(name: string, maxScore: number, gradeCompositionId: number) {
    super();
    this.name = name;
    this.maxScore = maxScore;
    this.gradeCompositionId = gradeCompositionId;
  }
}
