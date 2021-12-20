import { Component, Input, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TextData } from './../../models/text-data';
import { FileReaderService } from './../../services/file-reader.service';
import { ErrorService } from './../../services/error.service';
import { CommonProjectWorkEvaluatorService } from './../../services/common-project-work-evaluator.service';

@Component({
  selector: 'app-card-file',
  templateUrl: './card-file.component.html',
  styleUrls: ['./card-file.component.scss']
})
export class CardFileComponent implements OnInit, OnDestroy {
  @Input() headerTitle!: string;
  @Input() headerIcon!: string;
  private file!: File | null;
  private subscriptions = new Subscription();
  public fileName: string | null = null;
  public uploadForm = new FormGroup({
    fileInput: new FormControl(null, Validators.required)
  });
  public fileErrors: string[] = [];
  evaluatorError: string[] = [];

  constructor(
    private fileReaderService: FileReaderService,
    private errorService: ErrorService,
    private commonProjectWokEvaluatorService: CommonProjectWorkEvaluatorService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.fileReaderService.error$.subscribe((error) => this.fileErrors.push(error))
    );
    this.subscriptions.add(
      this.errorService.errorSubject$.subscribe((error: string) => {
        this.evaluatorError.push(error);
      })
    );
  }

  private updateFileInput(value: File | undefined): void {
    this.uploadForm.patchValue({
      fileInput: value
    });
  }

  private resetFile(): void {
    this.fileName = '';
    this.updateFileInput(undefined);
  }

  private resetFileErrors(): void {
    this.fileErrors = [];
    this.evaluatorError = [];
  }

  public onFileSelected(event: Event): void {
    this.resetFileErrors();
    this.uploadForm.controls.fileInput.markAsTouched();
    const fileList: FileList | null = (event.target as HTMLInputElement).files;
    this.file = fileList ? fileList[0]: null;
    if(this.file) {
      this.fileName = this.file.name;
      this.fileReaderService.readFile(this.file);
      this.updateFileInput(this.file);
    } else {
      this.resetFile();
    }
  }

  public get fileInput(): AbstractControl {
    return this.uploadForm.get('fileInput')!;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
