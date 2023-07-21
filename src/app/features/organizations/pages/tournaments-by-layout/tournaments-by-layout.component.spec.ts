import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentsByLayoutComponent } from './tournaments-by-layout.component';

describe('TournamentListComponent', () => {
  let component: TournamentsByLayoutComponent;
  let fixture: ComponentFixture<TournamentsByLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TournamentsByLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentsByLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
