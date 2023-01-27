import { Component, inject, TrackByFunction } from '@angular/core';
import { ColorsService } from './services/colors.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
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
