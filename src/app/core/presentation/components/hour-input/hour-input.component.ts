import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  Provider,
  ViewChild,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => HourInputComponent),
  multi: true,
};

type KindTime = 'AM' | 'PM';
@Component({
  selector: 'app-hour-input',
  templateUrl: './hour-input.component.html',
  styleUrls: ['./hour-input.component.scss'],
  providers: [CONTROL_VALUE_ACCESSOR],
})
export class HourInputComponent implements OnInit, ControlValueAccessor {
  @ViewChild('clock') clock!: ElementRef;
  @Input() disabled = false;
  // @ViewChild('hoursDisplay') hourDisplay!: ElementRef;
  @ViewChild('hourSelector') hourSelector!: ElementRef;
  hours!: number;
  hoursString!: string;
  kind!: KindTime;
  @ViewChild('minutesSelector') minuteSelector!: ElementRef;
  minutes!: number;
  minutesString!: string;
  // @ViewChild('minutesDisplay') minutesDisplay!: ElementRef;
  onChange = (data: string) => {};
  onTouched = () => {};
  @ViewChild('period') period!: ElementRef;
  @ViewChild('selector') selectorBox!: ElementRef;
  value!: string;

  constructor(private cd: ChangeDetectorRef) {}

  changeHour() {
    if (!this.disabled) {
      this.minuteSelector?.nativeElement.classList.add('hidden');
      this.hourSelector?.nativeElement.classList.remove('hidden');
      this.clock?.nativeElement.classList.add('selector-open');
      this.selectorBox?.nativeElement.classList.remove('slideUp');
      this.selectorBox?.nativeElement.classList.add('slideDown');
    }
  }

  changeMinute() {
    if (!this.disabled) {
      this.minuteSelector?.nativeElement.classList.remove('hidden');
      this.hourSelector?.nativeElement.classList.add('hidden');
      this.clock?.nativeElement.classList.add('selector-open');
      this.selectorBox?.nativeElement.classList.remove('hidden');
      this.selectorBox?.nativeElement.classList.remove('slideUp');
      this.selectorBox?.nativeElement.classList.add('slideDown');
    }
  }

  completeNumber(input: number) {
    if (input < 10) {
      return `0${input}`;
    } else {
      return input.toString();
    }
  }

  hourSet(digit: number) {
    this.collapse();
    this.udpateHourView(digit);
  }

  minuteSet(digit: number) {
    this.collapse();
    this.udpateMinuteView(digit);
  }

  ngOnInit(): void {
    if (this.hours == undefined) {
      this.hours = 12;
      this.minutes = 0;
      this.kind = 'PM';
      this.updateView(this.hours, this.minutes, this.kind);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  setValue() {
    let _hourTemp = this.hours;

    if (this.kind == 'PM') {
      _hourTemp = this.hours + 12;
      _hourTemp = _hourTemp == 24 ? 0 : _hourTemp;
    }
    this.value = `${this.completeNumber(_hourTemp)}:${this.completeNumber(
      this.minutes
    )}`;

    this.onChange(this.value);
  }

  splitStringDate(input: string) {
    const [hour, minute]: string[] = input.split(':');

    const kind: KindTime = parseInt(hour) > 12 ? 'PM' : 'AM';
    return {
      hour: kind == 'PM' ? parseInt(hour) - 12 : parseInt(hour),
      minute: parseInt(minute),
      kind,
    };
  }

  toggle() {
    if (!this.disabled) {
      if (this.kind == 'AM') {
        this.updateKindView('PM');
      } else {
        this.updateKindView('AM');
      }
    }
  }

  private udpateHourView(hour: number) {
    this.hours = hour;
    this.hoursString = this.completeNumber(hour);
    this.cd.detectChanges();
    this.setValue();
  }

  private udpateMinuteView(minute: number) {
    this.minutes = minute;
    this.minutesString = this.completeNumber(minute);
    this.cd.detectChanges();
    this.setValue();
  }

  private updateKindView(kind: KindTime) {
    this.kind = kind;
    this.setValue();
    if (kind == 'AM') {
      this.period?.nativeElement.classList.remove('pm');
      this.period?.nativeElement.classList.add('am');
      this.clock?.nativeElement.classList.remove('night');
    } else {
      this.period?.nativeElement.classList.add('pm');
      this.period?.nativeElement.classList.remove('am');
      this.clock?.nativeElement.classList.add('night');
    }
  }

  private updateView(hour: number, minute: number, kind: KindTime) {
    this.udpateHourView(hour);
    this.udpateMinuteView(minute);
    this.updateKindView(kind);
  }

  writeValue(obj: string): void {
    const data = this.splitStringDate(obj);
    this.hours = data.hour;
    this.minutes = data.minute;
    this.kind = data.kind;
    this.updateView(data.hour, data.minute, data.kind);
  }

  private collapse() {
    if (!this.disabled) {
      this.clock?.nativeElement.classList.remove('selector-open');
      this.selectorBox?.nativeElement.classList.remove('slideDown');
      this.selectorBox?.nativeElement.classList.add('slideUp');
      this.hourSelector?.nativeElement.classList.add('hidden');
      this.minuteSelector?.nativeElement.classList.add('hidden');
    }
  }
}
