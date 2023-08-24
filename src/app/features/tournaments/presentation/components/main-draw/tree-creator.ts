import { Id } from '@deporty-org/entities';
import { getStageIndicator } from 'src/app/core/helpers/general.helpers';

export interface GraficalNode {
  children: GraficalNode[];
  image?: string;
  text: {
    name: string;
  };
}
export interface GraficalNodeLevel {
  id: Id;
  level: number;
  node: GraficalNode;
}

export interface GraficalDuplexGeneratedNode {
  id1: Id;
  id2: Id;
  key: number;
  level: number;
  node1: GraficalNode;
  node2: GraficalNode;
}
export interface TreeNode {
  key: string;
  k: number;
  level: number;
  stroke?: string;
  parent?: string;
  teamA?: string;
  teamB?: string;
  shieldA?: string;
  shieldB?: string;
}

export function getParentKey(key: number, level: number) {
  if (key == 0) {
    if (level == 0) {
      return undefined;
    }
    return `K0L${level - 1}`;
  }
  return `K${Math.floor(Math.log(key) / Math.log(2))}L${level - 1}`;
}
function createEmptyNode(key: number, level: number): TreeNode {
  return {
    k: key,
    key: `K${key}L${level}`,
    level,
    parent: getParentKey(key, level),
    stroke: getStageIndicator(level).background,
  };
}
export function createTree(
  key: number,
  level: number,
  childrenOf: TreeNode[],
  maxLevel: number
): TreeNode | undefined {
  if (level > maxLevel) {
    return;
  }
  let empty = false;
  const searchMySelf = childrenOf
    .filter((value) => {
      return value.level === level && value.k === key;
    })
    .pop();
  let node = searchMySelf;
  if (!searchMySelf) {
    empty = true;
    node = createEmptyNode(key, level);
  }

  const range = Math.pow(2, level + 1);
  const range2 = Math.pow(2, key);
  let i = 0;
  let j = 1;
  if (key % 2 == 0) {
    i = -1;
    j = 0;
  }
  if (empty && node) {
    childrenOf.push(node);
  }
  createTree(range2 + i, level + 1, childrenOf, maxLevel);
  createTree(range2 + j, level + 1, childrenOf, maxLevel);
}
