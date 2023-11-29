import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-number-form',
  templateUrl: './number-form.component.html',
  styleUrls: ['./number-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumberFormComponent implements OnInit, AfterViewInit {
  numberValue!: number;
  @ViewChild(MatInput) input!: MatInput;
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _bottomSheetRef: MatBottomSheetRef<NumberFormComponent>
  ) {}
  ngAfterViewInit(): void {
    this.input?.focus();
  }
  ngOnInit(): void {
    if (this.data) {
      this.numberValue = this.data['number'];
    }
  }
}
