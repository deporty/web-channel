import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePlayerCardComponent } from './create-player-card.component';

describe('CreatePlayerCardComponent', () => {
  let component: CreatePlayerCardComponent;
  let fixture: ComponentFixture<CreatePlayerCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePlayerCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePlayerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
