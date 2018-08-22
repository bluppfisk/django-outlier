import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Char } from './char';
import { AltChar } from './altchar';
import { Location } from './location';
import { Source } from './source';

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
		tap(data => {
			this.log(`got char`);
      data.sources.forEach((source, index, sources) => {
        sources[index] = new Source().deserialise(source);
      });
      data.char.locations.forEach((location, index, locations) => {
        locations[index].source = data.sources.find(s => s.id == location.source);
      });
      data.char.altchars.forEach((altchar, index, altchars) => {
        altchars[index].source = data.sources.find(s => s.id == altchar.source);
      });
      data.char = new Char().deserialise(data.char);
		}),
		catchError(this.handleError<any>('getChar id=${id}'))
  	);
  }

  addLocation(newLocation: Location, char: Char): Observable<Char> {
    return this.http.post<Char>(this.charUrl + '/' + char.id + '/location', newLocation, httpOptions).pipe(
      tap(char => {
        console.log(`updated char with new location`);
      })
    )
  }

  deleteLocation(location: Location, char: Char): Observable<Char> {
    return this.http.delete<Char>(this.charUrl + '/' + char.id + '/location/' + location.id, httpOptions).pipe(
      tap(char => {
        console.log(`deleted location from char`);
      })
    );
  }

  addAltChar(altChar: AltChar, char: Char): Observable<AltChar> {
    var payload = altChar.serialise();
    // console.log(payload);
    return this.http.post<AltChar>(this.charUrl + '/' + char.id + '/altchar', payload, httpOptions).pipe(
      tap(char => {
        // console.log(char);
        console.log(`new altchar added/updated`);
      })
    );
  }

  // updateAltChar(altChar: AltChar, char: Char): Observable<AltChar> {
  //     var payload = altChar.serialise();
  //     return this.http.put<AltChar>(this.charUrl + '/' + char.id + '/altchar', payload, httpOptions).pipe(
  //       tap(char => {
  //         console.log(`updated altchar`);
  //       })
  //     );
  // }

  deleteAltChar(altChar: AltChar, char: Char): Observable<Char> {
    return this.http.delete<Char>(this.charUrl + '/' + char.id + '/altchar/' + altChar.id, httpOptions).pipe(
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
