import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldNamesComponent } from './field-names.component';

describe('FieldNamesComponent', () => {
  let component: FieldNamesComponent;
  let fixture: ComponentFixture<FieldNamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldNamesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
