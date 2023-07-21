import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

interface Item {
  display: string;
  value: string;
}
@Component({
  selector: 'app-sortable-list',
  templateUrl: './sortable-list.component.html',
  styleUrls: ['./sortable-list.component.scss'],
})
export class SortableListComponent implements OnInit, AfterViewInit {
  sortable!: Sortable;

  @Input() items!: Item[];
  @Input('show-indexes') showIndexes = false;
  @Output('on-change') onChange: EventEmitter<Item[]>;
  constructor(private el: ElementRef) {
    this.onChange = new EventEmitter();
  }
  parsedItems!: Item[];
  ngAfterViewInit(): void {
    this.sortable = new Sortable(
      '.list',
      null,
      this.el.nativeElement,
      (parsedItems: Item[]) => {
        this.onChangeEvent(parsedItems);
      }
    );
  }

  onChangeEvent(parsedItems: Item[]) {
    this.onChange.emit(parsedItems);
  }
  ngOnInit(): void {
    window.addEventListener('touchmove', () => {});
  }

  init() {}
}

class Sortable {
  list: any;
  items: any[];
  animation: boolean;
  options: any;
  handle: any;
  item: any;
  itemHeight: any;
  listHeight: any;
  startTouchY: any;
  startTop: any;
  positions!: number[];
  position!: number;
  touch!: boolean;
  onChange: Function;
  parsedItems: Item[];
  constructor(
    list: string[] | string,
    options: any,
    ref: HTMLElement,
    onChange: Function
  ) {
    this.parsedItems = [];
    this.onChange = onChange;
    this.list = typeof list === 'string' ? ref.querySelector(list) : list;

    this.items = Array.from(this.list.children);
    this.animation = false;

    this.options = Object.assign(
      {
        animationSpeed: 150,
        animationEasing: 'ease-out',
      },
      options || {}
    );

    this.dragStart = this.dragStart.bind(this);
    this.dragMove = this.dragMove.bind(this);
    this.dragEnd = this.dragEnd.bind(this);

    this.list.addEventListener('touchstart', this.dragStart, false);
    this.list.addEventListener('mousedown', this.dragStart, false);
  }
  parseItems() {
    this.parsedItems = this.items.map((el: HTMLElement) => {
      const value = el.querySelector('input')!.value;
      const display = el.querySelector('.list__item-title')!.innerHTML;
      return { value, display };
    });
  }
  dragStart(event: any) {
    if (this.animation) return;
    if (event.type === 'mousedown' && event.which !== 1) return;
    if (event.type === 'touchstart' && event.touches.length > 1) return;

    this.handle = null;

    let el = event.target;
    while (el) {
      if (el.hasAttribute('sortable-handle')) this.handle = el;
      if (el.hasAttribute('sortable-item')) this.item = el;
      if (el.hasAttribute('sortable-list')) break;
      el = el.parentElement;
    }

    if (!this.handle) return;

    this.list.style.position = 'relative';
    this.list.style.height = this.list.offsetHeight + 'px';

    this.item.classList.add('is-dragging');

    this.itemHeight = this.items[1].offsetTop;
    this.listHeight = this.list.offsetHeight;
    this.startTouchY = this.getDragY(event);
    this.startTop = this.item.offsetTop;

    const offsetsTop = this.items.map((item: any) => item.offsetTop);

    this.items.forEach((item: any, index) => {
      item.style.position = 'absolute';
      item.style.top = 0;
      item.style.left = 0;
      item.style.width = '100%';
      item.style.transform = `translateY(${offsetsTop[index]}px)`;
      item.style.zIndex = item == this.item ? 2 : 1;
    });

    setTimeout(() => {
      this.items.forEach((item) => {
        if (this.item == item) return;
        item.style.transition = `transform ${this.options.animationSpeed}ms ${this.options.animationEasing}`;
      });
    });

    this.positions = this.items.map((item, index) => index);
    this.position = Math.round(
      (this.startTop / this.listHeight) * this.items.length
    );

    this.touch = event.type == 'touchstart';
    window.addEventListener(
      this.touch ? 'touchmove' : 'mousemove',
      this.dragMove,
      { passive: false }
    );
    window.addEventListener(
      this.touch ? 'touchend' : 'mouseup',
      this.dragEnd,
      false
    );
  }

  dragMove(e: any) {
    if (this.animation) return;

    const top = this.startTop + this.getDragY(e) - this.startTouchY;
    const newPosition = Math.round((top / this.listHeight) * this.items.length);

    this.item.style.transform = `translateY(${top}px)`;

    this.positions.forEach((index) => {
      if (index == this.position || index != newPosition) return;
      this.swapElements(this.positions, this.position, index);
      this.position = index;
    });

    this.items.forEach((item, index) => {
      if (item == this.item) return;
      item.style.transform = `translateY(${
        this.positions.indexOf(index) * this.itemHeight
      }px)`;
    });

    e.preventDefault();
  }

  dragEnd(e: any) {
    this.animation = true;
    this.item.style.transition = `all ${this.options.animationSpeed}ms ${this.options.animationEasing}`;
    this.item.style.transform = `translateY(${
      this.position * this.itemHeight
    }px)`;

    this.item.classList.remove('is-dragging');

    setTimeout(() => {
      this.list.style.position = '';
      this.list.style.height = '';

      this.items.forEach((item) => {
        item.style.top = '';
        item.style.left = '';
        item.style.right = '';
        item.style.position = '';
        item.style.transform = '';
        item.style.transition = '';
        item.style.width = '';
        item.style.zIndex = '';
      });

      this.positions.map((i) => this.list.appendChild(this.items[i]));
      this.items = Array.from(this.list.children);

      this.animation = false;
      this.parseItems();

      this.onChange(this.parsedItems);
    }, this.options.animationSpeed);

    window.removeEventListener(
      this.touch ? 'touchmove' : 'mousemove',
      this.dragMove,
      false
    );
    window.removeEventListener(
      this.touch ? 'touchend' : 'mouseup',
      this.dragEnd,
      false
    );
  }

  swapElements(array: any, a: any, b: any) {
    const temp = array[a];
    array[a] = array[b];
    array[b] = temp;
  }

  getDragY(e: any) {
    return e.touches ? (e.touches[0] || e.changedTouches[0]).pageY : e.pageY;
  }
}
