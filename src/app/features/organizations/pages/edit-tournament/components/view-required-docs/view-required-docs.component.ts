import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  MemberDescriptionType,
  RegisteredTeamEntity,
  TeamEntity,
} from '@deporty-org/entities';
import { TournamentLayoutEntity } from '@deporty-org/entities/organizations';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import AppState from 'src/app/app.state';
import { GetTeamsMembersCommand } from 'src/app/features/teams/state-management/teams.commands';
import {
  selectTeamById,
  selectTeamMembersByTeamId,
} from 'src/app/features/teams/state-management/teams.selectors';

@Component({
  selector: 'app-view-required-docs',
  templateUrl: './view-required-docs.component.html',
  styleUrls: ['./view-required-docs.component.scss'],
})
export class ViewRequiredDocsComponent implements OnInit, OnDestroy {
  registeredTeam?: RegisteredTeamEntity;
  tournamentLayout?: TournamentLayoutEntity;
  playersRequiredDocs: any = {};
  playersRequiredDocsCount: number = 0;
  teamSubscription?: Subscription;
  membersSubscription?: Subscription;
  team?: TeamEntity;
  members?: MemberDescriptionType[];
  membersObj: { [memberId: string]: MemberDescriptionType };
  teamRequiredDocs?: { [docId: string]: string }[];
  readyMembers: number;
  percent: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<AppState>
  ) {
    this.membersObj = {};
    this.readyMembers = 0;
    this.percent = 0;
  }
  ngOnDestroy(): void {
    this.teamSubscription?.unsubscribe();
    this.membersSubscription?.unsubscribe();
  }

  setStatus(
    tournamentLayout: TournamentLayoutEntity,
    registeredTeam: RegisteredTeamEntity
  ) {
    var full = 0;
    if (registeredTeam.requiredDocs) {
      const docsForPlayers = tournamentLayout.requiredDocsConfig?.filter(
        (doc) => doc.applyTo == 'player'
      ).length;
      for (var memberId in registeredTeam.requiredDocs.players) {
        const memberData = registeredTeam.requiredDocs.players[memberId];
        const registeredDocs = Object.keys(memberData).length;

        const isCompleted = registeredDocs == docsForPlayers;
        if (isCompleted) {
          full++;
        }
      }
      this.readyMembers = full;
      this.percent = (this.readyMembers / registeredTeam.members.length) * 100;
      console.log('Ready ', this.readyMembers);
      console.log('All Members ', registeredTeam.members.length);
      console.log('Percent ', this.percent);
    }
  }
  ngOnInit(): void {
    this.registeredTeam = this.data.registeredTeam;
    this.tournamentLayout = this.data.tournamentLayout;
    this.setStatus(this.tournamentLayout!, this.registeredTeam!);
    console.log('La vida es buena ');
    console.log(this.registeredTeam);

    this.playersRequiredDocsCount =
      this.tournamentLayout?.requiredDocsConfig?.filter(
        (x) => x.applyTo == 'player'
      ).length || 0;

    this.teamSubscription = this.store
      .select(selectTeamById(this.registeredTeam?.teamId!))
      .subscribe((team) => {
        this.team = team;
      });
    this.membersSubscription = this.store
      .select(selectTeamMembersByTeamId(this.registeredTeam?.teamId!))
      .subscribe((members) => {
        if (members) {
          this.members = members;
          for (const memberDescription of this.members) {
            this.membersObj[memberDescription.member.id!] = memberDescription;
          }
        }
      });

    this.store.dispatch(
      GetTeamsMembersCommand({
        teamId: this.registeredTeam?.teamId!,
      })
    );

    if (this.registeredTeam && this.registeredTeam.requiredDocs) {
      this.playersRequiredDocs = Object.entries(
        this.registeredTeam.requiredDocs['players']
      ).reduce((prev: any, curr) => {
        prev[curr[0]] = Object.entries(curr[1]).map(([docId, path]) => {
          return {
            docId,
            path,
          };
        });
        return prev;
      }, {});
      this.teamRequiredDocs = Object.entries(
        this.registeredTeam.requiredDocs['team']
      ).map(([docId, path]) => {
        return {
          docId: docId,
          path,
        };
      });

      console.log(this.playersRequiredDocs);
    }
  }
}
