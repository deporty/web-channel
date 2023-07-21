import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import {
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  WARN_COLOR,
} from 'src/app/app.constants';

// import DatalabelsPlugin from 'chartjs-plugin-datalabels';
@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements AfterViewInit, OnChanges, OnInit {
  @Input() data!: number[];
  @Input() title!: string[] | string;
  @Input() labels!: (string | string[])[];
  @Input() colors: string[] = [PRIMARY_COLOR, SECONDARY_COLOR, WARN_COLOR];
  public pieChartType: ChartType = 'doughnut';

  constructor() {}
  ngOnInit(): void {
  
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.title) {
      this.pieChartOptions = {
        responsive: true,

        plugins: {
          title: {
            text: this.title,
            display: !!this.title,
          },
          legend: {
            display: true,
            align: 'start',
            position: 'bottom',
          },
        },
      };
    }
    if (this.data && this.labels) {
      this.pieChartData = {
        labels: this.labels,
        datasets: [
          {
            data: this.data,
            backgroundColor: this.colors,
          },
        ],
      };
    }
  }

  ngAfterViewInit(): void {}

  // public pieChartPlugins = [ DatalabelsPlugin ];

  public pieChartOptions!: ChartConfiguration['options'];

  public pieChartData!: ChartData<'doughnut', number[], string | string[]>;
}
