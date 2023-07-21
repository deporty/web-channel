import { formatDate } from '@angular/common';
import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TeamEntity } from '@deporty-org/entities/teams';
import { MatchEntity } from '@deporty-org/entities/tournaments';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-match-card',
  templateUrl: './add-match-card.component.html',
  styleUrls: ['./add-match-card.component.scss'],
})
export class AddMatchCardComponent implements OnInit {
  formGroup!: UntypedFormGroup;

  @Input() teams!: TeamEntity[];
  @Input() match!: MatchEntity;

  _teams!: TeamEntity[];

  teamA!: TeamEntity;
  teamB!: TeamEntity;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddMatchCardComponent>
  ) {}
  optionSelected(key: string, team: TeamEntity) {
    if (key == 'teamB') {
      this.teamB = team;
    } else {
      this.teamA = team;
    }
  }

  save() {
    const value = this.formGroup.value;
    value['teamB'] = this.teamB;
    value['teamA'] = this.teamA;
    const isValid = this.formGroup.valid;
    if (isValid) {
      this.dialogRef.close(value);
    }
  }

  ngOnInit(): void {
    if (this.data) {
      if (this.data.teams instanceof Observable) {
        this.data.teams.subscribe((t: TeamEntity[]) => {
          this._teams = t;
          
        });
      } else {
        this._teams = this.data.teams;
      }
    } else {
      this._teams = this.teams;
    }


    this.formGroup = new UntypedFormGroup({
      teamA: new UntypedFormControl(),
      teamB: new UntypedFormControl(),
      date: new UntypedFormControl(
    
      ),
    });
  }
}
