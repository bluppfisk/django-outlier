import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Char } from './char';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json'
	})
}

@Injectable({
  providedIn: 'root'
})

export class CharService {

  constructor(private http: HttpClient) { 
  }

  private charUrl = 'http://localhost:8000/api/char';

  getChar(id: number): Observable<any> {
  	const url = `${this.charUrl}/${id}`;
  	return this.http.get<any>(url).pipe(
		tap(char => {
			this.log(`got char`);
			console.log(char);
		}),
		catchError(this.handleError<any>('getChar id=${id}'))
  	);
  }

  searchChar(term: string): Observable<any> {
  	if (!term.trim()) {
  		return of();
  	}

  	term = term.trim();

  	return this.http.get<any>(`http://localhost:8000/api/char/${term}`).pipe(
  		tap(_ => this.log(`matching char found`)),
  		catchError(this.handleError<any>('searchChar'))
  	);
  }

  private handleError<T> (operation = 'operation', result?: T) {
  	return (error: any): Observable<T> => {
  		console.log(`${operation} failed: ${error.message}`);
  		return of(result as T);
  	};
  }

  private log(phrase: string): void {
  	console.log(phrase);
  }
}
