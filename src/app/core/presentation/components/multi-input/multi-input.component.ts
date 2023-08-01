import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Provider,
  QueryList,
  SimpleChanges,
  ViewChildren,
  forwardRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';

const CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MultiInputComponent),
  multi: true,
};

@Component({
  selector: 'app-multi-input',
  templateUrl: './multi-input.component.html',
  styleUrls: ['./multi-input.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CONTROL_VALUE_ACCESSOR],
})
export class MultiInputComponent
  implements OnInit, ControlValueAccessor, OnChanges
{
  @Input() disabled = false;
  @Input() inputs = 1;
  @Input() label!: string;
  @Input() size: 'small' | 'medium' | 'large' = 'large';
  @Input('data-type') dataType = 'text';
  @Input() placeholders!: string[];

  @ViewChildren('myInput', {
    read: ElementRef,
  })
  inputElements!: QueryList<ElementRef>;
  onChange = (data: any[]) => {};
  onTouched = () => {};
  value!: any[];

  formGroup!: FormGroup | null;
  formGrupSubscription!: Subscription;
  constructor(
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes &&
      changes.inputs.currentValue &&
      changes.inputs.currentValue != changes.inputs.previousValue
    ) {
      const temp = this.generateArray(changes.inputs.currentValue);
      console.log('Temp ', temp);
      this.setValue(temp);

      this.setFormGroup(temp);
      this.onChange(temp);
    }
  }

  private generateArray(length: number) {
    return Array.from({ length: this.inputs }, (_, index) => 0);
  }

  private setFormGroup(value: number[]) {
    // this.formGrupSubscription?.unsubscribe();
    // this.formGroup = null;
    // this.cd.markForCheck();
    // const data: any = {};
    // for (let i = 0; i < value.length; i++) {
    //   const element = value[i];
    //   console.log('Element ', i, element);
    //   data['k' + i.toString()] = new FormControl(element, Validators.required);
    // }
    // console.log('Data -- ', data);
    // this.formGroup = this.formBuilder.group(data);
    // this.cd.detectChanges();
    // this.formGrupSubscription = this.formGroup.valueChanges.subscribe(
    //   (value) => {
    //     const realValue = this.convertDictionaryToArray(value);
    //     const normalizedValue = this.normalize(realValue);
    //     this.setValue(normalizedValue);
    //     this.onChange(normalizedValue);
    //   }
    // );
  }

  // private convertDictionaryToArray(dictionary: any): any[] {
  //   const keys = Object.keys(dictionary).sort();
  //   const res: number[] = [];

  //   for (const K of keys) {
  //     res.push(dictionary[K]);
  //   }
  //   return res;
  // }

  // private normalize(data: any[]) {
  //   const answer: number[] = [];
  //   for (const dat of data) {
  //     if (typeof dat === 'string') {
  //       answer.push(parseInt(dat));
  //     } else {
  //       answer.push(dat);
  //     }
  //   }
  //   return answer;
  // }

  updateValue(data: Event, index: number) {
    const temp = [...this.value];
    const target: HTMLInputElement = data.target as HTMLInputElement;
    temp[index] = target.value;
    console.log('****');
    console.log(index, target);
    console.log('****');

    if (target.type == 'number') {
      temp[index] = target.valueAsNumber;
    }

    this.setValue(temp);
    this.onChange(temp);

    if (this.inputElements.get(index) != undefined) {
      console.log(this.inputElements.map((e) => e.nativeElement.id));

      const t = this.inputElements
        .filter((e) => {
          console.log(11,e.nativeElement.id,'k' + index);
          console.log(e.nativeElement);
          
          
          return e.nativeElement.id == 'k' + index;
        })
        .pop();
      t!.nativeElement.value = temp[index];
      console.log('Eli');
    }
    console.log('Vaue ', temp);
  }
  ngOnInit(): void {}

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  setValue(inputs: number[]) {
    this.value = [...inputs];
  }

  writeValue(obj: number[]): void {
    this.setValue(obj);
    this.setFormGroup(obj);
  }
}
