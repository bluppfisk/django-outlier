import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { OutlierTableDataSource } from './outlier-table-datasource';

@Component({
  selector: 'app-outlier-table',
  templateUrl: './outlier-table.component.html',
  styleUrls: ['./outlier-table.component.css']
})
export class OutlierTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: OutlierTableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name'];

  ngOnInit() {
    this.dataSource = new OutlierTableDataSource(this.paginator, this.sort);
  }
}
