import { environment } from '../../environments/environment';

import { Component, OnInit, Input, Output } from '@angular/core';
import { Source } from '../source';
import { SourceService } from '../source.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'source-form',
  templateUrl: './source-form.component.html',
  styleUrls: ['./source-form.component.css']
})

export class SourceFormComponent implements OnInit {
  @Input() source: Source;
  percentDone: number = 0;
  editing: boolean = false;
  uploading: boolean = false;
  sourceFile: File = null;
  pathPrefix: string = environment.s3URL + environment.sourcePath;

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
            .subscribe(event => {
              if (event.type === HttpEventType.UploadProgress) {
                this.percentDone = Math.round(100 * event.loaded / event.total);
              }
              if (event.type === HttpEventType.Response) {
                this.source.file = this.sourceFile.name;
                this.uploading = false;
                this.sourceService.updateSource(this.source).subscribe(_ => {
                  this.sourceFile = null;
                });
              }
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
          .subscribe(event => {
            if (event.type === HttpEventType.UploadProgress) {
              this.percentDone = Math.round(100 * event.loaded / event.total);
            }
            if (event.type === HttpEventType.Response) {
              this.source.file = this.sourceFile.name;
              this.uploading = false;
              this.sourceService.addSource(this.source)
                .subscribe(_ => {
                  this.source = Object.assign(new Source(), Source.EMPTY_MODEL);
                  this.sourceFile = null;
                  this.editing = true;
                });
            }
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
