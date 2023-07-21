import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamSummaryBasicCardComponent } from './team-summary-card.component';

describe('TeamSummaryCardComponent', () => {
  let component: TeamSummaryBasicCardComponent;
  let fixture: ComponentFixture<TeamSummaryBasicCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamSummaryBasicCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamSummaryBasicCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
