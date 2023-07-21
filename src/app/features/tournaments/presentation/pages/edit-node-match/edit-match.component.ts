import { Location } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { LocationEntity } from '@deporty-org/entities/locations';
import { NodeMatchEntity } from '@deporty-org/entities/tournaments';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import AppState from 'src/app/app.state';
import { RESOURCES_PERMISSIONS_IT } from 'src/app/init-app';
import { TournamentAdapter } from '../../../adapters/tournament.adapter';
import {
  GetNodeMatchCommand
} from '../../../state-management/tournaments/tournaments.actions';
import { selectCurrentNodeMatch } from '../../../state-management/tournaments/tournaments.selector';


@Component({
  selector: 'app-edit-match-group',
  templateUrl: './edit-match.component.html',
  styleUrls: ['./edit-match.component.scss'],
})
export class EditNodeMatchComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  static route = 'edit-node-match';

  meta!: any;

  match!: NodeMatchEntity;

  nodeMatchId!: string;
  tournamentId!: string;

  locations: Array<LocationEntity>;

  $selectMatch: Observable<NodeMatchEntity | undefined>;
  groupLabel: any;
  date: Date | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private tournamentAdapter: TournamentAdapter,
    private location: Location,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef,

    @Inject(RESOURCES_PERMISSIONS_IT) private resourcesPermissions: string[],
    private store: Store<AppState>
  ) {
    this.$selectMatch = this.store.select(selectCurrentNodeMatch);

    this.locations = [];
  }
  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((x) => {
      this.nodeMatchId = x.nodeMatchId;
      this.tournamentId = x.tournamentId;

      this.meta = {
        tournamentId: this.tournamentId,
        nodeMatchId: this.nodeMatchId,
      };

      this.store.dispatch(
        GetNodeMatchCommand({
          tournamentId: this.tournamentId,
          nodeMatchId: this.nodeMatchId,
        })
      );

      this.$selectMatch.subscribe((x) => {
        if (x) {
          this.match = JSON.parse(JSON.stringify(x));
        }
      });

      this.locations = JSON.parse(x.locations);
    });
  }

  saveData(data: any) {
    if (this.match) {
      this.tournamentAdapter
        .editNodeMatch(this.tournamentId, {
          ...this.match,
          ...data.match,
        })
        .subscribe((x) => {});
    }
  }
}
