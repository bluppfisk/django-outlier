import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-outlier-nav',
  templateUrl: './outlier-nav.component.html',
  styleUrls: ['./outlier-nav.component.css']
})
export class OutlierNavComponent {
	fileForm: boolean = false;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
    
  constructor(private breakpointObserver: BreakpointObserver) {}

  showFileForm(): void {
  	this.fileForm = true;
  }

  }