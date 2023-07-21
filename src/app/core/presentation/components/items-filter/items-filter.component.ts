import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

export interface ItemsFilter {
  display: string;
  property: string;
  icon?: string;
  kind?: string;
}

@Component({
  selector: 'app-items-filter',
  templateUrl: './items-filter.component.html',
  styleUrls: ['./items-filter.component.scss'],
})
export class ItemsFilterComponent implements OnInit {
  @Input() filters!: ItemsFilter[];
  @Input() items!: any[];
  @Input() expanded = false;
  @Input('in-situ') inSitu: boolean;
  @Output('on-filter') onFilter: EventEmitter<any[]>;
  @Output('on-update-filters') onUpdateFilters: EventEmitter<any>;
  @Output('on-clear') onClear: EventEmitter<void>;

  formGroup!: UntypedFormGroup;
  filteredItems: any[];

  constructor() {
    this.filteredItems = [];
    this.filters = [];
    this.inSitu = true;
    this.onFilter = new EventEmitter<any[]>();
    this.onUpdateFilters = new EventEmitter<any[]>();
    this.onClear = new EventEmitter<void>();
  }

  ngOnInit(): void {
    this.configure();
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
