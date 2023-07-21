import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import {
  FixtureStageEntity,
  Id,
  TeamEntity,
  TournamentEntity,
} from '@deporty-org/entities';
import { TournamentLayoutEntity } from '@deporty-org/entities/organizations';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { TOURNAMENT_STATUS_CODES } from 'src/app/app.constants';

@Component({
  selector: 'app-change-tournament-status',
  templateUrl: './change-tournament-status.component.html',
  styleUrls: ['./change-tournament-status.component.scss'],
})
export class ChangeTournamentStatusComponent implements OnInit {
  static route = 'change-tournament-status';

  statusList = TOURNAMENT_STATUS_CODES;

  status = new FormControl();
  currentStatus?: string;
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ChangeTournamentStatusComponent>,
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
    return this.statusList.filter((x) => x.value === this.currentStatus).pop()
      ?.display;
  }
}
