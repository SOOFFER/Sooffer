import { Component, Input } from '@angular/core';
import { DashboardService } from '../dashboard.service'; 

@Component({
  selector: 'ngx-status-card',
  styleUrls: ['./status-card.component.scss'],
  template: `
    <nb-card  [ngClass]="{'off': !on}">
      <div class="icon-container">
        <div class="icon {{ type }}">
          <ng-content></ng-content>
        </div>
      </div>

      <div class="details">
        <div class="title">{{ title }}</div>
        <div>{{ status }}</div>
        <span class="pull-right">{{ spanvalue }}</span>
      </div>
    </nb-card>
  `,
})
export class StatusCardComponent {

  @Input() title: string;
  @Input() type: string;
  @Input() status: string;
  @Input() spanvalue: string;
  @Input() on = true;
  
  constructor(private dataService: DashboardService) { }
 
}
