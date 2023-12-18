import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TournamentsFinancialStatementsComponent } from '../tournaments-financial-statements/tournaments-financial-statements.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexComponent {
  static route = 'index';
  modules = [
    {
      display: 'Costos por torneo',
      icon: 'credit_card',
      path: TournamentsFinancialStatementsComponent.route,
    },
  ];
}
