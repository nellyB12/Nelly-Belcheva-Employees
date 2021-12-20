import { Interval } from './interval';
import { Project } from './project';
import { Employee } from './employee';

export class CommonProjectLog {
  public firstEmployee: Employee;
  public secondEmployee: Employee;
  public sharedProjectsDays: Map<Project, Interval[]>;

  constructor(firstEmployee: Employee, secondEmployee: Employee) {
    this.firstEmployee = firstEmployee;
    this.secondEmployee = secondEmployee;
    this.sharedProjectsDays = new Map<Project, Interval[]>();
  }

  public evaluateSharedProjectTimes(projects: Project[]) {
    for (let project of projects) {
      let intervalsFirstEmployee = this.firstEmployee.projectIntervals.get(project.id);
      let intervalsSecondEmployee = this.secondEmployee.projectIntervals.get(project.id);
      if(intervalsFirstEmployee && intervalsSecondEmployee) {
        let resultIntervals = this.findIntervalsIntersection(intervalsFirstEmployee, intervalsSecondEmployee);
        if (resultIntervals.length > 0) {
          this.sharedProjectsDays.set(project, resultIntervals);
        }
      } else {
        continue;
      }
    }

    return this.sharedProjectsDays;
  }

  private findIntervalsIntersection(intervalsFirstEmployee: Interval[], intervalsSecondEmployee: Interval[]) {
    let result = new Array<Interval>();
    for (let interval1 of intervalsFirstEmployee) {
      for (let interval2 of intervalsSecondEmployee) {
          let intersection = Interval.intersection(interval1, interval2);
          if (intersection != null) {
            result.push(intersection);
          }
      }
    }
    return result;
  }
}
