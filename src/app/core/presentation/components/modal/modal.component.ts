import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  WARN_COLOR,
} from 'src/app/app.constants';
import { GeneralAction } from 'src/app/core/interfaces/general-action';

export const DEFAULT_CANCEL_ACTION_STYLE = {
  color: 'white',
  background: SECONDARY_COLOR,
};
export const DEFAULT_PRIMARY_ACTION_STYLE = {
  background: PRIMARY_COLOR,
};
export const DEFAULT_DANGER_ACTION_STYLE = {
  color: 'white',
  background: WARN_COLOR,
};
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  @Input() kind: 'loading' | 'text' = 'loading' ;
  @Input() status: 'error' | 'success' | 'normal' = 'normal';
  @Input() title = '';
  @Input() text = '';
  @Input() actions: GeneralAction[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModalComponent>
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.kind = this.data['kind'];
      this.title = this.data['title'];
      this.text = this.data['text'];
      this.status = this.data['status'] || this.status;
      this.actions = this.data['actions'];
    }
  }
  execute(handler?: Function) {
    if (handler) {
      handler();
    }
    this.dialogRef.close();
  }
}
