import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { LoaderService } from '../loader.service';


@Component({
  selector: 'loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
	public isLoading: boolean = false;
	private loaderSubscription: Subscription = null;

  constructor(private loaderService: LoaderService) { }

  ngOnInit() {
    this.loaderSubscription = this.loaderService.isLoading
      .subscribe((isLoading: boolean) => {
        this.isLoading = isLoading;
      });
  }

  ngOnDestroy() {
    this.loaderSubscription.unsubscribe();
  }

}
