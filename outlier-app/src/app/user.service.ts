import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const refreshUrl: string = 'http://localhost:8000/api/token-refresh/';
const authUrl: string = 'http://localhost:8000/api/token-auth/';

@Injectable({
  providedIn: 'root'
})
export class UserService {

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
  }

  updateData(token: string) {
  	this.token = token;
  	this.errors = [];

  	var token_parts = this.token.split(".");
  	var token_decoded = JSON.parse(window.atob(token_parts[1]));
  	this.token_expires = new Date(token_decoded.exp * 1000);
  	this.username = token_decoded.username;
  }
}
