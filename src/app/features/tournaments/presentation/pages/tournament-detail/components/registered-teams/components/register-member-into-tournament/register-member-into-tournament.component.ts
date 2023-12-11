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
import { MatDialog } from '@angular/material/dialog';
import {
  Id,
  MemberDescriptionType,
  MemberEntity,
  TournamentEntity,
} from '@deporty-org/entities';
import {
  RequiredDocConfig,
  TournamentLayoutEntity,
} from '@deporty-org/entities/organizations';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, zip } from 'rxjs';
import { filter } from 'rxjs/operators';
import AppState from 'src/app/app.state';
import { admingPopUpInComponent, getTransactionIdentifier } from 'src/app/core/helpers/general.helpers';
import { GetTeamsMembersCommand } from 'src/app/features/teams/state-management/teams.commands';
import { selectTeamMembersByTeamId } from 'src/app/features/teams/state-management/teams.selectors';
import { GetTournamentByIdCommand, RegisterMembersIntoATournamentCommand, TransactionResolvedEvent } from 'src/app/features/tournaments/state-management/tournaments/tournaments.actions';
import { selectTournamentById, selectTransactionById } from 'src/app/features/tournaments/state-management/tournaments/tournaments.selector';
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

  selectedUnregisteredMembers: any = {};
  selectedUnregisteredMembersDocuments: any = {};

  selectTransactionByIdSubscription!: Subscription;


  constructor(
    private store: Store<AppState>,
    private translateService: TranslateService,
    public dialog: MatDialog,

    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private cd: ChangeDetectorRef
  ) {}
  ngOnDestroy(): void {
    this.teamSuscription?.unsubscribe();
  }
  selectMember(item: MemberDescriptionType) {
    if (this.selectedUnregisteredMembers[item.member.id!]) {
      delete this.selectedUnregisteredMembers[item.member.id!];
    } else {
      this.selectedUnregisteredMembers[item.member.id!] = true;
      if (!this.selectedUnregisteredMembersDocuments[item.member.id!]) {
        this.selectedUnregisteredMembersDocuments[item.member.id!] = {};
      }
    }
  }
  onSelectedFile(
    data: any,
    fullMember: MemberDescriptionType,
    rd: RequiredDocConfig
  ) {
    this.selectedUnregisteredMembersDocuments[fullMember.member.id!][
      rd.identifier
    ] = data.url;
    this.cd.detectChanges();
  }

  onSave() {
    const keys = Object.keys(this.selectedUnregisteredMembers);
    const params = keys.map((memberId) => {
      return {
        teamId: this.teamId,
        memberId: memberId,
        tournamentId: this.tournamentId,
        tournamentLayoutId: this.tournamentLayout.id,
        organizationId: this.tournamentLayout.organizationId,
        requiredDocs: this.selectedUnregisteredMembersDocuments[memberId],
      };
    });
    
    
    const transactionId = getTransactionIdentifier(params);


    this.store.dispatch(
      RegisterMembersIntoATournamentCommand({
        inscriptions: params,
        transactionId: transactionId
      })
    );

    this.selectTransactionByIdSubscription = admingPopUpInComponent({
      dialog: this.dialog,
      store: this.store,
      TransactionDeletedEvent: TransactionResolvedEvent,
      selectTransactionById: selectTransactionById,
      transactionId,
      translateService: this.translateService,
    });



  }
  ngOnInit(): void {
    if (this.data) {
      this.tournamentLayout = this.data.tournamentLayout;
      this.tournamentId = this.data.tournamentId;
      this.registeredMembers = this.data.registeredMembers;
      this.teamId = this.data.teamId;

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
