import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIntergroupMatchComponent } from './add-intergroup-match.component';

describe('EditMatchComponent', () => {
  let component: AddIntergroupMatchComponent;
  let fixture: ComponentFixture<AddIntergroupMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIntergroupMatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIntergroupMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
