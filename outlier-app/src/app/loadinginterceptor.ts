import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpResponse, HttpRequest } from '@angular/common/http';
import { finalize, tap } from 'rxjs/operators';
import { LoaderService } from './loader.service';
 
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loaderService: LoaderService) {}
 
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    this.loaderService.loading();

    return next.handle(req)
      .pipe(
        finalize(() => {
          this.loaderService.ready();
        })
      );
  }
}