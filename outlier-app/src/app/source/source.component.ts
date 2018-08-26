import { Component, OnInit } from '@angular/core';
import { SourceService } from '../source.service';
import { Source } from '../source';

@Component({
  selector: 'source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.css']
})
export class SourceComponent implements OnInit {
	private sources: Source[] = [];

  constructor(private sourceService: SourceService) { }

  ngOnInit() {
  	this.sourceService.listSources()
  		.subscribe(sources => {
  			this.sources = sources;
  		});
  }

}
