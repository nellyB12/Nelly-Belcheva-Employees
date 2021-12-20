export class Interval {
  static dayInMs: number = 24 * 60 * 60 * 1000;
  public start: Date;
  public end: Date;

  constructor(start: Date, end: Date) {
    this.start = start;
    this.end = end;
    if (this.start.getTime() > this.end.getTime() ) {
      throw new Error("Invalid interval");
    }
  }

  public getDiffInDays() {
    return Math.round((this.end.getTime() - this.start.getTime()) / Interval.dayInMs) + 1;
  }

  public static findSharedDays(first: Interval, second: Interval): number {
    let timeStart = Math.max(first.start.getTime(), second.start.getTime());
    let timeEnd = Math.min(first.end.getTime(), second.end.getTime());
    return Math.max(0, Math.round((timeEnd - timeStart) / Interval.dayInMs) + 1);
  }

  public static union(first: Interval, second: Interval): Interval[] {
    let result = [];
    if(Interval.findSharedDays(first,second) == 0) {
      result.push(first, second);
    } else {
      result.push(new Interval(
        new Date(Math.min(first.start.getTime(), second.start.getTime())),
        new Date(Math.max(first.end.getTime(), second.end.getTime()))
      ));
    }
    return result;
  }

  public static intersection(first: Interval, second: Interval): Interval | null {
    if(Interval.findSharedDays(first, second) == 0) {
      return null;
    }
    return new Interval(
      new Date(Math.max(first.start.getTime(), second.start.getTime())),
      new Date(Math.min(first.end.getTime(), second.end.getTime()))
    );
  }

  public static hasOverlaps(interval: Interval, intervals: Interval[]): boolean {
    for (let i = 0; i < intervals.length; i ++ ) {
      if (Interval.intersection(interval, intervals[i])!=null) {
        return true;
      }
    }
    return false;
  }

  public static countDays(intervals: Interval[]): number {
    let total = 0;
    intervals.map((interval) => total += interval.getDiffInDays());
    return total;
  }
}
