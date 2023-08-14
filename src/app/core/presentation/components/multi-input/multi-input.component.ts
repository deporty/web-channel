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
  @Input('data-type') dataType = 'text';
  @Input() disabled = false;
  formGroup!: FormGroup | null;
  formGrupSubscription!: Subscription;
  @ViewChildren('myInput', {
    read: ElementRef,
  })
  inputElements!: QueryList<ElementRef>;
  @Input() inputs = 1;
  @Input() label!: string;
  onChange = (data: any[]) => {};
  onTouched = () => {};
  @Input() placeholders!: string[];
  @Input() size: 'small' | 'medium' | 'large' = 'large';
  value!: any[];

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
      this.setValue(temp);

      this.setFormGroup(temp);
      this.onChange(temp);
    }
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
    if (inputs) {
      console.log('Inputs: ', inputs);

      this.value = [...inputs];
    }
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

    if (target.type == 'number') {
      temp[index] = target.valueAsNumber;
    }

    this.setValue(temp);
    this.onChange(temp);

    if (this.inputElements.get(index) != undefined) {
      const t = this.inputElements
        .filter((e) => {
          return e.nativeElement.id == 'k' + index;
        })
        .pop();
      t!.nativeElement.value = temp[index];
    }
  }

  writeValue(obj: number[]): void {
    this.setValue(obj);
    this.setFormGroup(obj);
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
    //   data['k' + i.toString()] = new FormControl(element, Validators.required);
    // }
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
}
