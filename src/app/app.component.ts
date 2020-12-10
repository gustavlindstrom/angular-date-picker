import { Component, ElementRef } from '@angular/core';

export enum Day {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday
}

export enum Month {
  January,
  February,
  March,
  April,
  May,
  June,
  July,
  August,
  September,
  October,
  November,
  December
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  readonly today: Date = this._dateService.getToday(new Date());
  readonly dateList: Array<Date> = this._dateService.getDateList(30, this.today);
  currentDate: Date = new Date();
  selectedDate: Date = new Date();
  currentDataIndex: number = 0;
  showDatePicker: boolean = false;

  constructor(private _dateService: DateService, private _elementRef: ElementRef) { }

  openModal() {
    this.showDatePicker = true;
  }

  closeModal() {
    this.showDatePicker = false;
    this.currentDataIndex = 0;
  }

  submitModal() {
    this.currentDate = this.selectedDate;
    this.showDatePicker = false;
    this.currentDataIndex = 0;
  }

  scrollUp() {
    if (this.currentDataIndex === 0) { return; }
    this.currentDataIndex--;
    let el = this._elementRef.nativeElement.querySelector(`[data-index="${this.currentDataIndex}"]`)
    el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
  }

  scrollDown() {
    if (this.currentDataIndex === this.dateList.length-1 ) { return; }
    this.currentDataIndex++;
    let el = this._elementRef.nativeElement.querySelector(`[data-index="${this.currentDataIndex}"]`)
    el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
  }

  scrollToElement(id: number) {
    this.currentDataIndex = id;
    let el = this._elementRef.nativeElement.querySelector(`[data-index="${id}"]`)
    el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
  }

  onScroll(event: Event) {
    let target = event.target as HTMLElement
    let initPos = 2;

    let top = target.scrollTop;
    let offsetHeight = target.offsetHeight;
    let middle = (offsetHeight / 2) + top;

    let items = this.dateList.length + (initPos*2);
    let itemHeight = target.scrollHeight / items;

    let selectedItemIndex = Math.round(((middle - itemHeight / 2) / itemHeight) - initPos);
    this.currentDataIndex = selectedItemIndex;
    this.selectedDate = this.dateList[selectedItemIndex]
  }
}


import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'customDatePipe' })
export class CustomDatePipe implements PipeTransform {
  transform(date: Date): string {
    return `${Day[date.getDay()]} ${date.getDate()} ${Month[date.getMonth()]} ${date.getFullYear()}`;
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  getToday(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  getDate(num: number, date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + num);
  }

  getDateList(num: number, date: Date): Array<Date> {
    const startDate = date;
    let dateList: Array<Date> = []
    for (let i = 0; i < num; i++) {
      var temp = this.getDate(i, startDate);
      dateList.push(temp)
    }
    return dateList;
  }
}
