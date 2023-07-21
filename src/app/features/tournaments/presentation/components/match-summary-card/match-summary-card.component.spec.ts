import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchSummaryCardComponent } from './match-summary-card.component';

describe('MatchSummaryCardComponent', () => {
  let component: MatchSummaryCardComponent;
  let fixture: ComponentFixture<MatchSummaryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchSummaryCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchSummaryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
