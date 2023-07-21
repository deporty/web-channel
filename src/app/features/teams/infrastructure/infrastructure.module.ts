import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamAdapter } from '../adapters/team.adapter';
import { TeamService } from './team/team.service';
import { InfrastructureModule as PlayerInfrastructureModule } from "../../users/infrastructure/infrastructure.module";
import { SportAdapter } from '../adapters/sport.adapter';
import { SportService } from './sport/sport.service';
import { MemberAdapter } from '../adapters/member.adapter';
import { MemberService } from './member/member.service';



@NgModule({
  declarations: [],
  providers:[
    {
      provide: TeamAdapter,
      useClass: TeamService
    },
    {
      provide: SportAdapter,
      useClass: SportService
    },
    {
      provide: MemberAdapter,
      useClass: MemberService
    }
  ],
  imports: [
    CommonModule,
    PlayerInfrastructureModule
  ]
})
export class InfrastructureModule { }
