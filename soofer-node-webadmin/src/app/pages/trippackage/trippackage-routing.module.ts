import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
import { FormsComponent } from './trippackage.component';
import { FormInputComponent } from './add/form-inputs.component';
import { OutstationComponent } from './outstation/outstation.component';
import { Service } from './trippackage.service';
import { CommonService } from '../common/common.service'
const routes: Routes =[{
 path:'',
 component:FormsComponent,
 children:[{
     path:'add',
     component:FormInputComponent,
 },
 {
     path:'outstation',
     component:OutstationComponent,
 },
],
}]
@NgModule({
    imports:[
        RouterModule.forChild(routes),
    ],
    providers :[ Service, CommonService],
    exports:[
        RouterModule,
    ],
})
export class FormRoutingModule{

}
export const routedComponents =[
    FormsComponent,
    FormInputComponent,
    OutstationComponent

];
