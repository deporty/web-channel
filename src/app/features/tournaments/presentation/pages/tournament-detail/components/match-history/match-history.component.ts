import { DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { Id } from '@deporty-org/entities';
import { MatchEntity } from '@deporty-org/entities/tournaments';
import { Store } from '@ngrx/store';
import 'moment/locale/es';
import { Subscription } from 'rxjs';
import AppState from 'src/app/app.state';
import { GetGroupedMatchesByTournamentByIdCommand } from 'src/app/features/tournaments/state-management/tournaments/tournaments.actions';
import { selectGroupedMatchesByTournamentId } from 'src/app/features/tournaments/state-management/tournaments/tournaments.selector';
import { MatchVisualizationComponent } from '../../../../components/match-visualization/match-visualization.component';

const moment = require('moment');
const defaultFormat = 'dddd D MMM YYYY';
@Component({
  selector: 'app-match-history',
  templateUrl: './match-history.component.html',
  styleUrls: ['./match-history.component.scss'],
})
export class MatchHistoryComponent implements OnInit, OnDestroy {
  keys!: string[];
  @ViewChild(MatTabGroup, { static: false }) matTabGroup!: MatTabGroup;
  orderedData!: {
    [index: string]: MatchEntity[];
  };
  selectedIndex: number;
  subscription!: Subscription;
  today!: any;
  @Input('tournament-id') tournamentId!: Id;

  constructor(
    private store: Store<AppState>,
    private cd: ChangeDetectorRef,
    private datePipe: DatePipe,
    public dialog: MatDialog
  ) {
    this.selectedIndex = 0;
    this.today = moment().format(defaultFormat);
  }

  getKeys(obj: any) {
    return Object.keys(obj);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  replaceToES(stringDate: string) {
    const days: any = {
      Monday: 'Lunes',
      Tuesday: 'Martes',
      Wednesday: 'Miércoles',
      Thursday: 'Jueves',
      Friday: 'Viernes',
      Saturday: 'Sábado',
      Sunday: 'Domingo',
    };

    const months: any = {
      Jan: 'de Enero',
      Feb: 'de Febrero',
      Mar: 'de Marzo',
      Apr: 'de Abril',
      May: 'de Mayo',
      Jun: 'de Junio',
      Jul: 'de Julio',
      Aug: 'de Agosto',
      Sep: 'de Septiembre',
      Oct: 'de Octubre',
      Nov: 'de Noviembre',
      Dec: 'de Diciembre',
    };
    let response = stringDate;

    for (const toReplace in days) {
      const element = days[toReplace];

      response = response.replace(toReplace, element);
    }
    for (const toReplace in months) {
      const element = months[toReplace];

      response = response.replace(toReplace, element);
    }
    return response;
  }
  ngOnInit(): void {
    this.store.dispatch(
      GetGroupedMatchesByTournamentByIdCommand({
        tournamentId: this.tournamentId!,
      })
    );

    this.subscription = this.store
      .select(selectGroupedMatchesByTournamentId(this.tournamentId!))
      .subscribe((data) => {
        if (data) {

          const temp: any = {};
          for (const date in data) {
            const element = [...data[date]].sort((a: any, b: any) => {
              if (a.date && b.date) {
                const dateA =
                  typeof a.date === 'string'
                    ? new Date(a.date)
                    : a.date;
                const dateB =
                  typeof b.date === 'string'
                    ? new Date(b.date)
                    : b.date;

            
                if (dateA.getTime() < dateB.getTime()) {
                  return -1;
                } else if (dateA.getTime() > dateB.getTime()) {
                  return 1;
                }
              }
              return 0;
            });
            // const dateObj = moment(date, defaultFormat);

            const key = this.replaceToES(date);
            temp[key] = element;
          }

          this.orderedData = temp;
          this.keys = this.getKeys(this.orderedData).sort((a, b) => {
            const months = [
              'Enero',
              'Febrero',
              'Marzo',
              'Abril',
              'Mayo',
              'Junio',
              'Julio',
              'Agosto',
              'Septiembre',
              'Octubre',
              'Noviembre',
              'Diciembre',
            ];
            const regA =
              /[a-zA-Záéíóú]+[ ]+([0-9]+)[ ]+de[ ]+([a-zA-Z]+)[ ]+([0-9]+)/gm;
            const regB =
              /[a-zA-Záéíóú]+[ ]+([0-9]+)[ ]+de[ ]+([a-zA-Z]+)[ ]+([0-9]+)/gm;

            const aResult = regA.exec(a);
            const bResult = regB.exec(b);

            if (aResult && bResult) {
              const aDate = new Date();
              const bDate = new Date();

              aDate.setMonth(months.findIndex((x) => x == aResult[2]));
              bDate.setMonth(months.findIndex((x) => x == bResult[2]));

              aDate.setDate(parseInt(aResult[1]));
              bDate.setDate(parseInt(bResult[1]));

              aDate.setFullYear(parseInt(aResult[3]));
              bDate.setFullYear(parseInt(bResult[3]));


              if (aDate.getTime() > bDate.getTime()) {
                return 1;
              } else if (aDate.getTime() < bDate.getTime()) {
                return -1;
              }

            }

            return 0;
          });
        }
      });
  }

  onViewMatch(data: any) {
    this.dialog.open(MatchVisualizationComponent, {
      data: {
        ...data,
      },
      minHeight: '80vh',
    });
  }

  selectCurrentTab() {
    const index = this.getKeys(this.orderedData).indexOf(this.today);
    this.selectedIndex = index >= 0 ? index : 0;
    const getTab = (index: number, matTabGroup: MatTabGroup) => {
      const nativeElement: HTMLElement = matTabGroup._elementRef.nativeElement;
      const event = new Event('click');
      const matTabLabels = nativeElement.querySelector('.mat-tab-labels');
      if (matTabLabels) {
        const tabs = matTabLabels.querySelectorAll(':scope > div[role="tab"]');
        if (tabs) {
          if (index < tabs.length) {
            tabs[index].dispatchEvent(event);
          }
        }
      }
    };
    if (this.matTabGroup) {
      getTab(this.selectedIndex, this.matTabGroup);
    }
  }
}
