import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ReviewAnalysisChartComponent } from '../chart-components/review-analysis-chart/review-analysis-chart.component';
import { AmazonProductService } from '../../../core/services/amazon-product/amazon-product.service';
import { finalize } from 'rxjs';

export interface Review {
  reviewTitle: string;
  reviewDetail: string;
  rating: string;
  reviewed_by_name: string;
  reviewed_date: Date;
  verfied_purchase: boolean;
  category: string;
}

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent implements OnChanges, OnInit {

  showChart:boolean = false;
  isLoading:boolean = false;
  chartApiCall$:any;
  chartData:any;

  constructor(
    private cdRef: ChangeDetectorRef,
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    private amazonProductService: AmazonProductService,
  ){}
  
  ngOnChanges(changes: SimpleChanges): void {
    this.loadReviews(this.data);
    console.log(this.isLoadingReviews);
  }

  @Input('data') data:any;
  @Input() isLoadingReviews!:boolean;

  @ViewChild(MatSort) sort!: MatSort;

  ReviewData: Review[] = [];
  dataSource = new MatTableDataSource<Review>(this.ReviewData);

  displayedColumns: string[] = ['index', 'reviewTitle', 'reviewDetail', 'rating', 'reviewed_by_name', 'reviewed_date', 'verfied_purchase'];
  ratings: number[] = [4, 3, 2, 1];
  sortOrder: 'ascending' | 'descending' | 'date' = 'ascending';
  // show_spinner: boolean = false;
 

  ngOnInit(): void {
    if(this.data!= undefined){
      this.loadReviews(this.data.Amazon_review_info);
    }
    console.log(this.isLoadingReviews);
    
   
  }



  loadReviews(reviewdata:any){
    debugger
 
   if(reviewdata)
     if(Array.isArray(reviewdata.Amazon_review_info)){
      this.dataSource.data = reviewdata.Amazon_review_info      ;
      this.cdRef.detectChanges(); // Manually trigger change detection

     }else{
      console.error("Expected an array for Amazon_review_info, but got:", typeof this.data.Amazon_review_info);
   }
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  // ratings: number[] = [1, 2, 3, 4]; // Example rating options
  selectedRating: number | null = null; 

  applyFilter(event: Event) {
  const selectElement = event.target as HTMLSelectElement;
  const filterValue = parseFloat(selectElement.value.trim());

  if (!isNaN(filterValue)) {
    this.selectedRating = filterValue;

    this.dataSource.filterPredicate = (data: Review, filter: string) => {
      const rating = parseFloat(data.rating);
      if (filterValue === 4.0) {
        return rating >= filterValue;
      } else {
        return rating === filterValue;
      }
    };

    this.dataSource.filter = filterValue.toString();
    this.cdRef.detectChanges(); // Manually trigger change detection if needed
  }
    // if (event !== undefined && event !== null) {
    //   const filterValue = parseFloat(event.value.toString().trim());

    //   this.dataSource.filterPredicate = (data: Review, filter: string) => {
    //     const rating = parseFloat(data.rating);
    //     if (filterValue === 4.0) {
    //       return rating >= filterValue;
    //     } else {
    //       return rating === filterValue;
    //     }
    //   };

    //   this.dataSource.filter = filterValue.toString();
      
    //   this.cdRef.detectChanges(); // Manually trigger change detection
    // }
  }

  changeSortOrder(event: Event) {
    const selectElement = event.target as HTMLSelectElement;  // Cast EventTarget to HTMLSelectElement
    const sortOrder = selectElement.value;  // Now access the value property safely
  
    switch (sortOrder) {
      case 'ratingLowToHigh':
        this.sort.active = 'rating';
        this.sort.direction = 'asc';
        break;
      case 'ratingHighToLow':
        this.sort.active = 'rating';
        this.sort.direction = 'desc';
        break;
      case 'date':
        this.sort.active = 'reviewed_date';
        this.sort.direction = 'asc';
        break;
      default:
        this.sort.active = '';
        this.sort.direction = '';
        break;
    }
  
    // Reapply sorting with the new sortOrder
    this.dataSource.sort = this.sort;
  }


  //Review Analysis Chart method
  OpenReviewAnalysisChart() {
     this.isLoading = true;

    if(this.ReviewData!=undefined  ){
      const jsonReviewData = JSON.stringify(this.data);
      this.chartApiCall$ = this.amazonProductService.Review_Analysis_Chart(jsonReviewData);
      this.callapi();
    }
  }

  callapi(){
    this.chartApiCall$.pipe(
    finalize(() => {
        //Stoping Loading after complete response
        this.isLoading=false;
      })
    ).subscribe((responseData:any)=>{
       this.showChart = true;
       this.chartData = responseData;
      },(error:any) =>{
      this.showChart = false;
      this.isLoading=false;
    })    
  }

  closechart(){
    this.showChart = false;
  }

}
