import { Component, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import "ag-grid-enterprise";
import { GridOptions,  GridApi,IServerSideDatasource ,IServerSideGetRowsParams } from 'ag-grid-community';
import { analyzeAndValidateNgModules } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
   gridApi;
   gridColumnApi;
   columnDefs;
   defaultColDef;
   rowModelType;
   cacheBlockSize:number;
   maxBlocksInCache:number;
   rowData: [];
   startRow:number=0;
   endRow:number =-1;
  cacheOverflowSize:number;
  maximumNumberOfCallToServer:number=0;
  totalRowsLoaded:number=0;

  constructor(private http: HttpClient) {
    this.columnDefs = [
      {
        field: "athlete",
        width: 150
      },
      { field: "age" },
      { field: "country" },
      { field: "year" },
      { field: "sport" },
      { field: "gold" },
      { field: "silver" },
      { field: "bronze" }
    ];
    this.defaultColDef = {
      width: 120,
      resizable: true
    };
    this.rowModelType = "serverSide";
    this.cacheBlockSize = 20;
  }

  
  dataSource: IServerSideDatasource  = {

    getRows: (params: IServerSideGetRowsParams) => {
      this.apiService().subscribe(data => {
        console .log (data);
       var rowsThisPage = data.slice(params.request.startRow,(params.request.startRow+params.request.endRow)/2);       //  this is to fake a server side data return which is only a
       // portion of the number of  requested rows from UI. This is what happened in my case when I do a grouping on the server side which reduces the number of rows returned
       //  e.g. if I request for 100 rows, I get 100 rows from the SQL db and do the grouping . After the grouping, the number of rows get reduced to 50-70 depending the grouping
       this.totalRowsLoaded = this.totalRowsLoaded + this.cacheBlockSize;

       var lastRow = this.maximumNumberOfCallToServer >5 ? this.totalRowsLoaded : -1; // to limit the number of calls to the server

       this.maximumNumberOfCallToServer++;

        setTimeout(function(){params.successCallback(
          rowsThisPage,
          lastRow
        );
        },500)
      })
    }
  }

  apiService():any {    
  
  return this.http
  .get("https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinners.json"); 
    
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setServerSideDatasource(this.dataSource);
  }


  }



