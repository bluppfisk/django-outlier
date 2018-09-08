import { environment } from '../environments/environment';

import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import * as moment from 'moment';

const refreshUrl: string = environment.apiURL + 'token-refresh/';
const authUrl: string = environment.apiURL + 'token-auth/';

@Injectable({
  providedIn: 'root'
})

export class UserService implements OnInit {

	private httpOptions: any;
	public token: string;
	public token_expires: Date;
	public username: string;
	public password: string;
	public errors: string[] = []

  constructor(private http: HttpClient) {
  	this.httpOptions = {
  		headers: new HttpHeaders({'Content-Type': 'application/json'})
  	};
  	this.token = localStorage.getItem('jwt_token');
  	this.token_expires = JSON.parse(localStorage.getItem('jwt_token_expires'));
  	this.username = localStorage.getItem('jwt_token_username');
  }

  ngOnInit() {
  }

  login(user: any) {
  	this.http.post(authUrl, JSON.stringify(user), this.httpOptions)
  			 .subscribe(
  			 	data => {
  			  		this.updateData(data['token']);
  			  	},
  			  	err => {
  			  		this.errors = err['error'];
  			  	}
  			  );
  }

  refreshToken() {
  	this.http.post(refreshUrl, JSON.stringify({token: this.token}), this.httpOptions)
  			 .subscribe(
  			 	data => {
  			 		this.updateData(data['token']);
  			 	},
  			 	err => {
  			 		this.errors = err['error'];
  			 	}
  			 );
  }

  logout() {
  	this.token = null;
  	this.token_expires = null;
  	this.username = null;

  	localStorage.removeItem('jwt_token');
  	localStorage.removeItem('jwt_token_expires');
  	localStorage.removeItem('jwt_token_username');
  }

  isLoggedIn() {
  	return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
  	return !this.isLoggedIn();
  }

  getExpiration() {
  	const expiresAt = JSON.parse(localStorage.getItem('jwt_token_expires'));
  	return moment(expiresAt);
  }

  updateData(token: string) {
  	this.token = token;
  	this.errors = [];

  	var token_parts = this.token.split(".");
  	var token_decoded = JSON.parse(window.atob(token_parts[1]));
  	this.token_expires = new Date(token_decoded.exp * 1000);
  	this.username = token_decoded.username;

  	// store locally
  	localStorage.setItem('jwt_token', this.token);
  	localStorage.setItem('jwt_token_expires', JSON.stringify(this.token_expires.valueOf()));
  	localStorage.setItem('jwt_token_username', this.username);
  }
}
