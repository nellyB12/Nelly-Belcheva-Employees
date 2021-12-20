import { Interval } from './interval';
import { Project } from './project';

export interface PairResult {
  employee1Id: number,
  employee2Id: number,
  totalTime: number,
  projectTimes: Map<number, number>,
  commonProjectsLog: Map<Project, Interval[]>
}
