import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { fromEvent, map, Observable, Subject, takeUntil, tap } from 'rxjs';

const getRange = (value: string): [number, number] => {
  // Split on anything that isn't a number
  const range: number[] = value.split(/[^0-9\-]+/)
    .map(part => part.trim())
    .map(part => +part);
  
  return [range[0] || 0, range[1] || 0];
}

@Component({
  selector: 'app-range-input',
  templateUrl: './range-input.component.html',
  styleUrls: ['./range-input.component.scss']
})
export class RangeInputComponent implements OnInit, OnDestroy {
  @ViewChild('form', { static: true }) form!: ElementRef<HTMLFormElement>;

  range = new FormControl<string>('0, 3', { nonNullable: true });
  range$!: Observable<[number, number]>;

  min = 0;
  max = 3;

  unsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    this.range$ = fromEvent(this.form.nativeElement, 'submit').pipe(
      map(() => getRange(this.range.value)),
      tap(([min, max]) => {
        this.min = min;
        this.max = max;
      }),
      takeUntil(this.unsubscribe$)
    );
    
    this.range$.subscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
