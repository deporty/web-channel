import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNodeMatchComponent } from './edit-match.component';

describe('EditMatchComponent', () => {
  let component: EditNodeMatchComponent;
  let fixture: ComponentFixture<EditNodeMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditNodeMatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNodeMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
