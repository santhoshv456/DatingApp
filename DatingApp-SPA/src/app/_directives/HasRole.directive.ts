import { Directive, Input, ViewContainerRef, TemplateRef, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit {
@Input() appHasRole: string[];
isVisiable = false;

  constructor(private viewContainerRef: ViewContainerRef, private templateRef: TemplateRef<any>,
              private auth: AuthService ) { }

  ngOnInit(): void {
     const userRoles = this.auth.decodedToken.roles as Array<string> ;
     if (!userRoles) {
       this.viewContainerRef.clear();
     }

     if (this.auth.isMatch(this.appHasRole)) {
         if (!this.isVisiable) {
              this.isVisiable = true;
              this.viewContainerRef.createEmbeddedView(this.templateRef);
         } else {
             this.isVisiable = false;
             this.viewContainerRef.clear();
         }
     }
  }

}
