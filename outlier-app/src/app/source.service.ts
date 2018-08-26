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

  private sourceUrl = 'http://localhost:8000/api/source';

  listSources(): Observable<Source[]> {
    if (this.sources.length > 0) {
      return of(this.sources);
    }
  	return this.http.get<Source[]>(this.sourceUrl).pipe(
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

  fileToS3(file: File): Observable<string> {
    if (!file || file.type !== "application/pdf") {
      console.log('no file or not a pdf file');
      return of(null);
    }
    // TODO implement upload to S3
  }

  updateSource(source: Source): Observable<Source> {
    return this.http.put<Source>(this.sourceUrl, source);
  }

  addSource(source: Source): Observable<Source> {
    return this.http.post<Source>(this.sourceUrl, source);
  }

  findSourceById(id: number): Source | null {
    return this.sources.find(s => s.id === id);
  }

  private handleError<T> (operation = 'operation', result?: T) {
  	return (error: any): Observable<T> => {
  		console.log(`${operation} failed: ${error.message}`);
  		return of(result as T);
  	};
  }

  public uploadCSV(csvFile: File, source: Source): Observable<any> {
    if (csvFile.type !== 'text/csv') {
      console.log('not a csv file');
      return of(0);
    }
    var httpOpts = {
      headers: new HttpHeaders({
        'Content-Type': csvFile.type,
        'Content-Disposition': 'attachment; filename=' + csvFile
      })
    };

    return this.http.put<any>(this.sourceUrl + '/' + source.id + '/locationMapper', csvFile, httpOpts);
  }
}
