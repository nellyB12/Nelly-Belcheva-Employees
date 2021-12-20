import { Interval } from './interval';
import { Employee } from './employee';

export class Project {
  public id: number;
  public workers: Map<number, Employee>;

  constructor(id: number) {
    this.id = id;
    this.workers = new Map<number, Employee>();
  }

  public addWorkLog(employee: Employee, interval: Interval): void {
    this.getEmployeeAndAddIfMissing(employee);
    employee.addWorkLog(this.id, interval);
  }

  private getEmployeeAndAddIfMissing(employee: Employee): void {
    if(!this.workers.has(employee.id)) {
      this.workers.set(employee.id, employee);
    }
  }
}
