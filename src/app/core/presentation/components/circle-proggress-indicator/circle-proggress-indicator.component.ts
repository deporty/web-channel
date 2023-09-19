import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-circle-proggress-indicator',
  templateUrl: './circle-proggress-indicator.component.html',
  styleUrls: ['./circle-proggress-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircleProggressIndicatorComponent
  implements AfterViewInit, OnInit
{
  ngOnInit(): void {
    this._percent = Math.round(this.percent);
  }
  @Input() percent = 0;

  _percent = 0;

  ngAfterViewInit(): void {}
}

// class ProgressCircle {
//   $el: Element;
//   $value: HTMLDivElement;
//   private _col1: string;
//   private _col2: string;
//   private _value: number;
//   constructor(
//     element: Element,
//     config: {
//       col1?: string;
//       col2?: string;
//     } = {},
//     value: number = 0
//   ) {
//     const CLASS_PROGRESS = 'progress';
//     const CLASS_ROOT = `${CLASS_PROGRESS}-circle`;
//     const CLASS_TEXT = `${CLASS_PROGRESS}-circle-text`;

//     const Default = {
//       col1: '#ebebeb',
//       col2: '#4285f4',
//     };

//     const _config = { ...Default, ...config };
//     const data_value = element.getAttribute('data-progress-circle');

//     value = typeof value === 'number' ? value : Number(data_value);
//     value = !Number.isNaN(value) ? value : 0;
//     value = value <= 0 ? 0 : value >= 100 ? 100 : value;

//     if (typeof config.col1 !== 'string') {
//       const data_col1 = element.getAttribute('data-progress-col1');
//       _config.col1 = data_col1 ? data_col1 : _config.col1;
//     }

//     if (typeof config.col2 !== 'string') {
//       const data_col2 = element.getAttribute('data-progress-col2');
//       _config.col2 = data_col2 ? data_col2 : _config.col2;
//     }

//     this.$el = element;
//     this.$el.classList.add(CLASS_ROOT);

//     this.$value = this.$el.appendChild(document.createElement('div'));
//     this.$value.classList.add(CLASS_TEXT);

//     this._col1 = _config.col1;
//     this._col2 = _config.col2;
//     this._value = value;

//     this._render();
//   }

//   get value() {
//     return this._value;
//   }
//   get col1() {
//     return this._col1;
//   }
//   get col2() {
//     return this._col2;
//   }

//   set value(num) {
//     let value = Number(num);
//     value = !Number.isNaN(value) ? value : 0;
//     value = value <= 0 ? 0 : value >= 100 ? 100 : value;

//     this._value = value;
//     this._render();
//   }

//   set col1(colour) {
//     this._col1 = colour;
//     this._render();
//   }

//   set col2(colour) {
//     this._col2 = colour;
//     this._render();
//   }

//   _render() {
//     const increment = 3.6;
//     let first = -90 + increment * (this.value - 50);
//     let second = 90 + increment * this.value;
//     let colour = this.value >= 50 ? this.col2 : this.col1;

//     first = this.value < 50 ? 90 : first;
//     second = this.value >= 50 ? 270 : second;
//     const DATA_PROGRESS = 'data-progress-circle';

//     this.$value.innerHTML = Math.ceil(this.value).toString();
//     this.$el.setAttribute(DATA_PROGRESS, this.value.toString());
//     ((this.$el as HTMLElement).style as any)[
//       '--progress-first'
//     ] = `${first}deg;`;
//     ((this.$el as HTMLElement).style as any)[
//       '--progress-second'
//     ] = `${second}deg;`;
//     ((this.$el as HTMLElement).style as any)[
//       '--progress-linear1'
//     ] = `${colour};`;
//     ((this.$el as HTMLElement).style as any)[
//       '--progress-linear2'
//     ] = `${this.col2}deg;`;
//     ((this.$el as HTMLElement).style as any)[
//       '--progress-linear3'
//     ] = `${this.col1}deg;`;
//   }
// }
