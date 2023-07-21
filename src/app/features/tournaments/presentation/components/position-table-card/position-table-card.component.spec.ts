import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionTableCardComponent } from './position-table-card.component';

describe('PositionTableCardComponent', () => {
  let component: PositionTableCardComponent;
  let fixture: ComponentFixture<PositionTableCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PositionTableCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionTableCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
