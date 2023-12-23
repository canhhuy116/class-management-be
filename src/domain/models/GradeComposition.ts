import { BaseModel } from './BaseModel';

export class GradeComposition extends BaseModel {
  name: string;
  weight: number;
  classId: number;
  priority: number;
  viewable: boolean;

  constructor(name: string, weight: number, classId: number) {
    super();
    this.name = name;
    this.weight = weight;
    this.classId = classId;
  }

  enableView() {
    this.viewable = true;
  }
}
