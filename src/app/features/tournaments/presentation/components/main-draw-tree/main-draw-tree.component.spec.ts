import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainDrawTreeComponent } from './main-draw-tree.component';

describe('MainDrawTreeComponent', () => {
  let component: MainDrawTreeComponent;
  let fixture: ComponentFixture<MainDrawTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainDrawTreeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainDrawTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
