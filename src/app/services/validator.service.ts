import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {
  public validDate(date: any): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }

  public validNumber(value: any): boolean {
    return !isNaN(value);
  }

  public positiveNumber(value: any): boolean {
    return !isNaN(value) && Number(value) > 0;
  }
}
