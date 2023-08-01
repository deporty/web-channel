import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FileAdapter } from './adapters/file/file.adapter';
import { DirectivesModule } from './directives/directives.module';
import { IsLoggedInGuard } from './guards/is-logged-in/is-logged-in.guard';
import { IsNotLoggedInGuard } from './guards/is-not-logged-in/is-not-logged-in.guard';
import { FileService } from './infrastructure/file/file.service';
import { TokenService } from './infrastructure/services/token/token.service';
import { TimestampPipe } from './pipes/timestamp/timestamp.pipe';
import { BreadcrumbComponent } from './presentation/components/breadcrumb/breadcrumb.component';
import { CommingSoonComponent } from './presentation/components/comming-soon/comming-soon.component';
import { DefaultLoadingComponent } from './presentation/components/default-loading/default-loading.component';
import { ItemsFilterComponent } from './presentation/components/items-filter/items-filter.component';
import { LoggedInContainerComponent } from './presentation/components/logged-in-container/logged-in-container.component';
import { ModalComponent } from './presentation/components/modal/modal.component';
import { NoContentComponent } from './presentation/components/no-content/no-content.component';
import { UploadFileComponent } from './presentation/components/upload-file/upload-file.component';
import { UploadFileUsecase } from './usecases/upload-file/upload-file';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { SagePipe } from './pipes/sage.pipe';
import { BarSliderComponent } from './presentation/components/bar-slider/bar-slider.component';
import { Base64ModalComponent } from './presentation/components/base64-modal/base64-modal.component';
import { ExpansionPanelBodyComponent } from './presentation/components/expansion-panel-body/expansion-panel-body.component';
import { ExpansionPanelHeaderComponent } from './presentation/components/expansion-panel-header/expansion-panel-header.component';
import { ExpansionPanelComponent } from './presentation/components/expansion-panel/expansion-panel.component';
import { FloatingMenuComponent } from './presentation/components/floating-menu/floating-menu.component';
import { GraphComponent } from './presentation/components/graph/graph.component';
import { HourInputComponent } from './presentation/components/hour-input/hour-input.component';
import { LocationPermissionModalComponent } from './presentation/components/location-permission-modal/location-permission-modal.component';
import { MapComponent } from './presentation/components/map/map.component';
import { MultiInputComponent } from './presentation/components/multi-input/multi-input.component';
import { PadComponent } from './presentation/components/pad/pad.component';
import { SidenavComponent } from './presentation/components/sidenav/sidenav.component';
import { SkeletonComponent } from './presentation/components/skeleton/skeleton.component';
import { SortableListComponent } from './presentation/components/sortable-list/sortable-list.component';

const COMPONENTS = [
  UploadFileComponent,
  TimestampPipe,
  BreadcrumbComponent,
  LoggedInContainerComponent,
  DefaultLoadingComponent,
  CommingSoonComponent,
  ModalComponent,
  NoContentComponent,
  ItemsFilterComponent,
  PadComponent,
  BarSliderComponent,
  Base64ModalComponent,
  SagePipe,
  FloatingMenuComponent,
  SidenavComponent,
  SkeletonComponent,
  BarSliderComponent,
  ExpansionPanelComponent,
  ExpansionPanelHeaderComponent,
  ExpansionPanelBodyComponent,
  HourInputComponent,
  MapComponent,
  LocationPermissionModalComponent,
  GraphComponent,
  SortableListComponent,
  MultiInputComponent,
];
@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    MatButtonModule,
    DirectivesModule,
    MatIconModule,
    MatFormFieldModule,
    MatSidenavModule,
    FormsModule,
    MatInputModule,
    MatListModule,
    MatExpansionModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    RouterModule,
    MatCheckboxModule,
    MatIconModule,
    NgChartsModule,
  ],
  exports: [...COMPONENTS, DirectivesModule],
  providers: [
    TokenService,
    IsLoggedInGuard,
    IsNotLoggedInGuard,
    UploadFileUsecase,
    {
      provide: FileAdapter,
      useClass: FileService,
    },
  ],
})
export class CoreModule {}
