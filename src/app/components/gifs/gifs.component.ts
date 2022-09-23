import { Component, OnInit } from '@angular/core';

interface Gif {
  url: string;
  x: string;
  y: string;
}

const GIF_COUNT = 10;

@Component({
  selector: 'app-gifs',
  templateUrl: './gifs.component.html',
  styleUrls: ['./gifs.component.scss']
})
export class GifsComponent implements OnInit {
  gifs: Gif[] = [];
  cache = localStorage.getItem('random');
  index = (this.cache ? +this.cache : null)  ?? Math.floor(Math.random() * GIF_COUNT);

  constructor() { }

  ngOnInit(): void {
  }

  push(): void {
    const x = 25 + Math.random() * 50;
    const y = 25 + Math.random() * 50;

    this.gifs.push({
      url: `assets/gifs/${this.index}.gif`,
      x: `${x}%`,
      y: `${y}%`,
    });

    this.index += 1;
    if (this.index > GIF_COUNT) {
      this.index = 0;
    }
    localStorage.setItem('random', '' + this.index);
  }
}
