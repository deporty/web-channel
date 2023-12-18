import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ResourceEntity } from '@deporty-org/entities';
import { Store } from '@ngrx/store';
import AppState from 'src/app/app.state';
import { ItemsFilter } from 'src/app/core/presentation/components/items-filter/items-filter.component';
import { GetResourcesCommand } from 'src/app/features/administration/state-management/administration.commands';
import { selectResources } from 'src/app/features/administration/state-management/administration.selector';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourcesComponent implements OnInit {
  resources?: ResourceEntity[];

  filters: ItemsFilter[] = [
    {
      display: 'Tipo',
      property: 'kind',
      values: [
        {
          display: 'API',
          value: 'api',
        },
        {
          display: 'UI',
          value: 'ui',
        },
      ],
    },
    {
      display: 'Capa',
      property: 'layer',
    },
    {
      display: 'Nombre',
      property: 'name',
    },
  ];
  currentResources?: ResourceEntity[];

  constructor(private store: Store<AppState>, private cd: ChangeDetectorRef) {}

  onFilter(data: any): void {
    this.currentResources = data;
  }
  ngOnInit(): void {
    this.store.dispatch(GetResourcesCommand());
    this.store.select(selectResources).subscribe((data) => {
      if (data && !this.resources) {
        this.resources = Object.values(data);
        this.currentResources = this.resources;
        this.cd.detectChanges();
      }
    });
  }
}
