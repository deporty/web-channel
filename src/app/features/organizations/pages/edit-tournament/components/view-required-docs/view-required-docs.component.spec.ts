import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRequiredDocsComponent } from './view-required-docs.component';

describe('ViewRequiredDocsComponent', () => {
  let component: ViewRequiredDocsComponent;
  let fixture: ComponentFixture<ViewRequiredDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewRequiredDocsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRequiredDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
