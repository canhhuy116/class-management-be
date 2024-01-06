import { Assignment } from './Assignment';
import { BaseModel } from './BaseModel';

export class GradeComposition extends BaseModel {
  name: string;
  weight: number;
  classId: number;
  priority: number;
  viewable: boolean;

  constructor(name: string, weight: number) {
    super();
    this.name = name;
    this.weight = weight;
  }

  forClass(classId: number) {
    this.classId = classId;

    return this;
  }

  enableView() {
    this.viewable = true;
  }
}
