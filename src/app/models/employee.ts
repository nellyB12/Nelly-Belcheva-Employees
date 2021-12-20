import { Interval } from './interval';

export interface Employee {
  id: number,
  projectIntervals: Map<number, Interval[]>
}
