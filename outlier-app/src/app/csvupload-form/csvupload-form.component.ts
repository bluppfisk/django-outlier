import { Component } from '@angular/core';
import { Source } from '../source';
import { SourceService } from '../source.service';

@Component({
	selector: 'csvupload-form',
	templateUrl: './csvupload-form.component.html',
	styleUrls: ['./csvupload-form.component.css']
})

export class CSVUploadFormComponent {
	public error: string = null;
	public source: Source = null;
	public csvFile: File = null;

	constructor(
		public sourceService: SourceService
	) { }

	handleFileInput(files: FileList) {
		this.csvFile = files.item(0);
	}

	uploadCSV() {
		this.error = null;

		// this does not work with windows
		// if (this.csvFile.type !== "text/csv") {
		// 	this.error = "The selected file is not a CSV file";
		// } else {
		// 	this.error = ""

		if (this.source === undefined) {
			this.error += ""
		}
		this.sourceService.uploadCSV(this.csvFile, this.source)
			.subscribe(data => {
				this.error = data.numberAdded + " locations added to " + this.source.title + "!";
			});
	}

}
