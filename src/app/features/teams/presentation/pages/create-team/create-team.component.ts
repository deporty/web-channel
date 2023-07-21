import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IBaseResponse } from '@deporty-org/entities/general';
import { IPlayerModel } from '@deporty-org/entities/players';
import { Observable, Subscription } from 'rxjs';
import { MemberEntity, TeamEntity } from '@deporty-org/entities/teams';

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.scss'],
})
export class CreateTeamComponent implements OnInit {
  static route = 'create-team';
  data = {
    audio: 'assets/athem.ogg',
    image: 'assets/general.png',
  };

  isEditable = false;

  formGroup: UntypedFormGroup;

  $players!: Observable<IBaseResponse<IPlayerModel[]>>;
  $playersSubscription!: Subscription;
  players!: IPlayerModel[];

  selectedPlayers: IPlayerModel[];

  membersFormControl: UntypedFormControl;
  status!: string;
  constructor(
    private _snackBar: MatSnackBar,
    private router: Router,
  ) {
    this.selectedPlayers = [];

    this.membersFormControl = new UntypedFormControl();

    this.formGroup = new UntypedFormGroup({
      name: new UntypedFormControl(''),
      athem: new UntypedFormControl(''),
      shield: new UntypedFormControl(''),
      members: new UntypedFormControl([]),
      agent: new UntypedFormControl(''),
    });
  }

  createTeam() {
    const value: TeamEntity = this.formGroup.value;
    const members = this.selectedPlayers.map((x: IPlayerModel) => {
      return {
        initDate: new Date(),
        userId: x.id
      } as MemberEntity;
    });
    this.status = 'Pending';

  }

  onSelectedFile($event: any) {
    this.formGroup.get('shield')?.setValue($event.url);
  }
  optionSelected(player: IPlayerModel) {
    const index = this.selectedPlayers.indexOf(player);
    if (index >= 0) {
      this.selectedPlayers.splice(index, 1);
    } else {
      this.selectedPlayers.push(player);
    }
  }
  remove(player: IPlayerModel) {
    const index = this.selectedPlayers.indexOf(player);
    if (index >= 0) {
      this.selectedPlayers.splice(index, 1);
    }
  }

  getPlayerRepr(player: IPlayerModel) {
    return `${player.firstName} ${player.secondName} ${player.firstLastName} ${player.secondLastName}`;
  }
  ngOnInit(): void {
  }
}
