import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  MemberDescriptionType,
  RegisteredTeamEntity,
  TeamEntity,
  UserEntity,
} from '@deporty-org/entities';
import {
  RequiredDocConfig,
  TournamentLayoutEntity,
} from '@deporty-org/entities/organizations';
import { Store } from '@ngrx/store';
import { Observable, Subscription, of, zip } from 'rxjs';
import { first, map, mergeMap } from 'rxjs/operators';
import AppState from 'src/app/app.state';
import { ExternalResourcePipe } from 'src/app/core/pipes/external-resource/external-resource.pipe';
import { selectTeamById } from 'src/app/features/teams/state-management/teams.selectors';
import { GetUserInRegisteredMemberCommand } from 'src/app/features/tournaments/state-management/tournaments/tournaments.actions';
import { selecRegisteredMembersByTeam } from 'src/app/features/tournaments/state-management/tournaments/tournaments.selector';
import { selectUserById } from 'src/app/features/users/state-management/users.selector';

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
  requiredDocsData: {
    [docId: string]: RequiredDocConfig;
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<AppState>,
    private externalResourcePipe: ExternalResourcePipe
  ) {
    this.requiredDocsData = {};
    this.membersObj = {};
    this.readyMembers = 0;
    this.percent = 0;
  }
  ngOnDestroy(): void {
    this.teamSubscription?.unsubscribe();
    this.membersSubscription?.unsubscribe();
  }

  download(url: string): void {
    console.log(url, 123);
    const fullPath = this.externalResourcePipe.transform(url);
    var link = document.createElement('a');
    link.href = fullPath;
    link.target = '_blank';
    link.download = 'documento.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
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
      for (var memberId in registeredTeam.requiredDocs.members) {
        const memberData = registeredTeam.requiredDocs.members[memberId];
        const registeredDocs = Object.keys(memberData).length;

        const isCompleted = registeredDocs == docsForPlayers;
        if (isCompleted) {
          full++;
        }
      }
      this.readyMembers = full;
      this.percent = (this.readyMembers / registeredTeam.members.length) * 100;
    }
  }
  isImage(path: string): boolean {
    return !path.includes('.pdf');
  }
  ngOnInit(): void {
    this.registeredTeam = this.data.registeredTeam;
    this.tournamentLayout = this.data.tournamentLayout;
    this.setStatus(this.tournamentLayout!, this.registeredTeam!);
    this.requiredDocsData = this.tournamentLayout?.requiredDocsConfig?.reduce(
      (prev: any, curr) => {
        prev[curr.identifier] = curr;
        return prev;
      },
      {}
    );

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
      .select(selecRegisteredMembersByTeam(this.registeredTeam?.teamId!))

      .pipe(
        mergeMap((members) => {
          const response: Observable<MemberDescriptionType>[] = [];
          if (members) {
            for (const member of members) {
              response.push(
                this.store.select(selectUserById(member.userId)).pipe(
                  first((user) => {
                    return !!user;
                  }),
                  map((user: UserEntity) => {
                    return {
                      member,
                      user,
                    } as MemberDescriptionType;
                  })
                )
              );
            }
          }
          return response.length > 0 ? zip(...response) : of([]);
        })
      )
      .subscribe((members: MemberDescriptionType[]) => {
        if (members) {
          this.members = members;
          for (const memberDescription of this.members) {
            this.membersObj[memberDescription.member.id!] = memberDescription;
          }
        }
      });

    this.store.dispatch(
      GetUserInRegisteredMemberCommand({
        teamId: this.registeredTeam?.teamId!,
      })
    );

    if (this.registeredTeam && this.registeredTeam.requiredDocs) {
      this.playersRequiredDocs = Object.entries(
        this.registeredTeam.requiredDocs['members']
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
      console.log(this.teamRequiredDocs);
    }
  }
}
