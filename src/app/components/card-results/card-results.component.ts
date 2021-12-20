import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { PairResult } from './../../models/pair-result';

interface ProjectTime {
  projectId: number,
  days: number
}

@Component({
  selector: 'app-card-results',
  templateUrl: './card-results.component.html',
  styleUrls: ['./card-results.component.scss']
})
export class CardResultsComponent implements OnInit, OnChanges {
  @Input() headerTitle!: string;
  @Input() headerIcon!: string;
  @Input() results!: PairResult[];
  public projectRecords!: ProjectTime[];

  constructor() { }

  ngOnInit() {
    this.setProjectRecords();
  }

  ngOnChanges() {
    this.setProjectRecords();
  }

  private setProjectRecords() {
    if(this.results.length) {
      this.results.map((result) => {
        this.projectRecords = this.getProjectTimes(result.projectTimes);
      });
    }
  }

  private getProjectTimes(res: Map<number, number>): ProjectTime[] {
    let projectTimesArr: ProjectTime[] = [];
    res.forEach((value: number, key: number) => {
      let projectTimeRecord: ProjectTime = {
        projectId: key,
        days: value
      };
      projectTimesArr.push(projectTimeRecord);
    });
    return projectTimesArr;
  }

}
