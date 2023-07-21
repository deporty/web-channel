import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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
  selector: 'app-create-fixture-stage',
  templateUrl: './create-fixture-stage.component.html',
  styleUrls: ['./create-fixture-stage.component.scss'],
})
export class CreateFixtureStageComponent {
  static route = 'create-fixture-stage';

  options = ['Primera', 'Segunda', 'Tercera', 'Cuarta', 'Quinta', 'Sexta'];
  statusList = TOURNAMENT_STATUS_CODES;
  formGroup;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CreateFixtureStageComponent>
  ) {
    this.formGroup = new FormGroup({
      order: new FormControl(),
    });
  }

  createTournament() {
    const value = this.formGroup.value;
    if (this.formGroup.valid) {
      this.dialogRef.close(value.order);
    }
  }
}
