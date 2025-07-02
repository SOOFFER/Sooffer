import { NgModule } from '@angular/core';
// import { ModalComponent } from '../ui-features/modals/modal/modal.component';
import { ThemeModule } from '../../@theme/theme.module';
import { SelectModule } from 'ng-select';
import { FormsRoutingModule, routedComponents } from './vehicletype-routing.module';
import { MatChipsModule, MatIconModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule } from '@angular/material';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

@NgModule({
  imports: [
    ThemeModule,
    SelectModule,
    FormsRoutingModule,
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    NgMultiSelectDropDownModule.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  declarations: [
    ...routedComponents,
    // ModalComponent,

  ],
  entryComponents: [
    // ModalComponent,
  ]
})
export class FormsModule { }
