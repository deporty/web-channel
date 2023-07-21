import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

export interface PathSegment {
  path: string;
  fullPath: string;
  display: string | undefined;
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit {
  @Input() paths!: PathSegment[];
  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((x) => {});
  }

  navigate(path: string) {
    this.router.navigateByUrl(path, {
      
    });
  }
}
