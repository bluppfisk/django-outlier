import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { SourceService } from '../source.service';
import { Source } from '../source';

@Component({
  selector: 'source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.css']
})

export class SourceComponent implements OnInit {
	private sources: Source[] = [];
	private sourceSubscription: Subscription = null;

  constructor(private sourceService: SourceService) { }

  ngOnInit() {
  	this.sourceSubscription = this.sourceService.sourcesList
  		.subscribe(sources => {
  			this.sources = sources;
  		});
	this.sourceService.listSources().subscribe();
  }

  ngOnDestroy() {
  	this.sourceSubscription.unsubscribe();
  }

}
