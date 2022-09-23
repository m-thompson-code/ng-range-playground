import { Injectable } from '@angular/core';
import { colors } from './colors';

@Injectable({
  providedIn: 'root'
})
export class ColorsService {
  getRandomColor(): string {
    return `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
  }

  getRandomColors(length: number): string[] {
    return Array.from({length}, () => this.getRandomColor());
  }

  getStaticRandomColors(length: number): string[] {
    return Array.from({length}, (_, i) => this.getCachedColor(i));
  }

  getCachedColor(index: number): string {
    return colors[index % colors.length];
  }
}
