import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { UserService } from '../user.service';
import { CharService } from '../char.service';

@Component({
  selector: 'app-outlier-nav',
  templateUrl: './outlier-nav.component.html',
  styleUrls: ['./outlier-nav.component.css']
})
export class OutlierNavComponent {
  private term: string = "";
  private recents: string[] = [];
  private showRecents: boolean = false;
    
  constructor(
    private userService: UserService,
    private charService: CharService,
    private router: Router
   ) {}

    searchRecent(term: string): void {
      this.performSearch(term);
    }

    search(): void {
      if (this.term == "") {
        return;
      }
      this.recents = [this.term].concat(this.recents.slice(0,4));
      this.performSearch(this.term);
      this.term = "";
  }


  performSearch(term: string) {
    this.showRecents = false;
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

  logout(): void {
    this.userService.logout();
  }

  }