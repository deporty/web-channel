import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

export interface ItemsFilter {
  display: string;
  property: string;
  icon?: string;
  kind?: string;
  values?: {
    value: any;
    display: string;
  }[];
}

@Component({
  selector: 'app-items-filter',
  templateUrl: './items-filter.component.html',
  styleUrls: ['./items-filter.component.scss'],
})
export class ItemsFilterComponent implements OnInit, OnDestroy {
  @Input() filters!: ItemsFilter[];
  @Input() items!: any[];
  @Input() description?: string;
  @Input() expanded = false;
  @Input('in-situ') inSitu: boolean;
  @Output('on-filter') onFilter: EventEmitter<any[]>;
  @Output('on-search') onSearch: EventEmitter<any>;
  @Output('on-update-filters') onUpdateFilters: EventEmitter<any>;
  @Output('on-clear') onClear: EventEmitter<void>;

  formGroup!: UntypedFormGroup;
  filteredItems: any[];
  $suscription?: Subscription;
  isExpanded?: boolean;

  constructor() {
    this.filteredItems = [];
    this.filters = [];
    this.inSitu = true;
    this.onFilter = new EventEmitter<any[]>();
    this.onUpdateFilters = new EventEmitter<any[]>();
    this.onSearch = new EventEmitter<any>();
    this.onClear = new EventEmitter<void>();
  }
  ngOnDestroy(): void {
    this.$suscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.configure();
    this.isExpanded = this.expanded;
  }
  configure() {
    if (this.items) this.filteredItems = [...this.items];
    this.generateForm();
  }

  clearForm() {
    this.formGroup.reset();
    this.onClear.emit();
  }
  generateForm() {
    const form: any = {};
    for (const filter of this.filters) {
      form[filter.property] = new UntypedFormControl('');
    }
    this.formGroup = new UntypedFormGroup(form);

    this.$suscription = this.formGroup.valueChanges.subscribe((value: any) => {
      this.onUpdateFilters.emit(value);
    });
  }
  deleteEmptyFilters(filters: any) {
    const response = { ...filters };
    for (const key in filters) {
      if (!filters[key]) {
        delete response[key];
      }
    }
    return response;
  }

  onChangeForm() {
    const value = this.formGroup.value;
    this.onUpdateFilters.emit(this.deleteEmptyFilters(value));
    this.onSearch.emit();
    if (this.inSitu) {
      this.filteredItems = [...this.items];
      const keys = Object.keys(value);
      for (const key of keys) {
        if (!!value[key]) {
          this.filteredItems = this.filteredItems.filter((item: any) => {
            return !!item[key]
              ? item[key].toUpperCase().includes(value[key].toUpperCase())
              : false;
          });
        }
      }
      this.onFilter.emit(this.filteredItems);
    }
  }
}
