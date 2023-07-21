import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { UserAdapter } from './user.adapter';
import { UserService } from './user.service';

@NgModule({
  providers: [
    {
      provide: UserAdapter,
      useClass: UserService,
    },
  ],
  imports: [HttpClientModule],
})
export class InfrastructureModule {}
