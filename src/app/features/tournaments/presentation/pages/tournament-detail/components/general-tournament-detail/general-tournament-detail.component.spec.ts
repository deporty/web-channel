import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralTournamentDetailComponent } from './general-tournament-detail.component';

describe('GeneralTournamentDetailComponent', () => {
  let component: GeneralTournamentDetailComponent;
  let fixture: ComponentFixture<GeneralTournamentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralTournamentDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralTournamentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
