import { environment } from '../../environments/environment';

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
  private uploading: boolean = false;
  private sourceFile: File = null;
  private pathPrefix: string = environment.s3URL + environment.sourcePath;

  constructor(private sourceService: SourceService) { }

  ngOnInit() {
  	if (this.source === undefined) {
  		this.source = Object.assign(new Source(), Source.EMPTY_MODEL);
  		this.editing = true;
  	}

    if (!this.source.id) {
      this.editing = true;
    }
  }

  handleFileInput(files: FileList) {
    if (files.length > 0) {
      this.sourceFile = files.item(0);
    }
  }

  updateSource() {
    this.editing = false;

    if (this.sourceFile) {
      this.uploading = true;

      this.sourceService.getPresignedURL(this.sourceFile)
        .subscribe(presignedURL => {
          this.sourceService.uploadToS3(this.sourceFile, presignedURL)
            .subscribe(_ => {
              this.source.file = this.sourceFile.name;
              this.uploading = false;
              this.sourceService.updateSource(this.source).subscribe(_ => this.sourceFile = null);
            })   
        })
      } else {
        this.sourceService.updateSource(this.source).subscribe();
      }
    }

  deleteSource() {
    this.sourceService.deleteSource(this.source).subscribe();
  }

  addSource() {
    this.editing = false;
    this.uploading = true;

    this.sourceService.getPresignedURL(this.sourceFile)
      .subscribe(presignedURL => {
        this.sourceService.uploadToS3(this.sourceFile, presignedURL)
          .subscribe(_ => {
            this.source.file = this.sourceFile.name;
            this.uploading = false;
            this.sourceService.addSource(this.source)
              .subscribe(_ => {
                this.source = Object.assign(new Source(), Source.EMPTY_MODEL);
                this.editing = true;
              });
          })   
      })
  }

  edit() {
  	this.editing = true;
  }

  cancelEdit() {
  	this.editing = false;
  }

}
