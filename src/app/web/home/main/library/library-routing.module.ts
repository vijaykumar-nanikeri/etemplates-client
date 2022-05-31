import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { LibraryComponent } from './library.component';

import { FieldNamesComponent } from './field-names/field-names.component';

const libraryRoutes: Routes = [
  {
    path: '',
    component: LibraryComponent,
    children: [
      {
        path: 'subcategory-types',
        loadChildren: () =>
          import('./subcategory-types/subcategory-types.module').then(
            (m) => m.SubcategoryTypesModule
          ),
      },
      {
        path: 'field-names',
        component: FieldNamesComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(libraryRoutes)],
  exports: [RouterModule],
})
export class LibraryRoutingModule {}
