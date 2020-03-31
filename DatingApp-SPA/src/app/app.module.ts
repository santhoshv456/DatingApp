import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import {JwtModule} from '@auth0/angular-jwt';
import {TabsModule} from 'ngx-bootstrap';
import { NgxGalleryModule } from 'ngx-gallery';

import { AppComponent } from './app.component';
import { ValueComponent } from './value/value.component';
import { HttpClientModule } from '@angular/common/http';
import { NavComponent } from './nav/nav.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from './_services/auth.service';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './Register/Register.component';
import { ErrorInterceptorProvider } from './_services/error.interceptor';
import { MemberListComponent } from './members/member-list/member-list.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './_guards/auth.guard';
import { MembersCardComponent } from './members/members-card/members-card.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDeatilResolver } from './_resolvers/member-detail.resolver';
import { MemberListResolver } from './_resolvers/memberList.resolver';


export function tokenGetter() {
   return localStorage.getItem('token');
}

export class CustomHammerConfig extends HammerGestureConfig  {
   overrides = {
       pinch: { enable: false },
       rotate: { enable: false }
   };
}


@NgModule({
   declarations: [
      AppComponent,
      ValueComponent,
      NavComponent,
      HomeComponent,
      RegisterComponent,
      MemberListComponent,
      ListsComponent,
      MessagesComponent,
      MembersCardComponent,
      MemberDetailComponent
   ],
   imports: [
      BrowserModule,
      HttpClientModule,
      FormsModule,
      BrowserAnimationsModule,
      NgxGalleryModule,
      BsDropdownModule.forRoot(),
      TabsModule.forRoot(),
      JwtModule.forRoot({
         config: {
            tokenGetter,
            whitelistedDomains: ['localhost:5000'],
            blacklistedRoutes: ['localhost:5000/api/auth']
         }
      }),
      RouterModule.forRoot([
         { path: '', component: HomeComponent },
         {
            path: '',
            runGuardsAndResolvers: 'always',
            canActivate: [AuthGuard],
            children: [
               { path: 'members', component: MemberListComponent, resolve: { users: MemberListResolver} },
               { path: 'members/:id', component: MemberDetailComponent, resolve: {user: MemberDeatilResolver} },
               { path: 'messages', component: MessagesComponent },
               { path: 'lists', component: ListsComponent }]
         },
         { path: '**', redirectTo: '', pathMatch: 'full' }
      ])
   ],
   providers: [
      AuthService,
      ErrorInterceptorProvider,
      MemberDeatilResolver,
      MemberListResolver,
      { provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig }
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
