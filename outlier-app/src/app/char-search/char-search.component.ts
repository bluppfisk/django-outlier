import { Component, OnInit } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';
 import { Router } from '@angular/router';

import { Char } from "../char";
import { CharService } from "../char.service";

@Component({
  selector: 'app-char-search',
  templateUrl: './char-search.component.html',
  styleUrls: ['./char-search.component.css']
})

export class CharSearchComponent implements OnInit {
  constructor(
    private charService: CharService,
    private router: Router
   ) { }

  search(term: string): void {
    this.charService.searchChar(term)
      .subscribe(data => {
        if (data) {
          var id: string = data.char.id;
          this.router.navigate(["char/" + id]);
        } else {
          this.router.navigate(["char/0"]);
        }
      });
  }

  ngOnInit() {
  }

}
