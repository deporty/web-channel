import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Id } from '@deporty-org/entities/general';
import { TeamEntity } from '@deporty-org/entities/teams';
import { RegisteredTeamEntity } from '@deporty-org/entities/tournaments';
import { Store } from '@ngrx/store';
import { Observable, Subscription, zip } from 'rxjs';
import { debounceTime, filter, map } from 'rxjs/operators';
import { CATEGORIES } from 'src/app/app.constants';
import { GetTeamByIdCommand } from 'src/app/features/teams/state-management/teams.commands';
import { selectTeamWithMembersById } from 'src/app/features/teams/state-management/teams.selectors';
import { GetAvailableTeamsToAddCommand } from '../../../state-management/tournaments/tournaments.actions';
import { selecRegisteredTeams } from '../../../state-management/tournaments/tournaments.selector';

@Component({
  selector: 'app-add-team-to-group-card',
  templateUrl: './add-team-to-group-card.component.html',
  styleUrls: ['./add-team-to-group-card.component.scss'],
})
export class AddTeamToGroupCardComponent implements OnInit, OnDestroy {
  $availableTeamsToAdd!: Observable<RegisteredTeamEntity[] | undefined>;
  $availableTeamsToAddSubcription!: Subscription;
  _teams!: TeamEntity[];
  categories = CATEGORIES;
  category: any;
  formControl: UntypedFormControl;
  formGroup: FormGroup;
  @Output() onSelectTeam: EventEmitter<TeamEntity[]>;
  selectedTeams: TeamEntity[];
  @Input() showButton = true;
  @Input() teams!: TeamEntity[];
  @Input() tournamentId!: Id;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddTeamToGroupCardComponent>,
    private store: Store<any>
  ) {
    this.formControl = new UntypedFormControl();
    this.selectedTeams = [];
    this.onSelectTeam = new EventEmitter();
    this.formGroup = new FormGroup({
      name: new FormControl('', [Validators.required]),
      category: new FormControl(),
      member: new FormControl(),
    });
  }

  ngOnDestroy(): void {
    this.$availableTeamsToAddSubcription?.unsubscribe();
  }

  ngOnInit(): void {
    this.$availableTeamsToAdd = this.store.select(selecRegisteredTeams);

    this.$availableTeamsToAddSubcription = this.$availableTeamsToAdd.subscribe(
      (registeredTeams) => {
        if (registeredTeams) {
          const $teams = [];
          for (const t of registeredTeams) {
            this.store.dispatch(GetTeamByIdCommand({ teamId: t.teamId }));
            $teams.push(
              this.store.select(selectTeamWithMembersById(t.teamId)).pipe(
                filter((x) => !!x),
                map((x) => x.team)
              )
            );
          }
          if ($teams.length > 0)
            zip(...$teams).subscribe((data) => {
              this._teams = data;
            });
        }
      }
    );

    this.formGroup.valueChanges.pipe(debounceTime(500)).subscribe((val) => {
      const value = val;

      this.store.dispatch(
        GetAvailableTeamsToAddCommand({
          tournamentId: this.tournamentId,
          category: value.category,
          member: value.member,
          name: value.name,
        })
      );
    });

    if (this.data) {
      if (this.data.tournamentId) {
        this.tournamentId = this.data.tournamentId;
      }

      if (this.data.category) {
        this.category = this.data.category;
      }
    }
  }

  optionSelected(team: TeamEntity) {
    const index = this.selectedTeams.indexOf(team);
    if (index >= 0) {
      this.selectedTeams.splice(index, 1);
    } else {
      this.selectedTeams.push(team);
    }
    this.onSelectTeam.emit(this.selectedTeams);
  }

  remove(player: TeamEntity) {
    const index = this.selectedTeams.indexOf(player);
    if (index >= 0) {
      this.selectedTeams.splice(index, 1);
      this.onSelectTeam.emit(this.selectedTeams);
    }
  }

  sendData() {
    this.dialogRef.close(this.selectedTeams);
  }
}
