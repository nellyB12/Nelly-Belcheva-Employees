import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { TextData } from './../models/text-data';
import { ValidatorService } from './validator.service';

@Injectable({
  providedIn: 'root'
})
export class FileReaderService {
  private textDataEmpty: TextData = {
    empId: 0,
    projectId: 0,
    dateFrom: new Date(),
    dateTo: new Date()
  };
  private textData: TextData[] = [];
  public error$ = new Subject<string>();
  public textContent$ = new Subject<TextData[]>();

  constructor(private validatorService: ValidatorService) {}

  public readFile(file: File): void {
    this.textData = [];
    const reader = new FileReader();
    reader.readAsText(file);
    this.readerOnLoad(reader);
  }

  private readerOnLoad(reader: FileReader): void {
    reader.onload = () => {
      let rawData = <string>reader.result;
      const rawDataArray: string[] = rawData.split(/\r\n|\n/);
      const rawContent = this.getRecordsAsArray(rawDataArray);
      this.textContent$.next(rawContent);
    }
  }

  private setDataErrorAndResetTextData(property: string, errorType: string, index: number) {
    const error = `Invalid ${property} (${errorType}) at row ${index+1}`;
    this.error$.next(error);
    this.textData = [];
  }

  private getRecordsAsArray(data: string[]): TextData[] {
    let newData = data;
    for(let i = 0; i < newData.length; i++) {
      if((newData[i]).trim().length === 0) {
        continue;
      }
      let row = newData[i].trim().split(',');
      if(row.length === Object.keys(this.textDataEmpty).length) {
        const record = <TextData>{};
        if(row[0].trim().length) {
          record.empId = Number(row[0].trim());
          if(!this.validatorService.positiveNumber(record.empId)) {
            this.setDataErrorAndResetTextData('EmpID', 'invalid number', i);
            break;
          }
        } else {
          this.setDataErrorAndResetTextData('EmpID', 'empty string', i);
          break;
        }

        if(row[1].trim().length) {
          record.projectId = Number(row[1].trim());
          if(!this.validatorService.positiveNumber(record.projectId)) {
            this.setDataErrorAndResetTextData('ProjectID', 'invalid number', i);
            break;
          }
        } else {
          this.setDataErrorAndResetTextData('ProjectID', 'empty string', i);
          break;
        }

        if(row[2].trim().length) {
          record.dateFrom = new Date(row[2].trim());
          if(!this.validatorService.validDate(record.dateFrom)) {
            this.setDataErrorAndResetTextData('DateFrom', 'date type', i);
            break;
          }
        } else {
          this.setDataErrorAndResetTextData('DateFrom', 'empty string', i);
          break;
        }

        if(row[3].trim().length) {
          record.dateTo = row[3].trim().toUpperCase() === 'NULL' ? new Date() : new Date(row[3].trim());
          if(!this.validatorService.validDate(record.dateTo)) {
            this.setDataErrorAndResetTextData('DateTo', 'date type', i);
            break;
          }
        } else {
          this.setDataErrorAndResetTextData('DateTo', 'empty string', i);
          break;
        }
        this.textData.push(record);
      } else {
        const error = `Invalid record length at row ${i+1}`;
        this.error$.next(error);
        this.textData = [];
        break;
      }
    }
    return this.textData;
  }
}
