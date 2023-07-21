import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIntergroupMatchComponent } from './edit-intergroup-match.component';

describe('EditMatchComponent', () => {
  let component: EditIntergroupMatchComponent;
  let fixture: ComponentFixture<EditIntergroupMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditIntergroupMatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditIntergroupMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
