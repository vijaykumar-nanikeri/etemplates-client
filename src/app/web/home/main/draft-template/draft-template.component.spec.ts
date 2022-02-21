import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftTemplateComponent } from './draft-template.component';

describe('DraftTemplateComponent', () => {
  let component: DraftTemplateComponent;
  let fixture: ComponentFixture<DraftTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DraftTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
