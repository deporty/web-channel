import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TreeNode } from '../main-draw/tree-creator';
import {
  Binding,
  Diagram,
  GraphObject,
  Margin,
  Node,
  Panel,
  Picture,
  Shape,
  TextBlock,
  TreeLayout,
  TreeModel,
} from 'gojs';
const $ = GraphObject.make; // for conciseness in defining templates in this function
import * as go from 'gojs';

export class DoubleTreeLayout extends go.Layout {
  private _vertical: boolean = false;
  private _directionFunction: (node: go.Node) => boolean = function (
    node: go.Node
  ): boolean {
    return true;
  };
  private _bottomRightOptions: Partial<go.TreeLayout> | null = null;
  private _topLeftOptions: Partial<go.TreeLayout> | null = null;

  /**
   * When false, the layout should grow towards the left and towards the right;
   * when true, the layout show grow upwards and downwards.
   * The default value is false.
   */
  get vertical(): boolean {
    return this._vertical;
  }
  set vertical(value: boolean) {
    if (typeof value !== 'boolean')
      throw new Error(
        'new value for DoubleTreeLayout.vertical must be a boolean value.'
      );
    if (this._vertical !== value) {
      this._vertical = value;
      this.invalidateLayout();
    }
  }

  /**
   * This function is called on each child node of the root node
   * in order to determine whether the subtree starting from that child node
   * will grow towards larger coordinates or towards smaller ones.
   * The value must be a function and must not be null.
   * It must return true if {@link #isPositiveDirection} should return true; otherwise it should return false.
   */
  get directionFunction(): (node: go.Node) => boolean {
    return this._directionFunction;
  }
  set directionFunction(value: (node: go.Node) => boolean) {
    if (typeof value !== 'function') {
      throw new Error(
        'new value for DoubleTreeLayout.directionFunction must be a function taking a node data object and returning a boolean.'
      );
    }
    if (this._directionFunction !== value) {
      this._directionFunction = value;
      this.invalidateLayout();
    }
  }

  /**
   * Gets or sets the options to be applied to a {@link TreeLayout}.
   * By default this is null -- no properties are set on the TreeLayout
   * other than the {@link TreeLayout#angle}, depending on {@link #vertical} and
   * the result of calling {@link #directionFunction}.
   */
  get bottomRightOptions(): Partial<go.TreeLayout> | null {
    return this._bottomRightOptions;
  }
  set bottomRightOptions(value: Partial<go.TreeLayout> | null) {
    if (this._bottomRightOptions !== value) {
      this._bottomRightOptions = value;
      this.invalidateLayout();
    }
  }

  /**
   * Gets or sets the options to be applied to a {@link TreeLayout}.
   * By default this is null -- no properties are set on the TreeLayout
   * other than the {@link TreeLayout#angle}, depending on {@link #vertical} and
   * the result of calling {@link #directionFunction}.
   */
  get topLeftOptions(): Partial<go.TreeLayout> | null {
    return this._topLeftOptions;
  }
  set topLeftOptions(value: Partial<go.TreeLayout> | null) {
    if (this._topLeftOptions !== value) {
      this._topLeftOptions = value;
      this.invalidateLayout();
    }
  }

  /**
   * @ignore
   * Copies properties to a cloned Layout.
   */
  protected override cloneProtected(copy: this): void {
    super.cloneProtected(copy);
    copy._vertical = this._vertical;
    copy._directionFunction = this._directionFunction;
    copy._bottomRightOptions = this._bottomRightOptions;
    copy._topLeftOptions = this._topLeftOptions;
  }

  /**
   * Perform two {@link TreeLayout}s by splitting the collection of Parts
   * into two separate subsets but sharing only a single root Node.
   * @param coll
   */
  public override doLayout(
    coll: go.Diagram | go.Group | go.Iterable<go.Part>
  ): void {
    const coll2: go.Set<go.Part> = this.collectParts(coll);
    if (coll2.count === 0) return;
    const diagram = this.diagram;
    if (diagram !== null) diagram.startTransaction('Double Tree Layout');

    // split the nodes and links into two Sets, depending on direction
    const leftParts = new go.Set<go.Part>();
    const rightParts = new go.Set<go.Part>();
    this.separatePartsForLayout(coll2, leftParts, rightParts);
    // but the ROOT node will be in both collections

    // create and perform two TreeLayouts, one in each direction,
    // without moving the ROOT node, on the different subsets of nodes and links
    const layout1 = this.createTreeLayout(true);
    layout1.angle = this.vertical ? 270 : 180;
    layout1.arrangement = go.TreeLayout.ArrangementFixedRoots;

    const layout2 = this.createTreeLayout(true);
    layout2.angle = this.vertical ? 90 : 0;
    layout2.arrangement = go.TreeLayout.ArrangementFixedRoots;

    layout1.doLayout(leftParts);
    layout2.doLayout(rightParts);

    if (diagram !== null) diagram.commitTransaction('Double Tree Layout');
  }

  /**
   * This just returns an instance of {@link TreeLayout}.
   * The caller will set the {@link TreeLayout#angle}.
   * @param {boolean} positive true for growth downward or rightward
   * @return {TreeLayout}
   */
  protected createTreeLayout(positive: boolean): go.TreeLayout {
    const lay = new go.TreeLayout();
    let opts = this.topLeftOptions;
    if (positive) opts = this.bottomRightOptions;
    if (opts)
      for (const p in opts) {
        (<any>lay)[p] = (<any>opts)[p];
      }
    return lay;
  }

  /**
   * This is called by {@link #doLayout} to split the collection of Nodes and Links into two Sets,
   * one for the subtrees growing towards the left or upwards, and one for the subtrees
   * growing towards the right or downwards.
   */
  protected separatePartsForLayout(
    coll: go.Set<go.Part>,
    leftParts: go.Set<go.Part>,
    rightParts: go.Set<go.Part>
  ): void {
    let root: go.Node | null = null; // the one root
    const roots = new go.Set<go.Node>(); // in case there are multiple roots
    coll.each(function (node: go.Part) {
      if (node instanceof go.Node && node.findTreeParentNode() === null)
        roots.add(node);
    });
    if (roots.count === 0) {
      // just choose the first node as the root
      const it = coll.iterator;
      while (it.next()) {
        if (it.value instanceof go.Node) {
          root = it.value;
          break;
        }
      }
    } else if (roots.count === 1) {
      // normal case: just one root node
      root = roots.first();
    } else {
      // multiple root nodes -- create a dummy node to be the one real root
      root = new go.Node(); // the new root node
      root.location = new go.Point(0, 0);
      const forwards = this.diagram ? this.diagram.isTreePathToChildren : true;
      // now make dummy links from the one root node to each node
      roots.each(function (child) {
        const link = new go.Link();
        if (forwards) {
          link.fromNode = root;
          link.toNode = child;
        } else {
          link.fromNode = child;
          link.toNode = root;
        }
      });
    }
    if (root === null) return;

    // the ROOT node is shared by both subtrees
    leftParts.add(root);
    rightParts.add(root);
    const lay = this;
    // look at all of the immediate children of the ROOT node
    root.findTreeChildrenNodes().each(function (child) {
      // in what direction is this child growing?
      const bottomright = lay.isPositiveDirection(child);
      const parts = bottomright ? rightParts : leftParts;
      // add the whole subtree starting with this child node
      parts.addAll(child.findTreeParts());
      // and also add the link from the ROOT node to this child node
      const plink = child.findTreeParentLink();
      if (plink !== null) parts.add(plink);
    });
  }

  /**
   * This predicate is called on each child node of the root node,
   * and only on immediate children of the root.
   * It should return true if this child node is the root of a subtree that should grow
   * rightwards or downwards, or false otherwise.
   * @param {Node} child
   * @returns {boolean} true if grows towards right or towards bottom; false otherwise
   */
  protected isPositiveDirection(child: go.Node): boolean {
    const f = this.directionFunction;
    if (!f)
      throw new Error(
        'No DoubleTreeLayout.directionFunction supplied on the layout'
      );
    return f(child);
  }
}
@Component({
  selector: 'app-main-draw-tree',
  templateUrl: './main-draw-tree.component.html',
  styleUrls: ['./main-draw-tree.component.scss'],
})
export class MainDrawTreeComponent implements OnInit, AfterViewInit {
  @Input() tree!: TreeNode[];

  myDiagram!: Diagram;
  nodeTemplate: any;

  constructor() {
    this.nodeTemplate = $(
      Node,
      'Auto',
      $(
        Shape,
        'RoundedRectangle',
        {
          fill: 'white',
        },
        new Binding('stroke', 'stroke')
      ),

      $(
        Panel,
        'Horizontal',
        { margin: 5 },
        $(
          Picture,
          {
            width: 30,
            height: 30,
          },
          new Binding('source', 'shieldA')
        ),
        $(
          TextBlock,
          {
            margin: new Margin(0, 5),
            text: 'VS',
            stroke: 'black',
            font: 'bold 12px sans-serif',
          }
          // new Binding('text', 'key')
        ),
        $(
          Picture,
          {
            width: 30,
            height: 30,
          },
          new Binding('source', 'shieldB')
        )
      )
    );
  }
  ngAfterViewInit(): void {
    window.onresize = () => this.redrawChart();
    this.redrawChart();
  }

  redrawChart() {
    this.draw();
  }

  ngOnInit(): void {}

  draw() {
    setTimeout(() => {
      console.log(this.tree);
      console.log(DoubleTreeLayout);

      this.myDiagram = new Diagram('myDiagramDiv', {
        layout: $(DoubleTreeLayout, {
          vertical: true, // default directions are horizontal
          directionFunction: (n: Node) => {
            if (n.data) {
              const total = Math.pow(2, n.data.level);
              const half = total / 2;
              return n.data.k >= half;
            }
            return n.data && n.data.dir !== 'left';
          },
          bottomRightOptions: { nodeSpacing: 0, layerSpacing: 20 },
        }),
      });

      const treeLayout = GraphObject.make(TreeLayout, {
        angle: 0, // Organiza en dirección vertical
        arrangement: TreeLayout.AlignmentTopLeftBus, // Organiza en dos ramas separadas
        layerSpacing: 10, // Espacio entre las capas de nodos
        alignment: TreeLayout.AlignmentCenterChildren, // Alineación en forma de bus
        nodeSpacing: 10, // Espacio entre nodos en la misma capa
        layerStyle: TreeLayout.PathDestination, // Estilo uniforme de capas
        compaction: TreeLayout.StyleLastParents, // Sin compactación
      });

      // const layout = new DoubleTreeLayout();

      // this.myDiagram.layout = treeLayout;

      // new go.TreeLayout({
      //   alternateAngle: 90,
      //   angle: 180,
      // });

      this.myDiagram.nodeTemplate = this.nodeTemplate;

      this.myDiagram.model = new TreeModel([...this.tree]);
    }, 3000);
  }
}
