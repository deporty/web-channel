import { Component, Inject, OnChanges, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Id, LocationEntity } from '@deporty-org/entities';
import { Coordinate } from '@deporty-org/entities/locations/location.entity';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TOURNAMENT_STATUS_CODES } from 'src/app/app.constants';
import AppState from 'src/app/app.state';
import {
  DEFAULT_POSITION,
  getCurrentGeolocation,
} from 'src/app/core/helpers/log-events.helper';
import {
  ClearLocationsByRatiosCommand,
  GetLocationsByIdsCommand,
} from 'src/app/features/tournaments/state-management/locations/locations.commands';
import { GetLocationsByRatioCommand } from 'src/app/features/tournaments/state-management/locations/locations.commands';
import {
  selectLocationByIds,
  selectLocationByRatio,
} from 'src/app/features/tournaments/state-management/locations/locations.selector';

@Component({
  selector: 'app-edit-tournament-locations',
  templateUrl: './edit-tournament-locations.component.html',
  styleUrls: ['./edit-tournament-locations.component.scss'],
})
export class EditTournamentLocationsComponent implements OnInit {
  statusList = TOURNAMENT_STATUS_CODES;

  ratio = 2;
  min = 2;

  currentLocations!: Id[];
  fullLocations!: LocationEntity[];

  values!: Id[];

  $location!: Observable<any>;
  location!: Coordinate;

  positions!: LocationEntity[];
  selectedPositions!: LocationEntity[];

  $positions!: {
    title: string;
    coordinate: {
      latitude: number;
      longitude: number;
    };
  }[];
  $selectedPositions!: {
    title: string;
    coordinate: {
      latitude: number;
      longitude: number;
    };
  }[];

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditTournamentLocationsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<AppState>
  ) {
    this.values = [];
    this.$selectedPositions = [];
    this.$positions = [];
  }

  getLocalizationRep(data: LocationEntity[]) {
    if (data) {
      return data.map((x) => {
        return {
          title: x.name,
          coordinate: {
            latitude: x.coordinate?.latitude!,
            longitude: x.coordinate?.longitude!,
          },
        };
      });
    }
    return [];
  }
  formatLabel(value: number): string {
    return `${value}Km`;
  }

  addToFullLocations(data: LocationEntity[]) {
    const t: { [i: string]: LocationEntity } = {};
    if (this.positions) {
      for (const a of this.positions) {
        t[a.id] = a;
      }
    }
    if (this.selectedPositions) {
      for (const a of this.selectedPositions) {
        t[a.id] = a;
      }
    }

    this.fullLocations = Object.values(t);
  }
  ngOnInit(): void {
    this.$location = getCurrentGeolocation();
    this.$location.subscribe((data) => {
      if (data) {
        this.location = data;
      } else {
        this.location = DEFAULT_POSITION;
      }
      setTimeout(() => {
        this.onChangeRatio();
      }, 200);

      if (this.data.currentLocations.length > 0) {
        this.currentLocations = this.data.currentLocations;
        this.manageLocationById();
      } else {
        this.currentLocations = [];
      }
    });

  }

  private manageLocationById() {
    this.store.dispatch(
      GetLocationsByIdsCommand({
        ids: this.data.currentLocations,
      })
    );

    this.store
      .select(selectLocationByIds(this.data.currentLocations))
      .subscribe((data) => {
        if (data) {
          this.values = data.map((x) => x.id);
          this.selectedPositions = data;
          this.$selectedPositions = this.getLocalizationRep(data);
          this.addToFullLocations(data);
        }
      });
  }

  onChangeRatio() {
    if (this.location) {
      setTimeout(() => {
        this._onChangeRatio();
      }, 500);
    }
  }
  _onChangeRatio() {
    this.store.dispatch(
      GetLocationsByRatioCommand({
        origin: {
          latitude: this.location.latitude,
          longitude: this.location.longitude,
        },
        ratio: this.ratio * 1000,
      })
    );

    this.store
      .select(selectLocationByRatio(this.ratio * 1000))
      .subscribe((data) => {
        if (data) {
          this.positions = data.filter((x) => {
            return !this.currentLocations.includes(x.id);
          });

          this.$positions = this.getLocalizationRep(this.positions);

          this.addToFullLocations(data);
        }
      });
  }

  close() {
    
    this.dialogRef.close(this.values);
    this.store.dispatch(ClearLocationsByRatiosCommand());
  }
}
