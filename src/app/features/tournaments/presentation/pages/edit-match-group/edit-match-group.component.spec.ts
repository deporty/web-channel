import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMatchInGroupComponent } from './edit-match-group.component';

describe('EditMatchComponent', () => {
  let component: EditMatchInGroupComponent;
  let fixture: ComponentFixture<EditMatchInGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMatchInGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMatchInGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
