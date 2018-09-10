import { environment } from '../environments/environment';

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Char } from './char';
import { AltChar } from './altchar';
import { Location } from './location';
import { Source } from './source';
import { SourceService } from './source.service';
import { UserService } from './user.service';

const charUrl = environment.apiURL + 'char/';

@Injectable({
  providedIn: 'root'
})

export class CharService {

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private sourceService: SourceService
  ) {}

  getChar(id: number): Observable<any> {
  	const url = charUrl + id;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + this.userService.token
      })
    };

  	return this.http.get<any>(url, httpOptions).pipe(
		tap(data => {
      data.locations.forEach((location, index, locations) => {
        locations[index].source = this.sourceService.findSourceById(location.source);
      });
      data.altchars.forEach((altchar, index, altchars) => {
        altchars[index].source = this.sourceService.findSourceById(altchar.source);
      });
      data = new Char().deserialise(data);
		}),
		catchError(this.handleError<any>('getChar id=${id}'))
  	);
  }

  addLocation(newLocation: Location, char: Char): Observable<Char> {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + this.userService.token
      })
    };

    return this.http.post<Char>(charUrl + char.id + '/location/', newLocation, httpOptions).pipe(
      tap(char => {
        console.log(`updated char with new location`);
      })
    );
  }

  deleteLocation(location: Location, char: Char): Observable<Char> {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + this.userService.token
      })
    };
    return this.http.delete<Char>(charUrl + char.id + '/location/' + location.id + '/', httpOptions).pipe(
      tap(char => {
        console.log(`deleted location from char`);
      })
    );
  }

  addAltChar(altChar: AltChar, char: Char): Observable<AltChar> {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + this.userService.token
      })
    };
    var payload = altChar.serialise();

    return this.http.post<AltChar>(charUrl + char.id + '/altchar/', payload, httpOptions).pipe(
      tap(char => {
        console.log(`new altchar added/updated`);
      })
    );
  }

  deleteAltChar(altChar: AltChar, char: Char): Observable<Char> {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + this.userService.token
      })
    };

    return this.http.delete<Char>(charUrl + char.id + '/altchar/' + altChar.id, httpOptions).pipe(
      tap(char => {
        console.log(`deleted altchar from char`);
      })
    );
  }

  searchChar(term: string): Observable<any> {
  	if (!term.trim()) {
  		return of();
  	}

  	term = term.trim();

    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + this.userService.token
      })
    };

  	return this.http.get<any>(charUrl + term + '/', httpOptions).pipe(
  		tap(_ => {
        this.log(`matching char found`);
       }),
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
