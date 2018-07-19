import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CharService } from '../char.service';
import { SourceService } from '../source.service';
import { Char } from '../char';
import { Source } from '../source';

@Component({
  selector: 'app-char-details',
  templateUrl: './char-details.component.html',
  styleUrls: ['./char-details.component.css']
})

export class CharDetailsComponent implements OnInit {
	@Input() char: Char;
	sources: Source[];

  constructor(
  	private route: ActivatedRoute,
  	private charService: CharService,
    private sourceService: SourceService
  ) { }

  addLocation(sourceId: number, pageNo: number): void {
    if (pageNo < 1 || !sourceId) {
      return;
    }

    var newLocation = {
      source: this.findById(this.sources, sourceId),
      page: pageNo,
      id: null
    }

    this.charService.addLocation(sourceId, pageNo, this.char.id)
      .subscribe(data => {
        newLocation.id = data.id;
        this.char.locations.push(newLocation);
      });
  }

  deleteLocation(locationId: number): void {
    this.charService.deleteLocation(locationId, this.char.id)
      .subscribe(data => {
        console.log(data);

        this.popFromArray(this.char.locations, locationId);
        // var obj = this.char.locations.filter(function(el) { return el.id === locationId });
        // var index = this.char.locations.indexOf(obj[0]);
        // this.char.locations.splice(index, 1);
      });
  }

  getChar(id: number): void {
  	if (id == 0) {
  		this.char = null;
  		return;
  	}

    this.getSources();

  	this.charService.getChar(id)
  		.subscribe(data => {
        console.log(data);
        data.char.locations.forEach(location => {
          location.source = this.findById(data.sources, location.source);
  		  });
        data.char.altchars.forEach(altchar => {
          altchar.location = this.findById(data.sources, altchar.location);
        });
        this.char = data.char;
      }
    );
  }

  findSourceById(id): Source {
    var source;

    for (var i=0; i<this.sources.length; i++) {
      if (this.sources[i].id === id) {
        return this.sources[i];
      }
    }
  }

  private popFromArray(array, id: number): void {
    var index = array.indexOf(this.findById(array, id));
    array.splice(index, 1);
  }

  private getSources(): void {
    this.sourceService.listSources().subscribe(sources => {
      this.sources = sources;
    });
  }

  private findById(array, id) {
    for (var i=0; i < array.length; i++) {
      if (array[i].id === id) {
        return array[i];
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
