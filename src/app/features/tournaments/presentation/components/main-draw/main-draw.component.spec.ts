import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainDrawComponent } from './main-draw.component';

describe('MainDrawComponent', () => {
  let component: MainDrawComponent;
  let fixture: ComponentFixture<MainDrawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainDrawComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainDrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
