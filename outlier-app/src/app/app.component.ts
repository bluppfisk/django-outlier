import { Component, OnInit } from '@angular/core';
import { throwError } from 'rxjs';
import * as moment from 'moment';

import { UserService } from './user.service';
import { SourceService } from './source.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = "Outlier Tool";
  private username: string = "";
  private password: string = "";
  private showSpinner: boolean = false;

  constructor (
    private userService: UserService,
    private sourceService: SourceService
  ) {}

  ngOnInit() {
    this.sourceService.listSources().subscribe();
   }

  login() {
  	this.userService.login({
  		'username': this.username,
  		'password': this.password
  	});
  }

  refreshToken() {
  	this.userService.refreshToken();
  }

  logout() {
  	this.userService.logout();
  }
}
