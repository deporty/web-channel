import { Directive, ElementRef, Inject, Input, OnInit } from '@angular/core';
import { RESOURCES_PERMISSIONS_IT } from 'src/app/init-app';
import { hasPermission } from '../helpers/permission.helper';

@Directive({
  selector: '[appIsAllowed]',
})
export class IsAllowedDirective implements OnInit {
  @Input() identifier!: string;

  constructor(
    @Inject(RESOURCES_PERMISSIONS_IT) private resourcesPermissions: string[],
    private eR: ElementRef
  ) {}
  ngOnInit(): void {
    const response = hasPermission(this.identifier, this.resourcesPermissions);

    if (!response) {
      (this.eR.nativeElement as HTMLElement).style.setProperty(
        'display',
        'none',
        'important'
      );
    }
  }
}
