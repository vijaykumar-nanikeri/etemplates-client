import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComposeTemplateComponent } from './compose-template.component';

describe('ComposeTemplateComponent', () => {
  let component: ComposeTemplateComponent;
  let fixture: ComponentFixture<ComposeTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComposeTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComposeTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
