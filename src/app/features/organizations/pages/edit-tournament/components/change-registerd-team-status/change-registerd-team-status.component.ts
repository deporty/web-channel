import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { REGISTERED_TEAM_STATUS_CODES } from 'src/app/app.constants';

@Component({
  selector: 'app-change-registerd-team-status',
  templateUrl: './change-registerd-team-status.component.html',
  styleUrls: ['./change-registerd-team-status.component.scss'],
})
export class ChangeRegisteredTeamStatusComponent implements OnInit {

  statusList = REGISTERED_TEAM_STATUS_CODES;

  status = new FormControl();
  currentStatus?: string;
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ChangeRegisteredTeamStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {
    this.currentStatus = this.data.currentStatus;
    this.status.setValue(this.currentStatus);
  }

  close() {
    this.dialogRef.close(this.status.value);
  }

  getDisplayStatus() {
    if (!this.currentStatus) {
      return '';
    }
    return this.statusList.filter((x) => x.name === this.currentStatus).pop()
      ?.display;
  }
}
