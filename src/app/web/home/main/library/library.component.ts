import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { Tab, LibraryTabs } from './library.model';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
})
export class LibraryComponent implements OnInit {
  libraryTabs: Tab[] = [];
  url: string = '';

  constructor(private location: Location, private router: Router) {
    this.router.events.subscribe(() => {
      this.url = this.location.path();
    });
  }

  ngOnInit(): void {
    this.libraryTabs = LibraryTabs;
  }
}
