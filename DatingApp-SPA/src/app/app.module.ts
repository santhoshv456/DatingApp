import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';


import { AppComponent } from './app.component';
import { ValueComponent } from './value/value.component';
import { HttpClientModule } from '@angular/common/http';
import { NavComponent } from './nav/nav.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from './_services/auth.service';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './Register/Register.component';
import { ErrorInterceptorProvider } from './_services/error.interceptor';
import { MemberListComponent } from './member-list/member-list.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './_guards/auth.guard';

@NgModule({
   declarations: [
      AppComponent,
      ValueComponent,
      NavComponent,
      HomeComponent,
      RegisterComponent,
      MemberListComponent,
      ListsComponent,
      MessagesComponent
   ],
   imports: [
      BrowserModule,
      HttpClientModule,
      FormsModule,
      BrowserAnimationsModule,
      BsDropdownModule.forRoot(),
      RouterModule.forRoot([
         { path: '', component: HomeComponent },
         {
            path: '',
            runGuardsAndResolvers: 'always',
            canActivate: [AuthGuard],
            children: [
               { path: 'members', component: MemberListComponent },
               { path: 'messages', component: MessagesComponent },
               { path: 'lists', component: ListsComponent }]
         },
         { path: '**', redirectTo: '', pathMatch: 'full' }
      ])
   ],
   providers: [
      AuthService,
      ErrorInterceptorProvider
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
