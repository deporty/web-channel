import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersSummaryListComponent } from './players-summary-list.component';

describe('PlayersSummaryListComponent', () => {
  let component: PlayersSummaryListComponent;
  let fixture: ComponentFixture<PlayersSummaryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayersSummaryListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayersSummaryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
