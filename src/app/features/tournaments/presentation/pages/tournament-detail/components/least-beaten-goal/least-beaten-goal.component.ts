import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Id } from '@deporty-org/entities';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import AppState from 'src/app/app.state';
import { GetTeamByIdCommand } from 'src/app/features/teams/state-management/teams.commands';
import { selectTeamById } from 'src/app/features/teams/state-management/teams.selectors';
import { GetLessDefeatedFenceByTournametIdCommand } from 'src/app/features/tournaments/state-management/tournaments/tournaments.actions';
import { selectLessDefeatedFence } from 'src/app/features/tournaments/state-management/tournaments/tournaments.selector';


export interface StadisticResume {
  goals: number;
  teamId: Id;
  ammountOfMatches: number;
  average: number;
}


@Component({
  selector: 'app-least-beaten-goal',
  templateUrl: './least-beaten-goal.component.html',
  styleUrls: ['./least-beaten-goal.component.scss']
})
export class LeastBeatenGoalComponent implements OnInit {

  $lessDefeatedFence!: Observable<StadisticResume[] | undefined>;
  lessDefeatedFenceSubscription!: Subscription;
  lessDefeatedFence!: StadisticResume[];
  tournamentId!: string;

  length = 0;
  pageSize = 5;
  pageSizeOptions: number[] = [5];
  currentItems!: StadisticResume[];
  paginatedItems!: any[];

  teams: {
    [id: Id]: Observable<any | undefined>;
  } = {};

  constructor(private store: Store<AppState>) {}

  ngOnDestroy(): void {
    this.lessDefeatedFenceSubscription?.unsubscribe();
  }

  onPage(event: PageEvent) {
    if (event.pageIndex < this.paginatedItems.length) {
      this.currentItems = this.paginatedItems[event.pageIndex];


      for (const item of this.currentItems) {
       

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
  ngOnInit(): void {
    
    this.$lessDefeatedFence = this.store.select(selectLessDefeatedFence(this.tournamentId));

    if (this.tournamentId) {
      this.store.dispatch(
        GetLessDefeatedFenceByTournametIdCommand({
          tournamentId: this.tournamentId,
        })
      );
    }

    this.$lessDefeatedFence.subscribe((markersTable: any[] | undefined) => {

      console.log('LDF ', markersTable);
      
      if (markersTable) {
        this.lessDefeatedFence = JSON.parse(JSON.stringify(markersTable));


        this.currentItems = [];
        this.length = this.lessDefeatedFence.length;
        let i = 1;
        this.paginatedItems = [];
        let temp = [];

        for (const match of this.lessDefeatedFence) {
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
