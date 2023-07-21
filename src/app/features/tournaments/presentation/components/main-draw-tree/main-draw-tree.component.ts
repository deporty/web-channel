import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
declare const Treant: any;

@Component({
  selector: 'app-main-draw-tree',
  templateUrl: './main-draw-tree.component.html',
  styleUrls: ['./main-draw-tree.component.scss'],
})
export class MainDrawTreeComponent implements OnInit, AfterViewInit {
  @Input() tree!: any;
  @ViewChild('draw') container!: ElementRef;

  simple_chart_config: any = {
    chart: {
      container: '#tree-simple',
      nodeAlign: 'BOTTOM',
      rootOrientation: 'EAST',
      subTeeSeparation: 15,
      siblingSeparation: 5,
      connectors: {
        type: 'step',
      },
      node: {
        collapsable: true,
        // drawLineThrough: true
      },
    },
  };
  my_chart: any;
  orientation!: 'EAST' | 'NORTH';

  constructor() {}
  ngAfterViewInit(): void {
    window.onresize = () => this.redrawChart();
    this.redrawChart();
  }

  redrawChart() {
    const windowSize = window.innerWidth;

    let newOrientation: 'EAST' | 'NORTH' = 'NORTH';
    if (windowSize < 700) {
      newOrientation = 'NORTH';
    } else {
      newOrientation = 'EAST';
    }

    if (newOrientation != this.orientation) {
      this.simple_chart_config.chart.rootOrientation = newOrientation;
      this.draw();
      this.orientation = newOrientation;
    }
  }

  ngOnInit(): void {
    setTimeout(() => {
      try {
        this.my_chart = new Treant(this.simple_chart_config);
      } catch (error) {}
    }, 15000);
  }

  draw() {
    this.simple_chart_config['nodeStructure'] = this.tree;
    let container = document.getElementById('tree-simple');
    try {
      this.my_chart = new Treant(this.simple_chart_config);
    } catch (error) {}
  }
}
