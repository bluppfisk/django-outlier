import { Component, OnInit, Input } from '@angular/core';
import { Source } from '../source';

@Component({
  selector: 'source-form',
  templateUrl: './source-form.component.html',
  styleUrls: ['./source-form.component.css']
})
export class SourceFormComponent implements OnInit {
	@Input() source: Source;
	private editing: boolean = false;

  constructor() { }

  ngOnInit() {
  	if (this.source === undefined) {
  		this.source = Object.assign(new Source(), Source.EMPTY_MODEL);
  		this.editing = true;
  	}
  }

  addSource() {
  	
  }

  edit() {
  	this.editing = true;
  }

  cancelEdit() {
  	this.editing = false;
  }

}
