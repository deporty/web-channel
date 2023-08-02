import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Id } from '@deporty-org/entities';
import { NodeMatchEntity } from '@deporty-org/entities/tournaments';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import AppState from 'src/app/app.state';
import { getStageIndicator } from 'src/app/core/helpers/general.helpers';
import { hasPermission } from 'src/app/core/helpers/permission.helper';
import { RESOURCES_PERMISSIONS_IT } from 'src/app/init-app';
import { selectMainDrawByTournamentId } from '../../../state-management/main-draw/main-draw.selector';
import { EditNodeMatchComponent } from '../../pages/edit-node-match/edit-match.component';
import { selectTeamById } from 'src/app/features/teams/state-management/teams.selectors';
import { first } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatchVisualizationComponent } from '../match-visualization/match-visualization.component';
import { GetMainDrawByTournamentCommand } from '../../../state-management/main-draw/main-draw.commands';

interface GraficalNode {
  children: GraficalNode[];
  image?: string;
  text: {
    name: string;
  };
}
interface GraficalNodeLevel {
  id: Id;
  level: number;
  node: GraficalNode;
}

interface GraficalDuplexGeneratedNode {
  id1: Id;
  id2: Id;
  key: number;
  level: number;
  node1: GraficalNode;
  node2: GraficalNode;
}

@Component({
  selector: 'app-main-draw',
  templateUrl: './main-draw.component.html',
  styleUrls: ['./main-draw.component.scss'],
})
export class MainDrawComponent implements OnInit, AfterViewInit {
  $nodeMatches!: Observable<NodeMatchEntity[] | undefined>;
  @ViewChild('draw') container!: ElementRef;
  currentMatches!: NodeMatchEntity[];
  getStageIndicator = getStageIndicator;
  length = 0;
  nodeMatches!: Array<NodeMatchEntity>;
  @Output('on-exist-data') onExistData: EventEmitter<boolean>;
  pageSize = 2;
  pageSizeOptions: number[] = [2];
  paginatedMatches!: NodeMatchEntity[][];
  simpleChartNodeRoot: any;
  simple_chart_config: any = {
    chart: {
      container: '#tree-simple',
      rootOrientation: 'EAST',
      connectors: {
        type: 'step',
      },
    },
  };
  sortedNodeMatches: NodeMatchEntity[];
  sortedNodeMatchesOriginal: Array<NodeMatchEntity>;
  @Input('tournament-id') tournamentId!: Id;
  tree!: GraficalNode;

  constructor(
    @Inject(RESOURCES_PERMISSIONS_IT) private resourcesPermissions: string[],
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>,
    public dialog: MatDialog
  ) {
    this.onExistData = new EventEmitter<boolean>();
    this.sortedNodeMatchesOriginal = [];
    this.sortedNodeMatches = [];
    this.simpleChartNodeRoot = {
      text: {
        name: '',
      },
    };
  }

  addLastNode(lastTree: GraficalDuplexGeneratedNode): GraficalNode {
    return {
      text: {
        name: '',
      },
      children: [lastTree.node1, lastTree.node2],
    };
  }

  completeTree(
    childrenOf: GraficalDuplexGeneratedNode[],
    level: number,
    response: { tree: any }
  ) {
    if (childrenOf.length == 1) {
      response.tree = childrenOf[0];
    } else {
      const levelSubTrees = childrenOf.filter((subtree) => {
        return subtree.level === level;
      });

      const levelOtherSubTrees = childrenOf.filter((subtree) => {
        return subtree.level !== level;
      });
      if (levelSubTrees) {
        const sorted = levelSubTrees.sort((prev, curre) => {
          return prev.key < curre.key ? -1 : 0;
        });

        const newSubTrees = [];
        for (let i = 0; i < sorted.length && i + 1 < sorted.length; i += 2) {
          const elementLeft = sorted[i];
          const elementRight = sorted[i + 1];
          const upperNodeLeft = this.addLastNode(elementLeft);
          const upperNodeRight = this.addLastNode(elementRight);

          const upperNode: GraficalDuplexGeneratedNode = {
            level: level - 1,
            key: i / 2,
            node1: upperNodeLeft,
            node2: upperNodeRight,
            id1: '',
            id2: '',
          };
          newSubTrees.push(upperNode);
        }

        this.completeTree(
          [...levelOtherSubTrees, ...newSubTrees],
          level - 1,
          response
        );
      }
    }
  }

  convertToLevelModel(
    graficalNode: GraficalNode,
    level: number,
    id: Id
  ): GraficalNodeLevel {
    return {
      node: { ...graficalNode },
      level,
      id,
    };
  }

  convertToTree(
    data: {
      child: GraficalDuplexGeneratedNode;
      index: number;
      image: string | undefined;
      self: string;
    },
    id: Id
  ): GraficalNodeLevel {
    return {
      node: {
        text: {
          name: data.self,
        },
        children: [data.child.node1, data.child.node2],
        image: data.image,
      },
      id: id,
      level: data.child.level - 1,
    };
  }

  editNodeMatch(item: any) {
    this.router.navigate([EditNodeMatchComponent.route], {
      queryParams: {
        tournamentId: this.tournamentId,
        nodeMatchId: item.id,
        locations: JSON.stringify([]),
      },
      relativeTo: this.activatedRoute,
    });
  }

  async generateVisualNodeFromName(id: string): Promise<GraficalNode> {
    const data = await this.store
      .select(selectTeamById(id))
      .pipe(
        first((x) => {
          return !!x;
        })
      )
      .toPromise();
    return {
      text: {
        name: data.name,
      },
      image: data.miniShield || '../assets/temp2.png',
      children: [],
    };
  }

  async generateVisualNodes(
    nodeMatch: NodeMatchEntity
  ): Promise<GraficalDuplexGeneratedNode> {
    const nodeChart1 = await this.generateVisualNodeFromName(
      nodeMatch.match?.teamAId
    );
    const nodeChart2 = await this.generateVisualNodeFromName(
      nodeMatch.match?.teamBId
    );

    return {
      level: nodeMatch.level,
      key: nodeMatch.key,
      node1: nodeChart1,
      node2: nodeChart2,
      id1: nodeMatch.match.teamAId,
      id2: nodeMatch.match.teamBId,
    };
  }

  isAllowedToEditMatch() {
    const identifier = 'tournaments:edit-match:ui';
    return hasPermission(identifier, this.resourcesPermissions);
  }

  makePagination() {
    if (this.sortedNodeMatches) {
      this.currentMatches = [];

      this.length = this.sortedNodeMatches.length;
      let i = 1;
      this.paginatedMatches = [];
      let temp = [];

      for (const match of this.sortedNodeMatches) {
        temp.push(match);
        if (i == this.pageSize) {
          this.paginatedMatches.push([...temp]);
          i = 0;
          temp = [];
        }
        i++;
      }
      if (temp.length > 0) {
        this.paginatedMatches.push([...temp]);
      }
      if (this.paginatedMatches.length > 0) {
        this.currentMatches = this.paginatedMatches[0];
      }
    }
  }

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.store.dispatch(
      GetMainDrawByTournamentCommand({
        tournamentId: this.tournamentId,
      })
    );
    this.$nodeMatches = this.store.select(
      selectMainDrawByTournamentId(this.tournamentId)
    );

    this.$nodeMatches.subscribe((data) => {
      if (data) {
        this.onExistData.emit(data.length > 0);
        this.nodeMatches = data;

        this.sortNodeMatches();
        this.sortedNodeMatches = [...this.nodeMatches].sort((prev, curre) => {
          return prev.level <= curre.level ? -1 : 1;
        });
        this.makePagination();
        if (this.paginatedMatches.length > 0) {
          this.onPage(0);
        }
        const maxLevel = this.sortedNodeMatchesOriginal[0]?.level;
        if (maxLevel !== undefined) {
          const trees: GraficalNodeLevel[] = [];
          const childrenOf: GraficalDuplexGeneratedNode[] = [];

          this.vegeta(
            [...this.sortedNodeMatchesOriginal],
            childrenOf,
            trees
          ).then((x) => {
            const response: { tree: null | GraficalDuplexGeneratedNode } = {
              tree: null,
            };
            this.completeTree(childrenOf, maxLevel, response);

            if (response.tree) {
              this.tree = this.addLastNode(response.tree);
            }
          });
        }
      }
    });
  }

  onPage(event: number) {
    this.currentMatches = this.paginatedMatches[event];
  }

  onViewMatch(data: any) {
    this.dialog.open(MatchVisualizationComponent, {
      data: {
        ...data,
        tournamentId: this.tournamentId,
      },
      minHeight: '80vh',
    });
  }

  searchRelativeBelowChildren(
    childrenOf: Array<GraficalDuplexGeneratedNode>,
    nodeMatch: NodeMatchEntity
  ) {
    const response = [];
    let i = 0;
    for (const child of childrenOf) {
      if (nodeMatch.level + 1 === child.level) {
        if (nodeMatch.match.teamAId === child.id1) {
          response.push({
            child,
            image: child.node1.image,
            index: i,
            self: child.node1.text.name,
          });
        } else if (nodeMatch.match.teamAId === child.id2) {
          response.push({
            child,
            image: child.node2.image,
            index: i,
            self: child.node2.text.name,
          });
        }
      }

      if (
        nodeMatch.level + 1 === child.level &&
        (nodeMatch.match.teamBId === child.id1 ||
          nodeMatch.match.teamBId === child.id2)
      ) {
        if (nodeMatch.match.teamBId === child.id1) {
          response.push({
            child,
            image: child.node1.image,
            index: i,
            self: child.node1.text.name,
          });
        } else if (nodeMatch.match.teamBId === child.id2) {
          response.push({
            child,
            image: child.node2.image,
            index: i,
            self: child.node2.text.name,
          });
        }
      }

      i++;
    }
    return response;
  }

  async vegeta(
    nodeMatchesList: Array<NodeMatchEntity>,
    childrenOf: Array<GraficalDuplexGeneratedNode>,
    trees: Array<GraficalNodeLevel>
  ) {
    if (nodeMatchesList.length > 0) {
      const currentNode = nodeMatchesList[0];

      const generatedVisualNodes: GraficalDuplexGeneratedNode =
        await this.generateVisualNodes(currentNode);

      const children = this.searchRelativeBelowChildren(
        childrenOf,
        currentNode
      );

      if (!!children && children.length > 0) {
        const selectedChildren = [...children];

        for (const iterator of selectedChildren.reverse()) {
          childrenOf.splice(iterator.index, 1);
        }

        const tree1 = this.convertToTree(
          children[0],
          currentNode.match.teamAId
        );
        const tree2 = this.convertToTree(
          children[1],
          currentNode.match.teamBId
        );

        childrenOf.push({
          level: tree1.level,
          key: currentNode.key,
          node1: tree1.node,
          node2: tree2.node,
          id1: currentNode.match.teamAId,
          id2: currentNode.match.teamBId,
        });
      } else {
        childrenOf.push(generatedVisualNodes);
      }

      nodeMatchesList.splice(0, 1);
      await this.vegeta(nodeMatchesList, childrenOf, trees);
    }
  }

  private sortNodeMatches() {
    this.sortedNodeMatchesOriginal = [...this.nodeMatches]
      .sort((prev, curre) => {
        if (prev.level > curre.level) {
          return -1;
        } else if (prev.level === curre.level) {
          if (prev.key > curre.key) {
            return -1;
          } else {
            return 0;
          }
        } else {
          return 0;
        }
      })
      .filter((c) => {
        return c.key !== -1;
      });
  }
}
