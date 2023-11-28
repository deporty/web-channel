import {
  AfterViewInit,
  ChangeDetectionStrategy,
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

@Component({
  selector: 'app-player-form',
  templateUrl: './player-form.component.html',
  styleUrls: ['./player-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerFormComponent implements OnInit, AfterViewInit, OnChanges {
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
  @Input() indi!: string;

  @Output('emit-data') emitData: EventEmitter<any>;

  selectedPlayers: Id[];

  stadisticsMap: { [memberId: Id]: StadisticSpecification };
  selectedPlayersMap: any;
  constructor(private cd: ChangeDetectorRef) {
    this.playersForm = [];
    this.selectedPlayers = [];
    this.selectedPlayersMap = {};
    this.emitData = new EventEmitter();
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

      for (const item of this.selectedPlayers) {
        this.selectedPlayersMap[item] = true;
      }
    }
    setTimeout(() => {
      this.cd.detectChanges();
    }, 1000);

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

  onAddCard(
    data: any,
    player: MemberEntity,
    kindCard: 'redCards' | 'yellowCards'
  ) {
    const emptyStadistic = this.generateEmptyStadistics(player);
    const playerStadistic: StadisticSpecification =
      this.stadisticsMap[player.id!] || emptyStadistic;

    const total: 'totalRedCards' | 'totalYellowCards' =
      kindCard == 'redCards' ? 'totalRedCards' : 'totalYellowCards';
    playerStadistic[kindCard] = [...data.cards];
    playerStadistic[total] = data.total as number;
    this.emit();
  }

  onAddGoal(data: any, player: MemberEntity) {
    const emptyStadistic = this.generateEmptyStadistics(player);

    const playerStadistic: StadisticSpecification =
      this.stadisticsMap[player.id!] || emptyStadistic;

    playerStadistic.goals = [...data.goals];
    playerStadistic.totalGoals = data.total as number;
    this.emit();
  }

  // addGoal(player: MemberEntity) {
  //   const minute = this.minute;
  //   const kindGoal = this.selectedKindGoal;

  //   this.setPlayerConfig(player);
  //   const prev = this.getStadisticByPlayer(player);

  //   const existsPrev =
  //     !!prev && prev.goals
  //       ? prev['goals'].filter((x: any) => {
  //           return x.minute == minute;
  //         })
  //       : [];
  //   if (existsPrev.length == 0) {
  //     if (prev?.goals) {
  //       prev.goals.push({
  //         time: { minute, second: 0 },
  //         kind: kindGoal,
  //       });
  //     }
  //   }

  //   this.emitData.emit({
  //     stadistics: this.stadistics,
  //     playersForm: this.selectedPlayers,
  //   });
  // }

  // addCard(player: MemberEntity, key: string) {
  //   let minute = this.minuteCard;
  //   if (key == 'redCards') {
  //     minute = this.redMinuteCard;
  //   }

  //   this.setPlayerConfig(player);

  //   // const existsPrev = this.stadistics[player.id][key].indexOf(minute);
  //   // if (existsPrev == -1) {
  //   //   this.stadistics[player.id][key].push(minute);
  //   // }

  //   this.emitData.emit({
  //     stadistics: this.stadistics,
  //     playersForm: this.selectedPlayers,
  //   });
  // }

  setPlayerConfig(player: MemberEntity) {
    // if (!(player.id in this.stadistics)) {
    //   this.stadistics[player.id] = {
    //     goals: [],
    //     redCards: [],
    //     yellowCards: [],
    //   };
    // }
  }

  selectPlayer(member: MemberEntity) {
    const index: number = this.selectedPlayers.findIndex((id: Id) => {
      return id === member.id;
    });

    if (index >= 0) {
      this.selectedPlayers.splice(index, 1);
    } else {
      this.selectedPlayers.push(member.id!);
    }

    this.emit();
  }

  emit() {
    this.emitData.emit({
      stadistics: Object.values(this.stadisticsMap).filter((s) => {
        return (
          s.totalGoals > 0 || s.totalRedCards > 0 || s.totalYellowCards > 0
        );
      }),
      playersForm: this.selectedPlayers,
    });
  }
}
