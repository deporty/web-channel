import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentStatusWikiComponent } from './tournament-status-wiki.component';

describe('TournamentStatusWikiComponent', () => {
  let component: TournamentStatusWikiComponent;
  let fixture: ComponentFixture<TournamentStatusWikiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TournamentStatusWikiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TournamentStatusWikiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
