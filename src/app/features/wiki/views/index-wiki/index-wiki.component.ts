import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { MODULE_PATH } from '../../wiki.constants';
import { HowToRegisterATeamIntoTournamentComponent } from '../how-to-register-a-team-into-tournament/how-to-register-a-team-into-tournament.component';
import { TournamentStatusWikiComponent } from '../tournament-status-wiki/tournament-status-wiki.component';


interface WikiNode {
  name: string;
  link?: string;
  children?: WikiNode[];
}

const TREE_DATA: WikiNode[] = [
  {
    name: 'Usuarios',
    children: [
      {
        name: 'Roles',
        children: [
          {
            name: '¿Qué y cuáles son los roles dentro de Deporty?',
          },

          {
            name: 'Rol: Organizador de torneos',
          },
          {
            name: 'Rol: Réferi',
          },
        ],
      },
      { name: '¿Cómo me registro en Deporty?', },
    ],
  },
  {
    name: 'Organizaciones',
    children: [
      {
        name: 'Plantillas de torneos',
      },
      {
        name: 'Miembros',
      },
    ],
  },
  {
    name: 'Torneos',
    children: [
      {
        name: 'Estado de un torneo',
        link: `./${MODULE_PATH}/${TournamentStatusWikiComponent.route}`
      },
      {
        name: '¿Cómo se inscriben los equipos a un Torneo?',
        link: `./${MODULE_PATH}/${HowToRegisterATeamIntoTournamentComponent.route}`
      },
      {
        name: 'Etapas de un torneo',
        children: [
          {
            name: '¿Qué son?',
          },
          {
            name: '¿Cómo se crean los grupos?',
          },
          {
            name: '¿Cómo se asignan los equipos a un grupo?',
          },
          {
            name: '¿Qué es un partido intergrupo?',
          },
        ],
      },
    ],
  },
  {
    name: 'Equipos',
    children: [
      {
        name: 'Plantillas de torneos',
      },
    ],
  },
  {
    name: 'Facturación',
    children: [
      {
        name: 'Plantillas de torneos',
      },
    ],
  },
  {
    name: 'Generalidades',
    children: [
      {
        name: 'Plantillas de torneos',
      },
    ],
  },
];

/** Flat node with expandable and level information */
interface WikiFlatNode {
  expandable: boolean;
  name: string;
  link?: string;
  level: number;
}

@Component({
  selector: 'app-index-wiki',
  templateUrl: './index-wiki.component.html',
  styleUrls: ['./index-wiki.component.scss'],
})
export class IndexWikiComponent implements OnInit {
  private _transformer = (node: WikiNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      link: node.link ,
      level,
    } as WikiFlatNode;
  };

  treeControl = new FlatTreeControl<WikiFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor() {
    this.dataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: WikiFlatNode) => node.expandable;

  ngOnInit(): void {}
}
