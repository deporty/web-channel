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
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CategoryType, TeamEntity } from '@deporty-org/entities/teams';
import { CATEGORIES } from 'src/app/app.constants';
import { Store } from '@ngrx/store';
import { GetAvailableTeamsToAddCommand } from '../../../state-management/tournaments/tournaments.actions';
import { Id } from '@deporty-org/entities/general';
import { selectAvailablesTeamsToAdd } from '../../../state-management/tournaments/tournaments.selector';

@Component({
  selector: 'app-add-team-card',
  templateUrl: './add-team-card.component.html',
  styleUrls: ['./add-team-card.component.scss'],
})
export class AddTeamCardComponent implements OnInit, OnDestroy {
  formControl: UntypedFormControl;
  selectedTeams: TeamEntity[];

  @Input() teams!: TeamEntity[];
  @Input() showButton = true;
  @Input() tournamentId!: Id;

  _teams!: TeamEntity[];
  formGroup: FormGroup;
  categories = CATEGORIES;
  $availableTeamsToAdd!: Observable<TeamEntity[] | undefined>;

  @Output() onSelectTeam: EventEmitter<TeamEntity[]>;
  category!: CategoryType;
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddTeamCardComponent>,
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
  ngOnDestroy(): void {}

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
  ngOnInit(): void {
    this.$availableTeamsToAdd = this.store.select(selectAvailablesTeamsToAdd);

    this.$availableTeamsToAdd.subscribe((teams) => {
      
      if (teams) this._teams = teams;
    });

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
        if (this.category != 'Open') {
          this.formGroup.get('category')?.setValue(this.category);
        }
      }
    }
    
  }
}
