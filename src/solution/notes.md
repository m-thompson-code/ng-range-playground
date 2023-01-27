## Notes

```html
<H1>Hello World</H1>

<button class="" (click)="max = max + 1">+</button>
<button (click)="max = max - 1">-</button>
Max: {{ max }}

<p>0</p>
<p>1</p>
<p>2</p>
<p>3</p>
<p>4</p>
```

```html
<p *ngRange="max">Moocow</p>
```

### Naive Solution to *ngRange part 1

```typescript
export class RangeDirective {
  @Input() ngRange: number = 0;

  constructor(
    // Access template
    private readonly templateRef: TemplateRef<unknown>,
    // Inject view into current template
    private readonly viewContainer: ViewContainerRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);

    this.viewContainer.clear();

    for (let i = 0; i < this.ngRange; i++) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
```

### Adding index

```typescript
export class RangeDirective {
  // ...
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);

    this.viewContainer.clear();

    for (let i = 0; i < this.ngRange; i++) {
      this.viewContainer.createEmbeddedView(this.templateRef, { index: i });
    }
  }
}
```

```html
<div class="grid">
    <anime *ngRange="max; let i = index">Moocow {{ i }}</anime>
</div>
```

### Optimizing solution

```typescript
export class RangeDirective {
  // ...
  applyViewChanges(): void {
  // Not in current range -> Remove from parent view

  // Wasn't in previous range -> Add to parent view
  }
}
```

```typescript
export class RangeDirective {
  // ...
  getViewChanges(
    previousMax: number,
    max: number
  ): EmbeddedViewChange[] {
    const viewChanges: EmbeddedViewChange[] = [];

    console.log('max', previousMax, '->', max);

    for (let i = 0; i < Math.max(previousMax, max); i++) {
      const inPreviousRange = i < previousMax;
      const inRange = i < max;

      viewChanges.push({
        index: i,
        inPreviousRange,
        inRange
      });
    }

    return viewChanges;
  }
}
```

```typescript
export class RangeDirective {
  // ...
  applyViewChanges(viewChanges: EmbeddedViewChange[]): void {
    viewChanges.forEach(viewChange => {
      // Not in current range -> Remove from parent view
      if (!viewChange.inRange) {
        this.viewContainer.remove();
        return;
      }

      // Wasn't in previous range -> Add to parent view
      if (!viewChange.inPreviousRange) {
        this.viewContainer.createEmbeddedView(this.templateRef, { index: viewChange.index });
      }
    });
  }
}
```

### Adding more Context features

```typescript
interface Context {
  index: number;
  even: boolean;
  odd: boolean;
  first: boolean;
  last: boolean;
}
```

```typescript
export class RangeDirective {
  // ...
  getContext(index: number, max: number): Context {
    return {
      index,
      even: !(index % 2),
      odd: !!(index % 2),
      first: index === 0,
      last: index === max - 1,
    };
  }
}
```

```typescript
export class RangeDirective {
  // ...
  applyViewChanges(viewChanges: EmbeddedViewChange[], max: number): void {
    viewChanges.forEach(viewChange => {
      // Not in current range -> Remove from parent view
      if (!viewChange.inRange) {
        this.viewContainer.remove();
        return;
      }

      // Wasn't in previous range -> Add to parent view
      if (!viewChange.inPreviousRange) {
        const context = this.getContext(viewChange.index, max);
        // NOTE: Requires small refactor to add `max` argument to `applyViewChanges()`
        this.viewContainer.createEmbeddedView(this.templateRef, context);
      }
    });
  }
}
```

```html
<div class="grid">
    <anime
        *ngRange="max; let i = index; let first = first; let last = last; let odd = odd; let even = even"
    >
        Moocow {{ i }}
        {{ odd ? ' odd ' : '' }}
        {{ even ? ' even ' : '' }}
        {{ first ? ' first ' : '' }}
        {{ last ? ' last ' : '' }}
    </anime>
</div>
```

```typescript
export class RangeDirective {
  // ...
  /**
   * Provides Context types to the template. i.e. index, odd, even, first, last
   */
  static ngTemplateContextGuard(_: RangeDirective, context: Context): context is Context {
    return true;
  }
}
```

### Updating Context

```typescript
export class RangeDirective {
  // ...
  applyContextChange(view: EmbeddedViewRef<Context>, context: Context) {
    view.context = context;
  }
}
```

```typescript
interface EmbeddedViewChange {
  inPreviousRange: boolean;
  inRange: boolean;
  index: number;
  view: EmbeddedViewRef<Context>// NOTE: <-- Added this
}
```

### Adding min property

```html
<app-range-input #range></app-range-input>
```

```typescript
export class RangeDirective {
  // ...
  applyContextChange(view: EmbeddedViewRef<Context>, context: Context) {
    view.context = context;
  }
}
```

```html
<div class="grid">
    <ng-template [ngRange]="range.max" [ngRangeMin]="range.min" let-i="index" let-first="first" let-last="last" let-odd="odd" let-even="even">
        <anime>
            Moocow {{ i }}
            {{ odd ? ' odd ' : '' }}
            {{ even ? ' even ' : '' }}
            {{ first ? ' first ' : '' }}
            {{ last ? ' last ' : '' }}
        </anime>
    </ng-template>
</div>
```

The rest of the solution is found at `solution/solution` (includes step input bind)

### Using *ngFor instead

```html
<button (click)="randomize()">Randomize</button>
<button (click)="push()">Push</button>
<button (click)="pop()">Pop</button>

<div class="grid">
    <anime *ngFor="let color of colors; let i = index">
        Moocow {{ i }}
    </anime>
</div>
```

```typescript
export class AppComponent {
  colorService = inject(ColorsService);
  colors = this.colorService.getStaticRandomColors(10);

  randomize(): void {
    console.log('randomize()');

    // this.colors = [...this.colors];
    this.colors = this.colorService.getRandomColors(this.colors.length);
  }

  push(): void {
    console.log('push()');

    this.colors.push(this.colorService.getRandomColor());
  }

  pop(): void {
    console.log('pop()');

    this.colors.pop();
  }

  trackByIndex: TrackByFunction<number> = (index: number, _: unknown) => {
    return index;
  }
}
```

### Using trackByIndex

```html
<button (click)="randomize()">Randomize</button>
<button (click)="push()">Push</button>
<button (click)="pop()">Pop</button>

<div class="grid">
    <anime *ngFor="let color of colors; trackBy: trackByIndex; let i = index">
        Moocow {{ i }}
    </anime>
</div>
```