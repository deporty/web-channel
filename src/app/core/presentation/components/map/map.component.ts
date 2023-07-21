import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { Coordinate } from '@deporty-org/entities/locations/location.entity';
import * as L from 'leaflet';
import { Marker } from 'leaflet';
import { first } from 'rxjs/operators';
import {
  DEFAULT_POSITION,
  getCurrentGeolocation,
} from 'src/app/core/helpers/log-events.helper';

export type KindMarker = 'marker' | 'my-marker' | 'setted-marker';
const SETTED_MARKER = 'assets/localization/setted-marker.png';
const MY_MARKER = 'assets/localization/my-marker.png';
const MARKER = 'assets/localization/marker.png';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit, OnChanges {
  @Input() zoom = 13;
  @Input() ratio!: number;

  @Input() positions!: { coordinate: Coordinate; title: string }[];
  @Input('selected-positions') selectedPositions!: {
    coordinate: Coordinate;
    title: string;
  }[];
  circle!: L.Circle;
  private map!: L.Map;
  center!: L.LatLngExpression;
  noSeletedMarker = MARKER;

  markers: Marker[] = [];
  extraMarkers: Marker[] = [];
  private initMap(): void {
    getCurrentGeolocation()
      .pipe(first())
      .subscribe((data) => {
        this.center = [DEFAULT_POSITION.latitude, DEFAULT_POSITION.longitude];
        if (data) {
          this.center = [data.latitude, data.longitude];
        }

        if (!this.map) {
          try {
            this.map = L.map('map', {
              center: this.center,
              zoom: this.zoom,
            });

            const tiles = L.tileLayer(
              'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
              {
                maxZoom: 18,
                minZoom: 3,
                attribution:
                  '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
              }
            );

            const marker = this.createMarker(
              {
                latitude: this.center[0],
                longitude: this.center[1],
              },
              'my-marker',
              'Tú'
            );
            marker.addTo(this.map);
            tiles.addTo(this.map);

            this.drawCircle();
          } catch (error) {
          }
        }
      });
  }

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.ratio && changes.ratio.currentValue) {
      this.drawCircle();
    }
    if (changes && changes.positions && changes.positions.currentValue) {
      this.drawPoints();
    }
    if (
      changes &&
      changes.selectedPositions &&
      changes.selectedPositions.currentValue
    ) {
      this.drawExtraPoints();
    }
  }
  drawPoints() {
    if (this.map) {
      for (const mark of this.markers) {
        mark.remove();
      }
      this.markers = [];
      for (const pos of this.positions) {
        const marker = this.createMarker(pos.coordinate, 'marker', pos.title);
        this.markers.push(marker);
        marker.addTo(this.map);
      }
    }
  }
  drawExtraPoints() {
    if (this.map) {
      for (const mark of this.extraMarkers) {
        mark.remove();
      }
      this.extraMarkers = [];

      for (const pos of this.selectedPositions) {
        const marker = this.createMarker(
          pos.coordinate,
          'setted-marker',
          pos.title
        );
        this.extraMarkers.push(marker);
        marker.addTo(this.map);
      }
    }
  }

  createMarker(
    coordinate: Coordinate,
    kind: KindMarker,
    title: string
  ): Marker {
    let url = '';
    switch (kind) {
      case 'my-marker':
        url = MY_MARKER;
        break;
      case 'setted-marker':
        url = SETTED_MARKER;
        break;
      default:
        url = MARKER;
        break;
    }
    const customIcon = L.icon({
      iconUrl: url,
      iconSize: [32, 32],
    });
    const marker = L.marker([coordinate.latitude, coordinate.longitude], {
      title: title,
      icon: customIcon,
    });
    return marker;
  }
  drawCircle() {
    if (this.map) {
      if (!this.circle) {
        this.circle = L.circle(this.center, {
          color: '#30c694',
          fillColor: '#30c694',
          fillOpacity: 0.1,
          radius: this.ratio * 1000,
          stroke: true,
        });
        this.circle.addTo(this.map);
      } else {
        this.circle.setRadius(this.ratio * 1000);
      }
    }
  }
  ngAfterViewInit(): void {
    this.initMap();
  }
}
