import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Id } from '@deporty-org/entities/general';
import { MemberDescriptionType, TeamEntity } from '@deporty-org/entities/teams';
import { UserEntity } from '@deporty-org/entities/users';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import AppState from 'src/app/app.state';
import { GetMemberByIdCommand, GetTeamByIdCommand } from 'src/app/features/teams/state-management/teams.commands';
import { selectMemberById, selectTeamById } from 'src/app/features/teams/state-management/teams.selectors';
import { GetMarkersTableCommand } from 'src/app/features/tournaments/state-management/tournaments/tournaments.actions';
import { selectMarkersTable } from 'src/app/features/tournaments/state-management/tournaments/tournaments.selector';
import { GetUserByIdCommand } from 'src/app/features/users/state-management/users.commands';
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
          this.users[item.memberId] = this.store.select(
            selectMemberById(item.teamId,item.memberId)
          );
          this.store.dispatch(
            GetMemberByIdCommand({
              memberId: item.memberId,
              teamId: item.teamId
            })
          );
        }

        if (!this.teams[item.teamId]) {
          this.teams[item.teamId] = this.store.select(
            selectTeamById(item.teamId)
          );

          this.store.dispatch(
            GetTeamByIdCommand({
              teamId: item.teamId,
            })
          );
        }
      }
    }
  }
  getUser(id: Id) {}
  ngOnInit(): void {
    
    this.$markersTable = this.store.select(selectMarkersTable);

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
