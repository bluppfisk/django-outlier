import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LoaderService {
  constructor() { }

  private el: number = 0;
  private loaderSubject = new Subject<boolean>();
  public isLoading = this.loaderSubject.asObservable();
  
  public loading() {
    this.el++;
    this.loaderSubject.next(Boolean(this.el));
  }

  public ready() {
    this.el--;
    this.loaderSubject.next(Boolean(this.el));
  }
}