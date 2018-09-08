import { environment } from '../../environments/environment';

import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Location } from '../location';

@Component({
  selector: 'source-browser',
  templateUrl: './source-browser.component.html',
  styleUrls: ['./source-browser.component.css']
})

export class SourceBrowserComponent implements OnInit {
  private safeLocation: SafeResourceUrl;

  @Input()
  set location(location: Location) {
    const sourcePath = environment.s3URL + environment.sourcePath;
  	if (location) {
	  	this.safeLocation = this.sanitizer.bypassSecurityTrustResourceUrl(
	  		sourcePath + location.source.file + "#page=" + location.page
	  	);
	 }
  }
  
  constructor(private sanitizer: DomSanitizer) { }


  ngOnInit() {
  
  }

}
