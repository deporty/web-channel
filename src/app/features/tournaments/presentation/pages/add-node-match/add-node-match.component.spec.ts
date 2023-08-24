import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNodeMatchComponent } from './add-node-match.component';

describe('EditMatchComponent', () => {
  let component: AddNodeMatchComponent;
  let fixture: ComponentFixture<AddNodeMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNodeMatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNodeMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
