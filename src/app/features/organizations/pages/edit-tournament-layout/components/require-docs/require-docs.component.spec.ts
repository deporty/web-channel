import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequireDocsComponent } from './require-docs.component';

describe('RequireDocsComponent', () => {
  let component: RequireDocsComponent;
  let fixture: ComponentFixture<RequireDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequireDocsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequireDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
