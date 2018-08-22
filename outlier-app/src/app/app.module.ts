import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CharDetailsComponent } from './char-details/char-details.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OutlierNavComponent } from './outlier-nav/outlier-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatSelectModule, MatInputModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatGridListModule, MatCardModule, MatMenuModule, MatTableModule, MatPaginatorModule, MatSortModule, MatExpansionModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { OutlierDashComponent } from './outlier-dash/outlier-dash.component';
import { OutlierTableComponent } from './outlier-table/outlier-table.component';

import { CharService } from './char.service';
import { SourceService } from './source.service';

import { RouterModule, Routes } from '@angular/router';
import { CharSearchComponent } from './char-search/char-search.component';
import { AltCharFormComponent } from './alt-char-form/alt-char-form.component';

const appRoutes: Routes = [
	{ path: 'char/:id', component: CharDetailsComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    CharDetailsComponent,
    OutlierNavComponent,
    OutlierDashComponent,
    OutlierTableComponent,
    CharSearchComponent,
    AltCharFormComponent,
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
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
  ],
  providers: [
  	CharService,
    SourceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
