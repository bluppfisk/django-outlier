import { Component, OnInit, Input } from '@angular/core';
import { Source } from '../source';
import { SourceService } from '../source.service';

@Component({
  selector: 'source-form',
  templateUrl: './source-form.component.html',
  styleUrls: ['./source-form.component.css']
})
export class SourceFormComponent implements OnInit {
	@Input() source: Source;
	private editing: boolean = false;
  private sourceFile: File = null;

  constructor(private sourceService: SourceService) { }

  ngOnInit() {
  	if (this.source === undefined) {
  		this.source = Object.assign(new Source(), Source.EMPTY_MODEL);
  		this.editing = true;
  	}
  }

  handleFileInput(files: FileList) {
    if (files.length > 0) {
      this.sourceFile = files.item(0);
    }
  }

  saveSource() {
    this.editing = false;
    this.sourceService.updateSource(this.source)
      .subscribe(data => {
        this.sourceFile = null;
        console.log(data);
        // this.source = Object.assign(new Source(), Source.EMPTY_MODEL);
      });
  }

  addSource() {
    this.editing = false;
  	this.sourceService.fileToS3(this.sourceFile)
      .subscribe(data => {
        if (data) {
          this.sourceService.addSource(this.source)
            .subscribe(data => {
              this.source = Object.assign(new Source(), Source.EMPTY_MODEL);
            })
        }
      });
  }

  edit() {
  	this.editing = true;
  }

  cancelEdit() {
  	this.editing = false;
  }

}
