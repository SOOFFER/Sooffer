import { NgModule } from '@angular/core';
import { SelectModule } from 'ng-select';
import { ThemeModule } from '../../@theme/theme.module';
import { FormRoutingModule, routedComponents } from './trippackage-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
    imports: [
        ThemeModule,
        SelectModule,
        FormRoutingModule,
        NgMultiSelectDropDownModule,
    ],
    declarations: [
        ...routedComponents,
    ]
})
export class FormsModule {

}
