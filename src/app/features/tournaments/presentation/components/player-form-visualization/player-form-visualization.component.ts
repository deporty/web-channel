import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Id } from '@deporty-org/entities';
import { MemberEntity, TeamEntity } from '@deporty-org/entities/teams';
import { StadisticSpecification } from '@deporty-org/entities/tournaments';
import { GoalKind } from '@deporty-org/entities/tournaments/stadistics.entity';
import { getBreakpoint } from 'src/app/core/helpers/general.helpers';

@Component({
  selector: 'app-player-form-visualization',
  templateUrl: './player-form-visualization.component.html',
  styleUrls: ['./player-form-visualization.component.scss'],
})
export class PlayerFormVisualizationComponent
  implements OnInit, AfterViewInit, OnChanges
{


  minute!: number;

  minuteCard!: number;
  redMinuteCard!: number;

  goalKind = ['Cabeza', 'Tiro Libre'];

  selectedKindGoal!: GoalKind;

  @Input() members!: MemberEntity[];

  @Input() enabled = true;
  @Input('players-form') playersForm!: string[] | undefined;
  @Input('team') team!: TeamEntity | undefined;
  @Input() stadistics!: StadisticSpecification[];

  selectedPlayers: Id[];

  stadisticsMap: { [memberId: Id]: StadisticSpecification };
  constructor(private cd: ChangeDetectorRef) {
    this.playersForm = [];
    this.selectedPlayers = [];
    this.stadisticsMap = {};
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.members && changes.members.currentValue) {
      this.stadisticsMap = {};
      for (const member of this.members) {
        const newStadistic: StadisticSpecification =
          this.generateEmptyStadistics(member);

        const prev = this.stadistics
          ?.filter((x) => {
            return x.memberId === member.id;
          })
          .pop();
        this.stadisticsMap[member.id!] = prev || newStadistic;
      }
    }
  }
  ngAfterViewInit(): void {
    this.cd.detectChanges();

  
  }


 
  ngOnInit(): void {
    if (this.playersForm) {
      this.selectedPlayers = [...this.playersForm];
    }

    if (!this.stadistics) {
      this.stadistics = [];
    }
  }

  private generateEmptyStadistics(
    player: MemberEntity
  ): StadisticSpecification {
    return {
      memberId: player.id!,
      redCards: [],
      yellowCards: [],
      totalGoals: 0,
      totalRedCards: 0,
      totalYellowCards: 0,
    };
  }


  isSelected(member: MemberEntity) {
    return !!this.selectedPlayers.filter((id) => id === member.id).length;
  }

  
}
