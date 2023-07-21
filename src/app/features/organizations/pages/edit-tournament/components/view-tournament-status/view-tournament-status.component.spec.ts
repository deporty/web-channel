import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTournamentStatusComponent } from './view-tournament-status.component';

describe('ViewTournamentStatusComponent', () => {
  let component: ViewTournamentStatusComponent;
  let fixture: ComponentFixture<ViewTournamentStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTournamentStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTournamentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
