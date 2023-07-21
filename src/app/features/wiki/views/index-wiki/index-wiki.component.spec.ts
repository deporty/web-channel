import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexWikiComponent } from './index-wiki.component';

describe('IndexWikiComponent', () => {
  let component: IndexWikiComponent;
  let fixture: ComponentFixture<IndexWikiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexWikiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexWikiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
