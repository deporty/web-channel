import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentLayoutListComponent } from './tournament-layout-list.component';

describe('TournamentListComponent', () => {
  let component: TournamentLayoutListComponent;
  let fixture: ComponentFixture<TournamentLayoutListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TournamentLayoutListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentLayoutListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
