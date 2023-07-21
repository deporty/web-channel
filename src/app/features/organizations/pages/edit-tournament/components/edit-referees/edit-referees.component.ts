import { Component, Inject, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Id, LocationEntity, UserEntity } from '@deporty-org/entities';
import { Store } from '@ngrx/store';
import { Observable, zip } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { REFEREE_ROLE, TOURNAMENT_STATUS_CODES } from 'src/app/app.constants';
import AppState from 'src/app/app.state';
import {
  DEFAULT_POSITION,
  getCurrentGeolocation,
} from 'src/app/core/helpers/log-events.helper';
import {
  GetUserByIdCommand,
  GetUsersByFiltersCommand,
} from 'src/app/features/users/state-management/users.commands';
import {
  selectUserById,
  selectUsersByFilters,
} from 'src/app/features/users/state-management/users.selector';

@Component({
  selector: 'app-edit-referees',
  templateUrl: './edit-referees.component.html',
  styleUrls: ['./edit-referees.component.scss'],
})
export class EditRefereesComponent implements OnInit {
  statusList = TOURNAMENT_STATUS_CODES;
  values: Id[];

  currentReferees!: Id[];
  currentFullReferees: UserEntity[];
  fullReferees: UserEntity[];

  selectedPositions!: LocationEntity[];

  formGroup: FormGroup;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditRefereesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<AppState>
  ) {
    this.values = [];
    this.fullReferees = [];
    this.currentFullReferees = [];
    this.formGroup = new FormGroup({
      roles: new FormControl([REFEREE_ROLE]),
      firstName: new FormControl(''),
      firstLastName: new FormControl(''),
      secondName: new FormControl(''),
      secondLastName: new FormControl(''),
    });

    this.formGroup.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
      this.store.dispatch(
        GetUsersByFiltersCommand({
          roles: [value.roles],
          firstName: value.firstName,
          firstLastName: value.firstLastName,
          secondName: value.secondName,
          secondLastName: value.secondLastName,
        })
      );

      this.store
        .select(
          selectUsersByFilters(
            value.roles,
            value.firstName,
            value.firstLastName,
            value.secondName,
            value.secondLastName
          )
        )
        .subscribe((d) => {
          const temp: string[] = [];
          const temp2: UserEntity[] = [];
          for (const iterator of d) {
            if (!temp.includes(iterator.id!)) {
              temp2.push(iterator);
              temp.push(iterator.id!);
            }
          }

          this.fullReferees = [...this.currentFullReferees, ...temp2];
        });
    });
  }

  ngOnInit(): void {
    if (this.data.currentReferees && this.data.currentReferees.length > 0) {
      this.currentReferees = this.data.currentReferees;
      this.values = this.currentReferees;
      this.fullReferees = [];
    } else {
      this.currentReferees = [];
    }

    const data = [];
    for (const ref of this.currentReferees) {
      this.store.dispatch(
        GetUserByIdCommand({
          id: ref,
        })
      );
      data.push(
        this.store.select(selectUserById(ref)).pipe(filter((x) => !!x))
      );
    }
    if (data.length > 0) {
      zip(...data).subscribe((data) => {
        this.fullReferees = data;
        this.currentFullReferees = data;
      });
    }
  }

  onChange() {}
  close() {
    this.dialogRef.close(this.values);
  }
}
