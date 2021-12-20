import { Interval } from './interval';
import { Project } from './project';

export class PairResult {
  public employee1Id: number;
  public employee2Id: number;
  public totalTime: number;
  public projectTimes: Map<number, number>;
  public commonProjectsLog: Map<Project, Interval[]>;

  constructor(employee1Id: number, employee2Id: number, commonProjectsLog: Map<Project, Interval[]>) {
    this.employee1Id = employee1Id;
    this.employee2Id = employee2Id;
    this.commonProjectsLog = commonProjectsLog;
    this.projectTimes = this.calcProjectTime(this.commonProjectsLog);
    this.totalTime = this.calcTotalTime(this.commonProjectsLog);
  }

  private calcProjectTime(log: Map<Project, Interval[]>): Map<number, number> {
    let result = new Map<number, number>();
    log.forEach((value: Interval[], key: Project) => {
      result.set(key.id, Interval.countDays(value));
    });
    return result;
  }

  private calcTotalTime(log: Map<Project, Interval[]>): number {
    let total = 0;
    log.forEach((value: Interval[], key: Project) => {
      total += Interval.countDays(value);
    });
    return total;
  }
}
