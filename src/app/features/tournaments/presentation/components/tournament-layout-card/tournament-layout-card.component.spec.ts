import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentLayoutCardComponent } from './tournament-layout-card.component';

describe('TournamentLayoutCardComponent', () => {
  let component: TournamentLayoutCardComponent;
  let fixture: ComponentFixture<TournamentLayoutCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TournamentLayoutCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentLayoutCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
