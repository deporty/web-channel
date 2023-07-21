import { Component, OnInit } from '@angular/core';
import { REGISTERED_TEAM_STATUS_CODES } from 'src/app/app.constants';

@Component({
  selector: 'app-how-to-register-a-team-into-tournament',
  templateUrl: './how-to-register-a-team-into-tournament.component.html',
  styleUrls: ['./how-to-register-a-team-into-tournament.component.scss']
})
export class HowToRegisterATeamIntoTournamentComponent implements OnInit {

  statusList = REGISTERED_TEAM_STATUS_CODES;

  static route = 'how-to-register-a-team-into-tournament'
  constructor() { }

  ngOnInit(): void {
  }

}
