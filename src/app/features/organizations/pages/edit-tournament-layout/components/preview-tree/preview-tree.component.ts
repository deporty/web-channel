import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { GROUP_SIZES_PLACEHOLDERS } from 'src/app/app.constants';
declare const Treant: any;

@Component({
  selector: 'app-preview-tree',
  templateUrl: './preview-tree.component.html',
  styleUrls: ['./preview-tree.component.scss'],
})
export class PreviewTreeComponent implements OnInit, AfterViewInit, OnChanges {
  tree!: string[][];

  @Input('group-config') groupConfig!: number[];

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
  isValid: boolean = false;

  constructor(private cd: ChangeDetectorRef) {}
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.groupConfig);

    this.createTree(this.groupConfig);
  }
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

  private createTeamIdentifiers(groupConfig: number[]) {
    const response = [];

    for (let i = 0; i < groupConfig.length; i++) {
      const ammount = groupConfig[i];
      const label = GROUP_SIZES_PLACEHOLDERS[i];

      const teamsIdentifiers = Array.from(
        { length: ammount },
        (_, index) => label + (index + 1)
      );
      response.push(teamsIdentifiers);
    }
    return response;
  }
  private isAvalidConfiguration(groupConfig: number[]) {
    return groupConfig.reduce(
      (previousValue: boolean, currentValue: number) => {
        return previousValue && currentValue > 0;
      },
      true
    );
  }
  private isAvalidTree(matches: string[][]) {
    return matches.reduce((previousValue: boolean, currentValue: string[]) => {
      return (
        previousValue &&
        currentValue.reduce(
          (previousValue1: boolean, currentValue1: string) => {
            return previousValue1 && !!currentValue1;
          },
          true
        )
      );
    }, true);
  }
  createTree(groupConfig: number[]) {
    const teamsIdentifiers = this.createTeamIdentifiers(groupConfig);

    this.isValid = this.isAvalidConfiguration(groupConfig);
    if (this.isValid) {
      const response: string[][] = [];

      this._createTree(0, teamsIdentifiers, response);

      this.tree = response;
      this.isValid = this.isAvalidTree(response)
      this.cd.detectChanges();
    }
  }

  createNode(info: string[]) {
    const facture = {
      text: {
        name: info.join(', '),
      },
      children: [],
    };
    return facture;
  }
  _isEmpty(teamsIdentifiers: string[][]) {
    return teamsIdentifiers.reduce(
      (previousValue: boolean, currentValue: string[]) => {
        return previousValue && currentValue.length == 0;
      },
      true
    );
  }
  _createTree(
    index: number,
    teamsIdentifiers: string[][],
    response: string[][]
  ) {

    if (this._isEmpty(teamsIdentifiers)) {
      return;
    }
    const currentGroup = teamsIdentifiers[index];

    const nextIndex = index + 1 < teamsIdentifiers.length ? index + 1 : 0;
    const nextGroup = teamsIdentifiers[nextIndex];

    const A0Index = 0;
    const B1Index = nextGroup.length - 1;

    const A0: string = currentGroup.splice(A0Index, 1)[0];
    const B1: string = nextGroup.splice(B1Index, 1)[0];
    const info = [A0, B1];
    response.push(info);

    this._createTree(nextIndex, teamsIdentifiers, response);
  }
  draw() {
    this.simple_chart_config['nodeStructure'] = this.tree;

    try {
      this.my_chart = new Treant(this.simple_chart_config);
    } catch (error) {}
  }
}
