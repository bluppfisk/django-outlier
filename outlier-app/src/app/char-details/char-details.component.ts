import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CharService } from '../char.service';
import { Char } from '../char';
import { Source } from '../source';

@Component({
  selector: 'app-char-details',
  templateUrl: './char-details.component.html',
  styleUrls: ['./char-details.component.css']
})

export class CharDetailsComponent implements OnInit {
	@Input() char: Char;
	sources: Source[] = [];

  constructor(
  	private route: ActivatedRoute,
  	private charService: CharService
  ) { }

  getChar(id: number): void {
  	if (id == 0) {
  		this.char = null;
  		return;
  	}

  	this.charService.getChar(id)
  		.subscribe(data => {
  			this.sources = [];
        this.char = data.char;
        console.log("sources");
        console.log(data.sources);
        console.log("locations");
        this.char.locations.forEach(location => {
          location.source = this.search(location.source, data.sources);
          console.log(location.source);
  		  });
        this.char = data.char;
      }
  }

  search(id: number, myArray: Array) {
    for (var i=0; i < myArray.length; i++) {
      if (myArray[i].id === id) {
        return myArray[i];
      }
    }
  }

  save(): void {}

  ngOnInit() {
	this.route.params.subscribe(params => {
		this.getChar(params['id']);
     });
  }

}
