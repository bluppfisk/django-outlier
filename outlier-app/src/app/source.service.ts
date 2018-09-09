import { environment } from '../environments/environment';

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Source } from './source';
import { UserService } from './user.service';

const sourceUrl: string = environment.apiURL + "source/";
const awsSignatureUrl = environment.apiURL + "get_presigned_url/";
const sourcePath: string = environment.sourcePath;

@Injectable({
  providedIn: 'root'
})

export class SourceService {
  public sources: Source[] = [];

  constructor(
    private http: HttpClient,
    private userService: UserService,
   ) { }

  public listSources(): Observable<Source[]> {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + this.userService.token
      })
    };

    // if sources are already loaded, just return from memory
    if (this.sources.length > 0) {
      return of(this.sources);
    }

  	return this.http.get<Source[]>(sourceUrl, httpOptions).pipe(
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

  public addSource(source: Source): Observable<Source> {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + this.userService.token
      })
    };
    return this.http.post<Source>(sourceUrl, source, httpOptions).pipe(
      tap(data => {
        this.sources.push(Object.assign(new Source(), data));
      })
    );
  }

  public updateSource(source: Source): Observable<Source> {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + this.userService.token
      })
    };
    return this.http.put<Source>(sourceUrl, source, httpOptions);
  }

public deleteSource(source: Source): Observable<any> {
  var httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + this.userService.token
    })
  };

  return this.http.delete<Source>(sourceUrl + source.id, httpOptions).pipe(
    tap(data => {
      this.sources = this.sources.filter(s => s !== source);
    })
   );
}

  public findSourceById(id: number): Source | null {
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
      return of({ "numberAdded": 0 });
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': csvFile.type,
        'Content-Disposition': 'attachment; filename=' + csvFile,
        'Authorization': 'JWT ' + this.userService.token
      })
    };

    return this.http.put<any>(sourceUrl + '/' + source.id + '/locationMapper/', csvFile, httpOptions);
  }

  public getPresignedURL(file: File): Observable<string> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + this.userService.token
      })
    }
    const body = {
      filetype: file.type,
      filename: sourcePath + file.name
    }

    return this.http.post<string>(awsSignatureUrl, body, httpOptions);
  }

  public uploadToS3(file: File, presignedURL: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': file.type})
    }

    return this.http.put(presignedURL, file, httpOptions);
  }
}
