import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ItabComponent, patentdata, Result, value } from '../../../../../../../core/model/interfaces';
import { TabService } from '../../../../../../../core/services/marketTabService/tab.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { AmazonProductService } from '../../../../../../../core/services/amazon-product/amazon-product.service';
import { finalize, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-innovation',
  templateUrl: './innovation.component.html',
  styleUrl: './innovation.component.scss'
})
export class InnovationComponent implements ItabComponent, OnInit, OnDestroy {



  patentSearchForm: any = FormGroup;
  patentData!: patentdata;
  resultData: any;
  dataSource = new MatTableDataSource<value>();
  isLoading:boolean = false;

  @Input() IsActive: boolean = true;

  displayedColumns: string[] = ['index', 'patentnumber', 'applicant'];

  unsubscribe$ = new Subject<void>();

  constructor(private tabService: TabService,
    private formBuilder: FormBuilder,
    private amazonProductService: AmazonProductService,
  ) { }
  

  CanClose(): boolean {
    return true;
  }

  ngOnInit(): void {
    this.patentSearchForm = this.formBuilder.group({
      title: [''],
      patentNumber: [''],
      type: [''],
      keyword: ['']
    })
  }


  handleSubmit() {
    this.isLoading = true;
    const formdata = this.patentSearchForm.value;

    this.amazonProductService.market_patent_search(formdata).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => {
         this.isLoading = false
      })
    ).subscribe(res => {
      this.isLoading = false
      this.patentData = res;
      console.log(this.patentData);
      this.resultData = this.patentData.data.result;

      let keydata!: any;

      const highestResult = this.findHighestResult(this.resultData);
      if (highestResult) {
        keydata = highestResult.key;
        console.log(`Highest result is for key ${highestResult.key} with ${highestResult.value.length} elements.`);
      } else {
        console.log('No results found.');
      }
      this.dataSource = new MatTableDataSource<value>(this.patentData.data.result[keydata])
    },
      error => {
        this.isLoading = false
        console.error('Error fetching search results:', error);
        // Handle error here if needed
      })
  }


  createInnovation() {
    this.tabService.addNewTab('Innovation');
  }

  // Function to find the result with the highest number of elements
  findHighestResult(result: Result): { key: string, value: any[] } | null {
    let highestKey: string | null = null;
    let highestValue: any[] = [];

    for (const key in result) {
      if (result.hasOwnProperty(key)) {
        const value = result[key];
        if (value.length > highestValue.length) {
          highestKey = key;
          highestValue = value;
        }
      }
    }
    return highestKey ? { key: highestKey, value: highestValue } : null;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
