import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatFormFieldModule, MatSelectModule, MatInputModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatGridListModule, MatCardModule, MatMenuModule, MatTableModule, MatPaginatorModule, MatSortModule, MatExpansionModule, MatProgressSpinnerModule, MatProgressBarModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule, Routes } from '@angular/router';
import * as moment from "moment";

import { OutlierNavComponent } from './outlier-nav/outlier-nav.component';
import { CharDetailsComponent } from './char-details/char-details.component';
import { AltCharFormComponent } from './alt-char-form/alt-char-form.component';
import { CSVUploadFormComponent } from './csvupload-form/csvupload-form.component';
import { SourceBrowserComponent } from './source-browser/source-browser.component';
import { SourceComponent } from './source/source.component';
import { SourceFormComponent } from './source-form/source-form.component';

import { CharService } from './char.service';
import { SourceService } from './source.service';
import { UserService } from './user.service';
import { LoaderService } from './loader.service';

import { httpInterceptorProviders } from './httpinterceptorproviders';
import { LoaderComponent } from './loader/loader.component';

const appRoutes: Routes = [
	{ path: 'char/:id', component: CharDetailsComponent },
  { path: 'location/uploadMap', component: CSVUploadFormComponent },
  { path: 'source', component: SourceComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    CharDetailsComponent,
    OutlierNavComponent,
    AltCharFormComponent,
    SourceBrowserComponent,
    CSVUploadFormComponent,
    SourceComponent,
    SourceFormComponent,
    LoaderComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    LayoutModule,
    MatSelectModule,
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    HttpClientModule,
    MatFormFieldModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
  ],
  providers: [
  	CharService,
    SourceService,
    UserService,
    LoaderService,
    httpInterceptorProviders,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
