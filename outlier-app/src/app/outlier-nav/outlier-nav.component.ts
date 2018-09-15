import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../user.service';
import { CharService } from '../char.service';

@Component({
  selector: 'app-outlier-nav',
  templateUrl: './outlier-nav.component.html',
  styleUrls: ['./outlier-nav.component.css']
})

export class OutlierNavComponent {
  term: string = "";
  recents: string[] = [];
  showRecents: boolean = false;
    
  constructor(
    private userService: UserService,
    private charService: CharService,
    private router: Router,
   ) {}

  searchRecent(term: string) {
    this.performSearch(term);
  }

  search() {
    if (this.term == "") {
      return;
    }
    this.recents = [this.term].concat(this.recents.slice(0,4));
    this.performSearch(this.term);
    this.term = "";
  }

  private performSearch(term: string) {
    this.showRecents = false;
    this.charService.searchChar(term)
        .subscribe(data => {
            if (data) {
              var id: string = data.id;
              this.router.navigate(["char/" + id]);
            } else {
              this.router.navigate(["char/0"]);
            }
     });
  }

  logout() {
    this.userService.logout();
  }
}