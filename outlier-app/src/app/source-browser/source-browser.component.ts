import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Location } from '../location';

@Component({
  selector: 'source-browser',
  templateUrl: './source-browser.component.html',
  styleUrls: ['./source-browser.component.css']
})
export class SourceBrowserComponent implements OnInit {
  safeLocation: SafeResourceUrl;

  @Input()
  set location(location: Location) {
  	if (location) {
	  	this.safeLocation = this.sanitizer.bypassSecurityTrustResourceUrl(
	  		location.source.file + "#page=" + location.page
	  	);
	 }
  }
  
  constructor(private sanitizer: DomSanitizer) { }


  ngOnInit() {
  	// if (!this.selectedLocation) {
  	// 	this.selectedLocation = Object.assign(new Location(), Location.EMPTY_MODEL);
  	// }
  }

}
