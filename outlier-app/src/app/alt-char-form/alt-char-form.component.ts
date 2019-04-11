import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { CharService } from '../char.service';
import { SourceService } from '../source.service';
import { AltChar } from '../altchar';
import { Char } from '../char';
import { Source } from '../source';
import { Location } from '../location';

@Component({
  selector: 'alt-char-form',
  templateUrl: './alt-char-form.component.html',
  styleUrls: ['./alt-char-form.component.css']
})

export class AltCharFormComponent implements OnInit {
  @Input() altChar: AltChar;
  @Input() char: Char;
  @Output() locationEvent = new EventEmitter<Location>();

  editing: boolean = false;
  oldAltChar: AltChar;

  constructor(
    private charService: CharService,
  ) { }

  ngOnInit() {
    if (this.altChar == undefined) {
      this.altChar = Object.assign(new AltChar(), AltChar.EMPTY_MODEL);
      this.editing = true;
    }
  }

  public edit() {
    this.editing = true;
    this.oldAltChar = Object.assign(new AltChar(), this.altChar);
  }

  public cancelEdit() {
    this.altChar = Object.assign(this.altChar, this.oldAltChar);
    this.editing = false;
  }

  public addAltChar() {
    this.editing = false;
    if (this.altChar.id !== null) {
      this.charService.addAltChar(this.altChar, this.char)
        .subscribe(data => {
          this.altChar = Object.assign(new AltChar().deserialise(data));
        });
    } else {
      this.charService.addAltChar(this.altChar, this.char)
        .subscribe(data => {
          this.altChar = Object.assign(new AltChar().deserialise(data));
          this.char.altchars.push(this.altChar);
          this.altChar = Object.assign(new AltChar(), AltChar.EMPTY_MODEL);
          this.editing = true;
        });
    }
  }

  public deleteAltChar() {
    this.charService.deleteAltChar(this.altChar, this.char)
      .subscribe(data => {
        this.char.altchars = this.char.altchars.filter(ac => ac != this.altChar);
      });
  }

  public pasteImage(event: ClipboardEvent) {
    const element = event.srcElement.parentElement.parentElement,
      preview = element.querySelector('.glue64_preview')

    for (var i = 0; i < event.clipboardData.items.length; i++) {
      var item = event.clipboardData.items[i];
      if (item.type.indexOf("image") != -1) {
        console.log("Got us some image data");
        var blob = item.getAsFile();
      } else {
        console.log("Discarding non-image paste data");
      }
    }

    if (blob != null) {
      var reader = new FileReader();
      reader.onloadend = (e) => {
        var data = reader.result;
        this.altChar.image = data.toString();
      }
      reader.readAsDataURL(blob);
    } else {
      alert("not an image");
    }
  }

  locationChanged(sourceId: number) {
    var source: Source = this.char.locations.find(l => l.source.id == sourceId).source;
    var page: number = this.altChar.page || 0;
    var location = { page, source } as Location;
    this.locationEvent.emit(location);
  }
}
