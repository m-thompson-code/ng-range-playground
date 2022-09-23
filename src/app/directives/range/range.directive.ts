import {
  Directive,
  Input,
  SimpleChange,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
  EmbeddedViewRef,
  inject
} from '@angular/core';

@Directive({
  selector: '[ngRange]',
})
export class RangeDirective {
  @Input() ngRange: number = 0;
}
