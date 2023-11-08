import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { TeamEntity } from '@deporty-org/entities';
import {
  IntergroupMatchEntity,
  NodeMatchEntity,
} from '@deporty-org/entities/tournaments';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MAIN_DRAW_KEYS, MAIN_DRAW_PHASES } from 'src/app/app.constants';
import AppState from 'src/app/app.state';
import { RESOURCES_PERMISSIONS_IT } from 'src/app/init-app';

@Component({
  selector: 'app-add-node-match',
  templateUrl: './add-node-match.component.html',
  styleUrls: ['./add-node-match.component.scss'],
})
export class AddNodeMatchComponent implements OnInit, OnDestroy, AfterViewInit {
  match!: NodeMatchEntity;
  meta!: any;
  stageId!: string;
  tournamentId!: string;
  phases = MAIN_DRAW_PHASES;
  keys = MAIN_DRAW_KEYS;
  formGroup!: UntypedFormGroup;

  @Input() teams!: TeamEntity[];

  _teams!: TeamEntity[];

  teamA!: TeamEntity;
  teamB!: TeamEntity;

  constructor(
    public dialog: MatDialog,
    private cd: ChangeDetectorRef,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(RESOURCES_PERMISSIONS_IT) private resourcesPermissions: string[],
    public dialogRef: MatDialogRef<AddNodeMatchComponent>,
    private store: Store<AppState>
  ) {}

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }
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
  ngOnDestroy(): void {}

  ngOnInit(): void {
    
    if (this.data) {
      if (this.data.teams instanceof Observable) {
        this.data.teams.subscribe((t: TeamEntity[]) => {
          this._teams = t;
          console.log(this._teams, 'Equipos');

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
      key: new UntypedFormControl(),
      level: new UntypedFormControl(),
    });
  }

  saveData(data: any) {}
}
