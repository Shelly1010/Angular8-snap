import { Component, ElementRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import data  from '../assets/test_analysis.json';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements AfterViewInit {
  title = 'Top 5 brands';
  title2 = 'Brand';
  products: any = data.ResultSet.row;
  searchString = '';
  section1: boolean = true;
  type='PieChart';
  type2='BarChart';
  chartData: any = [];
  barChartData: any = [];
  columnNames = ['Count', 'Percentage'];
  options = {    
  };
  width = 600;
  height = 400;
  tableValues:any =[];
  uniqueBrands:any =[];
  ctx:any = [];
  canvasWidth = 500;
  canvasHeight = 500;


  @ViewChild('canvas', { static: true }) canvasEl: ElementRef

  constructor() {

    //table values
    var groups = new Set(this.products.map(item => item.upc));
    this.tableValues = [];
    groups.forEach(g => 
      this.tableValues.push({
        name: g,
        values: this.products.filter(i => i.upc === g)
      }
    ))

//for pie chart calculations ---- start------
    let brandsArray = this.products.map(a => a.brandName); //extract brandName key from array of objects & create an array
    
    let mapBrands = brandsArray.reduce(function(prev, cur) { //count for each product
      prev[cur] = (prev[cur] || 0) + 1;
      return prev;
    }, {});
   
    //sorting done for results
    let sortable = [];
    for (var x in mapBrands ) {
        sortable.push([x, mapBrands[x]]);
    }
    sortable.sort(function(a, b) {
        return b[1] - a[1];
    });

    //get top 5 brands
    mapBrands = sortable.splice(0,5);

    //get others count
    let otherCount = 0;
    for(let i=0;i< sortable.length; i++){
      otherCount+= sortable[i][1];
    }
    //push others to main array
    mapBrands.push(['Others',otherCount]);

    this.chartData = mapBrands;

    //for pie chart calculations ---- end------


    //for bar chart calculations ---- start------
    this.uniqueBrands = brandsArray.filter((item, i, ar) => ar.indexOf(item) === i);
  }

  ngAfterViewInit(){
    this.ctx = this.canvasEl.nativeElement.getContext('2d');
    this.canvasEl.nativeElement.width =  this.canvasWidth;
    this.canvasEl.nativeElement.height =  this.canvasHeight;
    //Loading of the home test image - img1
    var img1 = new Image();
    //drawing of the test image - img1
    img1.onload = ()=> {
        //draw background image
        var ratioW = (img1.width/this.canvasWidth);
        var ratioH = (img1.height/this.canvasHeight);
        this.ctx.drawImage(img1, 0, 0, this.canvasWidth, this.canvasHeight);
        
        //draw a box over the top
        for(let i=0;i <this.products.length;i++){
          this.ctx.beginPath();
          this.ctx.rect(this.products[i].x /ratioW, this.products[i].y/ratioH, this.products[i].width / ratioW, this.products[i].height /ratioH);
          this.ctx.strokeStyle = "red";
          this.ctx.stroke();
        }
    };
    img1.src = 'https://storage.googleapis.com/snap2insight-livedemo/assessment/test_image.jpg';
  }
  onOptionsSelected(valueSelected){
  
    let index, saveVar;
      for(let i=0;i<this.tableValues.length;i++){
        let obj = this.tableValues[i].values.find(x => x.brandName == valueSelected);
        index = this.tableValues[i].values.indexOf(obj);
        saveVar = i;
        if(index != -1)
        break;
      }

      let arrayToCheck = this.tableValues[saveVar];
      let totalFacings = this.tableValues[saveVar].values.length;
      let topCount = 0;
      let bottomCount = 0;
      let middleCount = 0;

      for(let i=0;i<arrayToCheck.values.length;i++){
        if(arrayToCheck.values[i].shelfLevel == 'Bottom')
        bottomCount++;
        else if(arrayToCheck.values[i].shelfLevel == 'Top')
        topCount++;
        else
        middleCount++;
      }

      this.barChartData = [
        ["Top", (topCount/totalFacings)*100],
        ["Middle", (middleCount/totalFacings)*100],
        ["Bottom", (bottomCount/totalFacings)*100]
     ];
  }
}
