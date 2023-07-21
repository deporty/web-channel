import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamSummaryCardComponent } from './team-summary-card.component';

describe('TeamSummaryCardComponent', () => {
  let component: TeamSummaryCardComponent;
  let fixture: ComponentFixture<TeamSummaryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamSummaryCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamSummaryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
