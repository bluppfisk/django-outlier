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
  private charInSourceUrl = 'http://localhost:8000/api/charinsource'

  getChar(id: number): Observable<any> {
  	const url = `${this.charUrl}/${id}`;
  	return this.http.get<any>(url).pipe(
		tap(char => {
			this.log(`got char`);
		}),
		catchError(this.handleError<any>('getChar id=${id}'))
  	);
  }

  addLocation(sourceId: number, pageNo: number, charId: number): Observable<Char> {
    var body = {
      'source_id': sourceId,
      'page': pageNo,
      'char_id': charId
    }

    return this.http.post<Char>(this.charUrl + '/' + charId + '/location', body, httpOptions).pipe(
      tap(char => {
        console.log(`updated char with new location`);
      })
    )
  }

  deleteLocation(locationId: number, charId: number): Observable<Char> {
    return this.http.delete<Char>(this.charUrl + '/' + charId + '/location/' + locationId, httpOptions).pipe(
      tap(char => {
        console.log(`deleted location from char`);
      })
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
