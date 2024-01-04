import { Component } from '@angular/core';
import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';
import { ChartService } from '../charts.service'
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';

@Component({
  selector: 'ngx-echarts',
  styleUrls: ['./echarts.component.scss'],
  templateUrl: './echarts.component.html',
})
export class EchartsComponent {

  period: any = 'week';

 
  pieChartPeriod: any = 'week';
  dropdownList: any;
  selCity: any;






  Filter(){
    
  }
  



  setPeriodAndGetChartData(value: any): void {
    if (this.period !== value) {
      this.period = value;
    }
  }

  setPieChartPeriodAndGetChartData(value: any): void {
    if (this.pieChartPeriod !== value) {
      this.pieChartPeriod = value;
    }
  }
}
