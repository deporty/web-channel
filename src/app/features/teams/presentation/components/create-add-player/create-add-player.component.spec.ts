import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAddPlayerComponent } from './create-add-player.component';

describe('CreateAddPlayerComponent', () => {
  let component: CreateAddPlayerComponent;
  let fixture: ComponentFixture<CreateAddPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAddPlayerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAddPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
