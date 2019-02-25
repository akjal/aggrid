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
      { field: "id" },
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
       var rowsThisPage = data.slice(params.request.startRow,(params.request.startRow+params.request.endRow)/2);
       this.totalRowsLoaded = this.totalRowsLoaded + this.cacheBlockSize;

       var lastRow = this.maximumNumberOfCallToServer >5 ? this.totalRowsLoaded : -1;

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


   ServerSideDatasource(server) {
    return {
      getRows(params) {
        setTimeout(function() {
          var response = server.getResponse(params.request);
          if (response.success) {
            params.successCallback(response.rows, response.lastRow);
          } else {
            params.failCallback();
          }
        }, 500);
      }
    };
  }   

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setServerSideDatasource(this.dataSource);
  }


  }



