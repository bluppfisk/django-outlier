import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CharDetailsComponent } from './char-details/char-details.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OutlierNavComponent } from './outlier-nav/outlier-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatSelectModule, MatInputModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatGridListModule, MatCardModule, MatMenuModule, MatTableModule, MatPaginatorModule, MatSortModule, MatExpansionModule } from '@angular/material';
import { OutlierDashComponent } from './outlier-dash/outlier-dash.component';
import { OutlierTableComponent } from './outlier-table/outlier-table.component';

import { CharService } from './char.service';

import { RouterModule, Routes } from '@angular/router';
import { CharSearchComponent } from './char-search/char-search.component';

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
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
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
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
  	CharService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
