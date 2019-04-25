import { Component } from '@angular/core';

import { UserService } from './user.service';
import { SourceService } from './source.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = "Outlier Tool";
  public username: string = "";
  public password: string = "";
  public showSpinner: boolean = false;

  constructor(
    public userService: UserService,
    public sourceService: SourceService
  ) { }

  login() {
    this.userService.login({
      'username': this.username,
      'password': this.password
    }).subscribe(
      data => {
        if (this.userService.isLoggedIn()) {
          console.log("Logged in... getting sources");
          this.sourceService.listSources().subscribe();
        }
      }
    );
  }

  refreshToken() {
    this.userService.refreshToken();
  }

  logout() {
    this.userService.logout();
  }
}
