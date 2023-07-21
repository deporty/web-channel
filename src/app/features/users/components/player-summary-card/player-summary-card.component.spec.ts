import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerSummaryCardComponent } from './player-summary-card.component';

describe('PlayerSummaryCardComponent', () => {
  let component: PlayerSummaryCardComponent;
  let fixture: ComponentFixture<PlayerSummaryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerSummaryCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerSummaryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
