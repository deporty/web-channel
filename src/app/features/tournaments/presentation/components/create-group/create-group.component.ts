import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TeamEntity } from '@deporty-org/entities/teams';
import { GROUP_LETTERS } from '../components.constants';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss'],
})
export class CreateGroupComponent implements OnInit {
  letters: string[];
  selectedTeams: TeamEntity[];
  labelFormControl: UntypedFormControl;
  orderFormControl: UntypedFormControl;

  @Input() teams!: TeamEntity[];
  _teams!: TeamEntity[];

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateGroupComponent>
  ) {
    this.letters = GROUP_LETTERS;
    this.selectedTeams = [];
    this.labelFormControl = new UntypedFormControl('');
    this.orderFormControl = new UntypedFormControl('');
  }
  ngOnInit(): void {
    if (this.data) {
      this._teams = this.data.teams;
    } else {
      this._teams = this.teams;
    }
  }

  sendData() {
    const value = {
      teams: this.selectedTeams || [],
      groupLabel: this.labelFormControl.value,
      groupOrder: GROUP_LETTERS.indexOf(this.labelFormControl.value) 
    };
    this.dialogRef.close(value);
  }

  onSelectTeam(teams: TeamEntity[]) {
    this.selectedTeams = teams;
  }
  // optionSelected(label: string) {
  //   const index = this.selectedTeams.indexOf(label);
  //   if (index >= 0) {
  //     this.selectedTeams.splice(index, 1);
  //   } else {
  //     this.selectedTeams.push(label);
  //   }
  // }

  onSelectedGroups() {}
}
