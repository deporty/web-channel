import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { CardSpecification } from '@deporty-org/entities/tournaments';

export interface CardSpecificationLocal {
  cards: CardSpecification[];
  total: number;
}

@Component({
  selector: 'app-card-form',
  templateUrl: './card-form.component.html',
  styleUrls: ['./card-form.component.scss'],
})
export class CardFormComponent implements OnInit, AfterViewInit {
  @Input() title!: string;
  @Input() tag!: string;

  @Input() enabled = true;



  @Input('total-cards') totalCards: number;
  @Input('card-specifications') cardSpecifications: CardSpecification[];

  @Output() onChange!: EventEmitter<CardSpecificationLocal>;
  minuteCard!: number;

  isChecked = false;

  @ViewChild('total') totalInput!: MatFormField;

  constructor() {
    this.onChange = new EventEmitter<CardSpecificationLocal>();
    this.totalCards = 0;
    this.cardSpecifications = [];
  }
  ngAfterViewInit(): void {
    const background = this.getBackground();
    if (!!background) {
      const container = (
        this.totalInput._elementRef.nativeElement as HTMLElement
      ).getElementsByClassName('mat-form-field-flex')[0];
      container?.classList.add(background);
    }
  }

  ngOnInit(): void {}

  emitData() {
    this.onChange.emit({
      total: this.totalCards,
      cards: this.cardSpecifications,
    });
  }

  onChangeTotalCards() {
    this.emitData();
  }

  getBackground() {
    if (this.title.toUpperCase().includes('AMARILLA')) {
      return 'yellow';
    } else if (this.title.toUpperCase().includes('ROJA')) {
      return 'red';
    }
    return '';
  }
}
