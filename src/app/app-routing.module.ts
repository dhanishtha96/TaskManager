import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListViewComponent } from './tasks/listView/listView.component';
import { BucketViewComponent } from './tasks/bucketView/bucketView.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';

const routes: Routes = [
  { path: '', component: ListViewComponent},
  { path: 'bucket', component: BucketViewComponent},
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent}
]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
