import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Id } from '@deporty-org/entities/general';
import {
  MemberDescriptionType,
  MemberEntity,
} from '@deporty-org/entities/teams';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { filter, first, map, mergeMap } from 'rxjs/operators';
import AppState from 'src/app/app.state';
import { selectTeamById } from 'src/app/features/teams/state-management/teams.selectors';
import {
  GetMarkersTableCommand,
  GetRegisteredUserByMemberInsideTeamIdCommand,
  GetRegisteredUsersByMemberAndTeamIdsCommand,
} from 'src/app/features/tournaments/state-management/tournaments/tournaments.actions';
import {
  selecRegisteredMembersByTeamAndMemberId,
  selectMarkersTable,
} from 'src/app/features/tournaments/state-management/tournaments/tournaments.selector';
import { selectUserById } from 'src/app/features/users/state-management/users.selector';

export interface StadisticResume {
  teamId: Id;
  memberId: Id;
  goals: number;
}

@Component({
  selector: 'app-markers-table',
  templateUrl: './markers-table.component.html',
  styleUrls: ['./markers-table.component.scss'],
})
export class MarkersTableComponent implements OnInit, OnDestroy {
  $markersTable!: Observable<StadisticResume[] | undefined>;
  markersTableSubscription!: Subscription;
  markersTable!: StadisticResume[];
  tournamentId!: string;

  length = 0;
  pageSize = 5;
  pageSizeOptions: number[] = [5];
  currentItems!: StadisticResume[];
  paginatedItems!: any[];

  users: {
    [id: Id]: Observable<MemberDescriptionType | undefined>;
  } = {};
  teams: {
    [id: Id]: Observable<any | undefined>;
  } = {};

  constructor(private store: Store<AppState>) {}

  ngOnDestroy(): void {
    this.markersTableSubscription?.unsubscribe();
  }

  onPage(event: PageEvent) {
    if (event.pageIndex < this.paginatedItems.length) {
      this.currentItems = this.paginatedItems[event.pageIndex];

      for (const item of this.currentItems) {
        if (!this.users[item.memberId]) {
          this.users[item.memberId] = this.store
            .select(
              selecRegisteredMembersByTeamAndMemberId(
                item.teamId,
                item.memberId
              )
            )
            .pipe(
              filter((g) => !!g),
              mergeMap((t: MemberEntity | undefined) => {
                return this.store.select(selectUserById(t!.userId)).pipe(
                  filter((g) => !!g),

                  map((user) => {
                    return {
                      user,
                      member: t!,
                    };
                  })
                );
              }),
              first((j) => !!j)
            );
        }

        if (!this.teams[item.teamId]) {
          this.teams[item.teamId] = this.store.select(
            selectTeamById(item.teamId)
          );
        }
      }
    }
  }
  ngOnInit(): void {
    this.$markersTable = this.store
      .select(selectMarkersTable)
      .pipe(first((data) => !!data));

    if (this.tournamentId) {
      this.store.dispatch(
        GetMarkersTableCommand({
          tournamentId: this.tournamentId,
        })
      );
    }

    this.$markersTable.subscribe((v) => {
      const markersTable: any[] | undefined = v;
      if (markersTable) {
        
        
        this.markersTable = JSON.parse(JSON.stringify(markersTable));
        
        console.log(this.markersTable);
        for (const item of this.markersTable) {
          this.store.dispatch(
            GetRegisteredUserByMemberInsideTeamIdCommand({
              memberId: item.memberId,
              teamId: item.teamId,
            })
          );
        }

        this.currentItems = [];
        this.length = this.markersTable.length;
        let i = 1;
        this.paginatedItems = [];
        let temp = [];

        for (const match of this.markersTable) {
          temp.push(match);
          if (i == this.pageSize) {
            this.paginatedItems.push([...temp]);
            i = 0;
            temp = [];
          }
          i++;
        }
        if (temp.length > 0) {
          this.paginatedItems.push([...temp]);
        }
        if (this.paginatedItems.length > 0) {
          this.currentItems = this.paginatedItems[0];
        }
        this.onPage({ pageIndex: 0, length: 0, pageSize: 0 });
      }
    });
  }
}
