import { Component } from '@angular/core';

import { SourceService } from '../source.service';
import { Source } from '../source';

@Component({
  selector: 'source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.css']
})

export class SourceComponent {

  constructor(private sourceService: SourceService) { }

}
