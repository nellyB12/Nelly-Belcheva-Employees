import { Interval } from './interval';

export class Employee {
  public id: number;
  public projectIntervals: Map<number, Interval[]>;
  private intervals : Interval[];

  constructor(id: number) {
    this.id = id;
    this.projectIntervals = new Map<number, Interval[]>();
    this.intervals = [];
  }

  public addWorkLog(projectId: number, interval: Interval) {
    if(!this.projectIntervals.has(projectId)) {
      this.projectIntervals.set(projectId, []);
    }
    this.projectIntervals.get(projectId)!.push(interval);
    if (Interval.hasOverlaps(interval, this.intervals)) {
      throw new Error("Overlapping intervals found for employee " + this.id + " for interval : " + JSON.stringify(interval));
    }
    this.intervals.push(interval);
  }
}
