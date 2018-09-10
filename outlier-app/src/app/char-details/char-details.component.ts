import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CharService } from '../char.service';
import { SourceService } from '../source.service';
import { Char } from '../char';
import { Source } from '../source';
import { AltChar } from '../altchar';
import { Location } from '../location';
import { AltCharFormComponent } from '../alt-char-form/alt-char-form.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-char-details',
  templateUrl: './char-details.component.html',
  styleUrls: ['./char-details.component.css']
})

export class CharDetailsComponent implements OnInit {
	@Input() char: Char;
  private selectedLocation: Location;
  private routeSubscription: Subscription;

  constructor(
  	private route: ActivatedRoute,
  	private charService: CharService,
    private sourceService: SourceService,
  ) { }

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe(params => {
      this.getChar(params['id']);
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  addLocation(sourceId: number, pageNo: number): void {
    if (pageNo < 1 || !sourceId) {
      return;
    }

    var newLocation: Location = Object.assign(new Location(), {
      source: this.sourceService.findSourceById(sourceId),
      page: pageNo
    });


    this.charService.addLocation(newLocation, this.char)
      .subscribe(data => {
        newLocation.id = data.id;
        this.char.locations.push(newLocation);
      });
  }

  deleteLocation(location: Location): void {
    this.charService.deleteLocation(location, this.char)
      .subscribe(data => {
        this.char.locations = this.char.locations.filter(l => l != location);
      });
  }

  getChar(id: number): void {
  	if (id == 0) {
  		this.char = null;
  		return;
  	}

  	this.charService.getChar(id)
  		.subscribe(char => {
        this.char = char;
      }
    );
  }

  locationSelected(location: Location): void {
    this.selectedLocation = location;
  }
}
