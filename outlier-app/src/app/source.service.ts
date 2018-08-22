import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Source } from './source';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json'
	})
}

@Injectable({
  providedIn: 'root'
})

export class SourceService {
  sources: Source[] = [];

  constructor(private http: HttpClient) { }

  private sourcesUrl = 'http://localhost:8000/api/source';

  listSources(): Observable<Source[]> {
  	return this.http.get<Source[]>(this.sourcesUrl).pipe(
		tap(sources => {
      console.log(`got sources`);
      sources.forEach((source, index, sources) => {
        source = new Source().deserialise(source);
        this.sources.push(source);
      });
		}),
		catchError(this.handleError<Source[]>('Sources'))
  	);
  }

  findSourceById(id: number): Source {
    return this.sources.find(s => s.id === id)
  }

  private handleError<T> (operation = 'operation', result?: T) {
  	return (error: any): Observable<T> => {
  		console.log(`${operation} failed: ${error.message}`);
  		return of(result as T);
  	};
  }
}
