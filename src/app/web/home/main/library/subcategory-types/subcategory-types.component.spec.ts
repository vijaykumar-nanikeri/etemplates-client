import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategoryTypesComponent } from './subcategory-types.component';

describe('SubcategoryTypesComponent', () => {
  let component: SubcategoryTypesComponent;
  let fixture: ComponentFixture<SubcategoryTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubcategoryTypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcategoryTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
