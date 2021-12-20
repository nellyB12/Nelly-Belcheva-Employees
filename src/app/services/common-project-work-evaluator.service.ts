import { Injectable } from '@angular/core';
import { TextData } from './../models/text-data';
import { Project } from './project';
import { Interval } from './interval';
import { PairResult } from './pair-result';
import { Employee } from './employee';
import { CommonProjectLog } from './common-project-log';

@Injectable({
  providedIn: 'root'
})
export class CommonProjectWorkEvaluatorService {
  public projects = new Map<number, Project>();
  public employees = new Map<number, Employee>();

  public addWorkLogArray(items: TextData[]) {
    this.projects.clear();
    this.employees.clear();
    items.map((item) => this.addWorkLog(item));
  }

  private addWorkLog(worklog: TextData) {
    if(!this.projects.has(worklog.projectId)) {
      this.projects.set(worklog.projectId, new Project(worklog.projectId));
    }
    const project = this.projects.get(worklog.projectId)!;
    const interval = this.createInterval(worklog);
    project.addWorkLog(this.getEmployee(worklog.empId), interval);
  }

  private createInterval(worklog: TextData) : Interval {
    try {
      return new Interval(worklog.dateFrom, worklog.dateTo);
    } catch (error) {
      throw new Error(`Invalid interval ${JSON.stringify(worklog.dateFrom)} - ${JSON.stringify(worklog.dateTo)} for employee ${worklog.empId} found.`);
    }
  }

  private getEmployee(id: number) {
    if(!this.employees.has(id)) {
      this.employees.set(id, new Employee(id));
    }
    return this.employees.get(id)!;
  }

  public findBest(): PairResult[] | undefined {
    let projects = this.getProjectsAsArray();
    let map = this.initUsers(projects);
    let pairResults = new Map<number, PairResult[]>();
    let bestTime = 0;

    map.forEach((value: CommonProjectLog, key: string) => {
      let result = value.evaluateSharedProjectTimes(projects);
      let pr = new PairResult(value.firstEmployee.id, value.secondEmployee.id, result);
      if(!pairResults.has(pr.totalTime)) {
        pairResults.set(pr.totalTime, []);
      }
      pairResults.get(pr.totalTime)!.push(pr);
      if(bestTime < pr.totalTime) {
        bestTime = pr.totalTime;
      }
    });

    return pairResults.get(bestTime);
  }

  private getProjectsAsArray(): Project[] {
    let projects = new Array<Project>();
    this.projects.forEach((project: Project, key: number) => projects.push(project));
    return projects;
  }

  private initUsers(projects: Project[]): Map<string, CommonProjectLog> {
    let map = new Map<string, CommonProjectLog>();
    projects.map((project: Project) => {
      let workers = new Array<Employee>();
      project.workers.forEach((employee: Employee, key: number) => workers.push(employee));
      for(let i = 0; i < workers.length -1; i++) {
        for(let j = i+1; j < workers.length; j++) {
          let el1 = workers[i];
          let el2 = workers[j];

          let first = el1.id < el2.id ? el1 : el2;
          let second = el1.id > el2.id ? el1 : el2;
          let key: string = first.id + '-' + second.id;
          if(!map.has(key)) {
            map.set(key, new CommonProjectLog(first, second));
          }
        }
      }
    });
    return map;
  }
}
