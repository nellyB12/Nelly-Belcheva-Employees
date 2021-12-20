import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription, throwError } from 'rxjs';
import { FileReaderService } from './../../services/file-reader.service';
import { ErrorService } from './../../services/error.service';
import { CommonProjectWorkEvaluatorService } from './../../services/common-project-work-evaluator.service';
import { TextData } from './../../models/text-data';
import { catchError, last } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  @Input() title!: string;
  private subscriptions = new Subscription();
  public results!: any;

  constructor(
    private fileReaderService: FileReaderService,
    private errorService: ErrorService,
    private commonProjectWorkEvaluatorService: CommonProjectWorkEvaluatorService
  ) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.fileReaderService.textContent$.subscribe({
        next: (value: TextData[]) => {
          this.results = [];
          if(value.length > 0) {
            try {
              this.commonProjectWorkEvaluatorService.addWorkLogArray(value);
              this.results = this.commonProjectWorkEvaluatorService.findBest();
            } catch (error) {
              this.errorService.errorSubject$.next(error.message);
            }
          }
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
