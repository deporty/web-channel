import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { CardsGottenComponent } from '../cards-gotten/cards-gotten.component';
import { LeastBeatenGoalComponent } from '../least-beaten-goal/least-beaten-goal.component';
import { MarkersTableComponent } from '../markers-table/markers-table.component';

@Component({
  selector: 'app-stadistics',
  templateUrl: './stadistics.component.html',
  styleUrls: ['./stadistics.component.scss'],
})
export class StadisticsComponent implements OnInit, AfterViewInit {
  @Input('tournament-id') tournamentId!: string | undefined;

  @ViewChild('viewContainerRef', { read: ViewContainerRef, static: true })
  // @ViewChild(MatButtonToggleGroup) buttonToggleGroup!: MatButtonToggleGroup;
  public orderedViewContainer!: ViewContainerRef;
  public componentRefs: { [index: string]: ComponentRef<any> } = {};
  private currentRef!: ComponentRef<any>;
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdr: ChangeDetectorRef,
    private store: Store
  ) {
    this.labels = [
      {
        display: 'Goleadores',
        value: 'markers',
        component: MarkersTableComponent,
        enable: true,
      },
      {
        display: 'Valla menos vencida',
        value: 'less-score',
        component: LeastBeatenGoalComponent,
        enable: false,
      },
      {
        display: 'Tarjetas Amarillas',
        value: 'yellow-cards',
        component: CardsGottenComponent,
        enable: false,
      },

      {
        display: 'Tarjetas Rojas',
        value: 'red-cards',
        component: CardsGottenComponent,
        enable: false,
      },
    ];
  }
  ngAfterViewInit(): void {
    this.draw(this.labels[0]);
    this.cdr.detectChanges();
  }

  labels: any[];

  ngOnInit(): void {}
  draw(event: any) {
    let ref = null;

    if (this.componentRefs[event.value]) {
      ref = this.componentRefs[event.value];
    } else {
      const resolvedComponent =
        this.componentFactoryResolver.resolveComponentFactory(event.component);
      const componentRef =
        this.orderedViewContainer.createComponent(resolvedComponent);
      (componentRef.instance as any).tournamentId = this.tournamentId;
      this.componentRefs[event.value] = componentRef;
      ref = componentRef;
    }
    if (this.currentRef) {
      const index = this.orderedViewContainer.indexOf(this.currentRef.hostView);
      this.orderedViewContainer.detach(index);
    }
    this.orderedViewContainer.insert(ref.hostView);
    this.currentRef = ref;
  }
  change(data: any) {
    const event = data.value;

    this.draw(event);
  }
}
