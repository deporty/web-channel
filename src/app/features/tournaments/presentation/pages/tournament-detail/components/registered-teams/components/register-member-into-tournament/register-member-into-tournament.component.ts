import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import {
  Id,
  MemberDescriptionType,
  MemberEntity,
  TournamentEntity,
} from '@deporty-org/entities';
import { TournamentLayoutEntity } from '@deporty-org/entities/organizations';
import { Store } from '@ngrx/store';
import { Subscription, zip } from 'rxjs';
import { filter } from 'rxjs/operators';
import AppState from 'src/app/app.state';
import { GetTeamsMembersCommand } from 'src/app/features/teams/state-management/teams.commands';
import { selectTeamMembersByTeamId } from 'src/app/features/teams/state-management/teams.selectors';
import { GetTournamentByIdCommand } from 'src/app/features/tournaments/state-management/tournaments/tournaments.actions';
import { selectTournamentById } from 'src/app/features/tournaments/state-management/tournaments/tournaments.selector';
import { GetUsersByIdsCommand } from 'src/app/features/users/state-management/users.commands';
import { selectUsersById } from 'src/app/features/users/state-management/users.selector';

@Component({
  selector: 'app-register-member-into-tournament',
  templateUrl: './register-member-into-tournament.component.html',
  styleUrls: ['./register-member-into-tournament.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterMemberIntoTournamentComponent
  implements OnInit, OnDestroy
{
  tournamentLayout!: TournamentLayoutEntity;
  tournament!: TournamentEntity;
  registeredMembers!: MemberEntity[];
  teamId!: Id;

  teamMembers?: MemberDescriptionType[];
  teamSuscription?: Subscription;
  suscription?: Subscription;
  fullMembers?: MemberDescriptionType[];
  noRegisteredTeams?: MemberDescriptionType[];
  tournamentId!: Id;

  constructor(
    private store: Store<AppState>,

    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private cd: ChangeDetectorRef
  ) {}
  ngOnDestroy(): void {
    this.teamSuscription?.unsubscribe();
  }
  ngOnInit(): void {
    if (this.data) {
      this.tournamentLayout = this.data.tournamentLayout;
      this.tournamentId = this.data.tournamentId;
      this.registeredMembers = this.data.registeredMembers;
      this.teamId = this.data.teamId;

      const ids = this.registeredMembers.map((member) => member.userId);

      this.store.dispatch(
        GetTeamsMembersCommand({
          teamId: this.teamId,
        })
      );
      this.store.dispatch(
        GetTournamentByIdCommand({
          tournamentId: this.tournamentId,
        })
      );

      this.teamSuscription = zip(
        this.store.select(selectTeamMembersByTeamId(this.teamId)),
        this.store.select(selectTournamentById(this.tournamentId))
      )
        .pipe(
          filter(([teams, tournament]) => {
            console.log(teams,tournament);
            
            return !!tournament && !!teams;
          })
        )
        .subscribe(
          ([teams, tournament]: [
            MemberDescriptionType[],
            TournamentEntity | undefined
          ]) => {
            this.teamMembers = teams;
            this.tournament = tournament!;

            this.noRegisteredTeams = [];

            for (const teamMember of this.teamMembers) {
              const found = this.registeredMembers.find(
                (member) => member.id === teamMember.member.id
              );

              if (!found) {
                this.noRegisteredTeams.push(teamMember);
              }
            }

            console.log(this.noRegisteredTeams);
            this.cd.detectChanges();
            
          }
        );
      // this.store.dispatch(
      //   GetUsersByIdsCommand({
      //     ids,
      //   })
      // );

      // this.suscription = this.store
      //   .select(selectUsersById(ids))
      //   .subscribe((users) => {
      //     this.fullMembers = [];
      //     for (const user of users) {
      //       if (user) {
      //         const v = this.members?.find(
      //           (member) => member.userId === user.id
      //         );

      //         this.fullMembers?.push({
      //           member: v!,
      //           user,
      //         });
      //       }
      //     }
      //     this.cd.detectChanges();
      //   });
    }
  }
}
